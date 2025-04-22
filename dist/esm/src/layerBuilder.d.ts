import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
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
export declare function buildLambdaLayer(opts: LayerBuilderOpts): aws.lambda.LayerVersion;
//# sourceMappingURL=layerBuilder.d.ts.map