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

  // Sanitize packageVersion to remove invalid characters for Lambda layerName
  const sanitizedVersion = packageVersion.replace(/\./g, "-");
  const pulumiResourceBaseName = `${opts.prefixProjectName !== false ? project + "-" : ""}${
    opts.prefixProjectEnv !== false ? stack + "-" : ""
  }${opts.name}-${versionHash}-${sanitizedVersion}`;
  const pulumiResourceRegionName = `${pulumiResourceBaseName}-${regionName}`;
  writeFileSync(dockerfilePath, dockerfileContents, { encoding: "utf-8" });

  pulumi.log.info(
    `Building Lambda Layer ${pulumiResourceBaseName} with Dockerfile: ${dockerfilePath}`,
  );
  pulumi.log.info(`Dockerfile contents:\n${dockerfileContents}`);

  // if process.env.HOME is not set, set it to the current working directory
  if (!process.env.HOME) {
    process.env.HOME = process.cwd();
  }

  const image = new docker.Image(`${pulumiResourceRegionName}-build`, {
    ...imageArgs,
    imageName: pulumiResourceRegionName,
    skipPush: true,
    build: {
      context: ".",
      dockerfile: dockerfilePath,
    },
  });

  const containerName = `${pulumiResourceRegionName}-extract`;
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

  const extractDir = path.join(layerDir, "layer");
  const extractCommand = pulumi.interpolate`docker cp ${containerName}:/tmp/layer ${extractDir}`;
  const commandResponse = new local.Command(
    `${pulumiResourceRegionName}-extract-layer`,
    {
      create: extractCommand,
      delete: pulumi.interpolate`rm -rf ${extractDir}`,
      triggers: [container],
      assetPaths: [extractDir],
    },
    {
      dependsOn: [container],
    },
  );

  return new aws.lambda.LayerVersion(
    `${pulumiResourceRegionName}-layer`,
    {
      layerName: pulumiResourceRegionName,
      code: new pulumi.asset.FileArchive(extractDir),
      compatibleRuntimes: opts.runtimes,
      compatibleArchitectures: opts.architectures,
    },
    {
      provider:
        typeof opts.awsProvider !== "undefined" ? opts.awsProvider : undefined,
      dependsOn: [image, commandResponse],
    },
  );
}
