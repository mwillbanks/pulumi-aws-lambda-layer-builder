import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as path from "path";
import { renderDockerfile, hashContent } from "./utils";
export function buildLambdaLayer(opts) {
    const project = pulumi.getProject();
    const stack = pulumi.getStack();
    const layerDir = path.join("layers", opts.name);
    const dockerfile = renderDockerfile(opts);
    const versionHash = hashContent(dockerfile);
    const imageName = pulumi.interpolate `lambda-layer-${opts.name}-${versionHash}`;
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
    const fullName = `${opts.prefixProjectName !== false ? project + "-" : ""}${opts.prefixProjectEnv !== false ? stack + "-" : ""}${opts.name}-${versionHash}`;
    return new aws.lambda.LayerVersion(opts.name, {
        layerName: fullName,
        code: archive,
        compatibleRuntimes: opts.runtimes,
        compatibleArchitectures: opts.architectures,
    });
}
