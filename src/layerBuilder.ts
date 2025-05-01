import * as pulumi from "@pulumi/pulumi";
import { local } from "@pulumi/command";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as path from "path";
import { renderDockerfile, hashContent } from "./utils";
import { mkdirSync, readFileSync, writeFileSync } from "fs";

export interface LayerBuilderImagePackageMgrOpts {
  repos: {
    [key: string]: {
      base: string;
      packages: string[];
    };
  };
}

export interface LayerBuilderOpts {
  name: string;
  imageName: pulumi.Input<string>;
  imageArgs?: docker.RemoteImageArgs;
  imagePkgManager: "apt" | "dnf" | "yum";
  runtimes?: aws.lambda.LayerVersionArgs["compatibleRuntimes"];
  architectures?: aws.lambda.LayerVersionArgs["compatibleArchitectures"];
  packages: [string, LayerBuilderPackageOpts][];
  prefixProjectName?: boolean;
  prefixProjectEnv?: boolean;
  awsProvider?: aws.Provider;
}

export type LayerBuilderPackageOpts =
  | {
      bin?: boolean;
      lib?: boolean;
      shared?: boolean;
      conf?: boolean;
      manualDownloadUrl?: string;
    }
  | "*"
  | undefined;

const getNodeModulePackageJson = (pkg: string): Record<string, any> => {
  const pkgPath = require.resolve(`${pkg}/package.json`);
  const file = readFileSync(pkgPath, { encoding: "utf-8" });
  return JSON.parse(file);
};

export function buildLambdaLayer(
  opts: LayerBuilderOpts,
): aws.lambda.LayerVersion {
  const project = pulumi.getProject();
  const stack = pulumi.getStack();
  const region = opts.awsProvider?.region || "default";
  const layerDir = path.join("layers", opts.name);
  const dockerfileContents = renderDockerfile(opts);
  const versionHash = hashContent(dockerfileContents);
  const dockerfilePath = path.join(layerDir, `${versionHash}-Dockerfile`);
  const imageName = pulumi.interpolate`lambda-layer-${opts.name}-${versionHash}`;
  const imageArgs = opts.imageArgs || {};
  const packageVersion =
    getNodeModulePackageJson("@mwillbanks/pulumi-layer-builder/package.json")
      ?.version || "unknown";

  const pulumiResourceBaseName = `${opts.prefixProjectName !== false ? project + "-" : ""}${
    opts.prefixProjectEnv !== false ? stack + "-" : ""
  }${opts.name}-${versionHash}-${region}-${packageVersion}`;

  mkdirSync(layerDir, { recursive: true });
  writeFileSync(dockerfilePath, dockerfileContents, { encoding: "utf-8" });

  // if process.env.HOME is not set, set it to the current working directory
  if (!process.env.HOME) {
    process.env.HOME = process.cwd();
  }

  const image = new docker.RemoteImage(`${pulumiResourceBaseName}-build`, {
    ...imageArgs,
    name: imageName,
    build: {
      context: layerDir,
      dockerfile: `${versionHash}-Dockerfile`,
    },
  });

  const containerName = `${pulumiResourceBaseName}-extract`;
  const container = new docker.Container(
    `${opts.name}-extract`,
    {
      name: containerName,
      image: image.repoDigest,
      mustRun: true,
      rm: true,
      command: ["sleep", "10"], // Keep container alive briefly to extract file
    },
    {
      dependsOn: [image],
    },
  );
  const zipPath = path.join(layerDir, `${opts.name}.zip`);
  const extractCommand = pulumi.interpolate`docker cp ${containerName}:/tmp/layer/${opts.name}.zip ${layerDir}/${opts.name}.zip`;
  const extractFile = new local.Command(
    `${pulumiResourceBaseName}-copy-zip`,
    {
      create: extractCommand,
      update: extractCommand,
      delete: pulumi.interpolate`rm -f ${zipPath}`,
    },
    {
      dependsOn: [container],
    },
  );
  const archive = new pulumi.asset.FileArchive(zipPath);

  const optProvider = opts.awsProvider
    ? { provider: opts.awsProvider }
    : undefined;

  return new aws.lambda.LayerVersion(
    `${pulumiResourceBaseName}-layer`,
    {
      layerName: pulumiResourceBaseName,
      code: archive,
      compatibleRuntimes: opts.runtimes,
      compatibleArchitectures: opts.architectures,
    },
    optProvider,
  );
}
