# pulumi-aws-lambda-layer-builder

A reusable Pulumi package for building AWS Lambda layers from arbitrary system packages. It leverages the Pulumi Docker provider to install, extract, and package only the files you need—then publishes them as versioned Lambda layers via the AWS provider.

---

## 🚀 Features

- **Configurable base image**: Use any public or private image (e.g., `amazonlinux:2023` or your own custom builder image).
- **Selective file extraction**: Leverages `repoquery` and configurable filters (`BINARIES`, `LIBRARIES`, `SHARED`, `CONF`, or `ALL`) to minimize layer size.
- **Automatic versioning**: Content-based hash on your Dockerfile ensures layers rebuild only when configuration changes.
- **Pulumi-native**: Pure TypeScript API, integrates with both the Pulumi Docker and AWS providers.
- **Dual ESM/CJS**: Ships both CommonJS and ES module builds for maximum compatibility.

---

## 📦 Installation

```bash
npm install @mwillbanks/pulumi-aws-lambda-layer-builder
```

_or, if using a Git-based workflow:_

```bash
npm install git+ssh://github.com/mwillbanks/pulumi-aws-lambda-layer-builder.git
```

---

## ⚙️ Usage

```ts
import * as aws from "@pulumi/aws";
import { buildLambdaLayer } from "aws-lambda-layer-builder";

const layer = buildLambdaLayer({
  name: "openssl",
  baseImage: "amazonlinux:2023",
  packages: [
    ["openssl11", "*"],
    ["zip", { bin: true, lib: true }],
  ],
  runtimes: [aws.lambda.Runtime.NODEJS_18_X],
  architectures: [aws.lambda.Architecture.X86_64],
});
```

### Configuration Options

| Option             | Type                                                           | Description                                                                 |
| ------------------ | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `name`             | `string`                                                       | Logical name for the layer (used in directory, image, and layer naming).   |
| `baseImage`        | `string` &#124; `docker.Image` &#124; `RemoteImage` &#124; `RegistryImage` | Docker base image or existing Pulumi image resource.                       |
| `packages`         | `[string, LayerBuilderPackageOpts][]`                          | List of packages to install and their extraction filters.                   |
| `runtimes?`        | `aws.lambda.Runtime[]`                                         | Lambda runtimes that can use this layer. Defaults to none.                 |
| `architectures?`   | `aws.lambda.Architecture[]`                                    | CPU architectures for the layer. Defaults to none.                         |
| `prefixProjectName`| `boolean`                                                      | Prepend `<project>-` to the layer name. Default: `true`.                   |
| `prefixProjectEnv` | `boolean`                                                      | Prepend `<stack>-` to the layer name. Default: `true`.                     |


**`LayerBuilderPackageOpts`**:

- `"*"` — include _all_ files from the package
- `{ bin?, lib?, shared?, conf? }` — selectively include only bins, libs (`/usr/lib64`, `/usr/lib`, `/lib`), shares (`/usr/share`), or configs (`/etc`)

---

## 🔍 How It Works

1. **Dockerfile Rendering**: Builds a tailored Dockerfile using your options and `repoquery` filters.
2. **Local Build**: Pulumi Docker provider builds the image (`skipPush: true`).
3. **Extraction**: The container packages `/tmp/layer` into `layer.zip` using `zip`.
4. **Versioning**: A SHA‑256 of the Dockerfile produces an 8‑character hash to avoid unnecessary rebuilds.
5. **Publishing**: Pulumi AWS provider publishes a new `aws.lambda.LayerVersion` with the given name, code, runtimes, and architectures.

---

## 🛠️ Best Practices

- **Pin base images** to explicit versions (e.g., `amazonlinux:2023.0.20230413`) to ensure reproducible builds.
- **Limit filters** to only what you need—avoid `"*"`, unless necessary.
- **Commit your `layers/` folder** so zip artifacts, and hash files live alongside code and you don't have to unnecessarily regenerate new layers.
- **Use clear naming** conventions by toggling `prefixProjectName` and `prefixProjectEnv` to suit your environment.

---

## 🤝 Contributing

1. Fork the repo
2. `npm install`
3. `npm run build`
4. Write tests in `test/` and update `README.md`
5. Send a PR — we use conventional commits and semantic versioning.

---

## 📄 License

MIT © Mike Willbanks

