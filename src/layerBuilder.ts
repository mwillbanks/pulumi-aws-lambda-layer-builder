import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as path from "path";
import { renderDockerfile, hashContent } from "./utils";

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

  const image = new docker.RemoteImage(`${opts.name}-build`, {
    ...imageArgs,
    name: imageName,
    build: {
      context: layerDir,
      dockerfile: dockerfile,
    },
  });

  const zipPath = path.join(layerDir, `${opts.name}.zip`);
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
