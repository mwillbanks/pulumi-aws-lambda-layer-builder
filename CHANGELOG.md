# Changelog

## [0.5.7](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.6...0.5.7) (2025-05-02)

### Bug Fixes

- attempt using region for name part ([a5e2dac](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/a5e2dac2bfd214641779df069678316b6b694cc2))

## [0.5.6](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.5...0.5.6) (2025-05-02)

### Bug Fixes

- because pull trigger doesnt work with build ([6251593](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/6251593fff475b881db3bde1045e0de8bdba9ad4))

## [0.5.5](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.4...0.5.5) (2025-05-02)

### Bug Fixes

- remove region due to interpolation ([601071d](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/601071dd501876220499dd658dd6ca8b224cece7))

## [0.5.4](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.3...0.5.4) (2025-05-01)

### Bug Fixes

- version handling fixes ([414aa61](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/414aa61322123f4710d46683645dd7d45768cc69))

## [0.5.3](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.0...0.5.3) (2025-05-01)

### Bug Fixes

- getNodeModulePackageJson CJS fix ([0939b6b](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/0939b6b5570db4e4ed9e36372661e477d635d0fd))
- getNodeModulePackageJson CJS fix ([cd86e67](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/cd86e67be959b4f21c59195bc1b9121bdfdb0c80))
- getNodeModulePackageJson for ESM and CJS ([43a572b](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/43a572bb076417093864270d22d14d5641f6a3fc))

# [0.5.0](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.4.7...0.5.0) (2025-05-01)

### Features

- add include paths option ([7dcad99](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/7dcad9987bfb63f49a5108a799d5436f96e8f699))

## [0.4.7](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.4.6...0.4.7) (2025-05-01)

### Bug Fixes

- fetch the layer asset, rework vars ([88a706b](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/88a706bd1e827100dd2bd980b347f8ff90c04d2f))

## [0.4.6](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.4.5...0.4.6) (2025-05-01)

### Bug Fixes

- get package verison to avoid conflicts ([17651f1](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/17651f11472ed47ef59bd8929e2ddfd9489b61f0))

## [0.4.5](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.4.4...0.4.5) (2025-05-01)

### Bug Fixes

- avoid naming conflicts ([013e42a](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/013e42a4b9ccc47f0c0d4e6ec1ec63e7aeca1088))

## [0.4.4](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.4.3...0.4.4) (2025-05-01)

### Bug Fixes

- dockerfile has to be an actual file ([dfcdbbe](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/dfcdbbeb0a73de72a755a410353fe449b95aedb5))

## [0.4.3](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.4.2...0.4.3) (2025-05-01)

### Bug Fixes

- ensure that $HOME is set for docker ([b8117e8](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/b8117e8b32f5e584a85f1b140b52dbbde4653abc))

## [0.4.2](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.4.1...0.4.2) (2025-05-01)

### Bug Fixes

- extract file from container ([35c3a3b](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/35c3a3bafc810517636c83b7229b2876b1ad5d7e))

## [0.4.1](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.4.0...0.4.1) (2025-05-01)

### Bug Fixes

- build issue, tests ([08f0564](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/08f056469c2acbe19b3b64949f0577ad7555c81a))

# [0.4.0](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.3.0...0.4.0) (2025-04-28)

### Features

- manual package installation ([fabe283](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/fabe283665a069bb72498ab18918184eb8852a92))

# [0.3.0](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.1.0...0.3.0) (2025-04-22)

### Features

- add `imageArgs` and `awsProvider` ([f2d728b](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/f2d728b0b5f44225b2795e113569ceeaa2987abf))

# 0.1.0 (2025-04-22)

### Features

- initial release ([08a6b38](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/08a6b38336b9d5a9f7d995fe810ddb98f02c5b7a))
