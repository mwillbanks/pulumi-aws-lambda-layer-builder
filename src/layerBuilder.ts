import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as path from "path";
import { renderDockerfile, hashContent } from "./utils";

export interface LayerBuilderOpts {
  name: string;
  /** Base image: name or Pulumi Docker image */
  baseImage: pulumi.Input<string | docker.Image | docker.RemoteImage | docker.RegistryImage>;
  /** Lambda runtimes */
  runtimes?: aws.lambda.LayerVersionArgs["compatibleRuntimes"];
  /** Lambda architectures */
  architectures?: aws.lambda.LayerVersionArgs["compatibleArchitectures"];
  /** Packages and extraction config */
  packages: [string, LayerBuilderPackageOpts][];
  prefixProjectName?: boolean;
  prefixProjectEnv?: boolean;
}

export type LayerBuilderPackageOpts = {
  bin?: boolean;
  lib?: boolean;
  shared?: boolean;
  conf?: boolean;
} | "*" | undefined;

export function buildLambdaLayer(opts: LayerBuilderOpts): aws.lambda.LayerVersion {
  const project = pulumi.getProject();
  const stack = pulumi.getStack();
  const layerDir = path.join("layers", opts.name);
  const dockerfile = renderDockerfile(opts);
  const versionHash = hashContent(dockerfile);
  const imageName = pulumi.interpolate`lambda-layer-${opts.name}-${versionHash}`;

  const image = new docker.Image(`${opts.name}-build`, {
    imageName: imageName,
    build: {
      context: layerDir,
      dockerfile: dockerfile,
    },
    skipPush: true,
  });

  const zipPath = path.join(layerDir, `${opts.name}.zip`);
  const archive = new pulumi.asset.FileArchive(zipPath);

  const fullName = `${opts.prefixProjectName !== false ? project + "-" : ""}${
    opts.prefixProjectEnv !== false ? stack + "-" : ""
  }${opts.name}-${versionHash}`;

  return new aws.lambda.LayerVersion(opts.name, {
    layerName: fullName,
    code: archive,
    compatibleRuntimes: opts.runtimes,
    compatibleArchitectures: opts.architectures,
  });
}
