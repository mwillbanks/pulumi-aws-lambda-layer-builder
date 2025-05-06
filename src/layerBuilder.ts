import * as pulumi from "@pulumi/pulumi";
import { local } from "@pulumi/command";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as path from "path";
import { renderDockerfile, hashContent } from "./utils";
import { mkdirSync, writeFileSync } from "fs";
import packageVersion from "./version";

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
  imageArgs?: docker.ImageArgs;
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
      conf?: boolean;
      include?: boolean;
      lib?: boolean;
      manualDownloadUrl?: string;
      shared?: boolean;
    }
  | "*"
  | undefined;

export function buildLambdaLayer(
  opts: LayerBuilderOpts,
): aws.lambda.LayerVersion {
  const project = pulumi.getProject();
  const stack = pulumi.getStack();
  const layerDir = path.join("layers", opts.name);
  // @ts-ignore regionName is a custom property
  const regionName = opts.awsProvider?.regionName || "default";
  mkdirSync(layerDir, { recursive: true });
  const dockerfileContents = renderDockerfile(opts);
  const versionHash = hashContent(dockerfileContents);
  const dockerfilePath = path.join(layerDir, `${versionHash}-Dockerfile`);
  const imageArgs = opts.imageArgs || {};

  const pulumiResourceBaseName = `${opts.prefixProjectName !== false ? project + "-" : ""}${
    opts.prefixProjectEnv !== false ? stack + "-" : ""
  }${opts.name}-${versionHash}-${regionName}-${packageVersion}`;
  writeFileSync(dockerfilePath, dockerfileContents, { encoding: "utf-8" });

  pulumi.log.info(
    `Building Lambda Layer ${pulumiResourceBaseName} with Dockerfile: ${dockerfilePath}`,
  );
  pulumi.log.info(`Dockerfile contents:\n${dockerfileContents}`);

  // if process.env.HOME is not set, set it to the current working directory
  if (!process.env.HOME) {
    process.env.HOME = process.cwd();
  }

  const image = new docker.Image(`${pulumiResourceBaseName}-build`, {
    ...imageArgs,
    imageName: pulumiResourceBaseName,
    skipPush: true,
    build: {
      context: ".",
      dockerfile: dockerfilePath,
    },
  });

  const containerName = `${pulumiResourceBaseName}-extract`;
  const container = new docker.Container(
    `${containerName}`,
    {
      name: containerName,
      image: image.repoDigest,
      mustRun: true,
      rm: true,
      command: ["sleep", "60"], // Keep container alive briefly to extract file
    },
    {
      dependsOn: [image],
    },
  );
  const zipPath = path.join(layerDir, `${opts.name}.zip`);
  const extractCommand = pulumi.interpolate`docker cp ${containerName}:/tmp/layer/${opts.name}.zip ${zipPath}`;
  const commandResponse = new local.Command(
    `${pulumiResourceBaseName}-copy-zip`,
    {
      create: extractCommand,
      delete: pulumi.interpolate`rm -f ${zipPath}`,
      triggers: [container],
      assetPaths: [zipPath],
    },
    {
      dependsOn: [container],
    },
  );

  const optProvider = opts.awsProvider
    ? { provider: opts.awsProvider }
    : undefined;

  return new aws.lambda.LayerVersion(
    `${pulumiResourceBaseName}-layer`,
    {
      layerName: pulumiResourceBaseName,
      code: new pulumi.asset.FileArchive(zipPath),
      compatibleRuntimes: opts.runtimes,
      compatibleArchitectures: opts.architectures,
    },
    {
      ...optProvider,
      dependsOn: [image, commandResponse],
    },
  );
}
