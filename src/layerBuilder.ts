import * as pulumi from "@pulumi/pulumi";
import { local } from "@pulumi/command";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as path from "path";
import { renderDockerfile, hashContent } from "./utils";
import { mkdirSync } from "fs";

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

export function buildLambdaLayer(
  opts: LayerBuilderOpts,
): aws.lambda.LayerVersion {
  const project = pulumi.getProject();
  const stack = pulumi.getStack();
  const layerDir = path.join("layers", opts.name);
  const dockerfile = renderDockerfile(opts);
  const versionHash = hashContent(dockerfile);
  const imageName = pulumi.interpolate`lambda-layer-${opts.name}-${versionHash}`;
  const imageArgs = opts.imageArgs || {};

  mkdirSync(layerDir, { recursive: true });

  const image = new docker.RemoteImage(`${opts.name}-build`, {
    ...imageArgs,
    name: imageName,
    build: {
      context: layerDir,
      dockerfile: dockerfile,
    },
  });

  const containerName = `${opts.name}-extract-${versionHash}`;
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
    `${opts.name}-extract-file`,
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

  const fullName = `${opts.prefixProjectName !== false ? project + "-" : ""}${
    opts.prefixProjectEnv !== false ? stack + "-" : ""
  }${opts.name}-${versionHash}`;

  const optProvider = opts.awsProvider
    ? { provider: opts.awsProvider }
    : undefined;

  return new aws.lambda.LayerVersion(
    opts.name,
    {
      layerName: fullName,
      code: archive,
      compatibleRuntimes: opts.runtimes,
      compatibleArchitectures: opts.architectures,
    },
    optProvider,
  );
}
