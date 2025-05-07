# Changelog

## [0.5.23](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.22...0.5.23) (2025-05-07)

### Bug Fixes

- change layer provider logic ([e8db4e5](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/e8db4e538be9316451f6cb2a669d4ccf73584d94))

## [0.5.22](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.21...0.5.22) (2025-05-06)

### Bug Fixes

- update archive handling ([eee37cc](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/eee37ccb6bc2a37392e7fbf07f16b1a65805f200))

## [0.5.21](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.20...0.5.21) (2025-05-06)

### Bug Fixes

- layer name validation ([a27c361](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/a27c361e367137d699f6e94b5e5cf924b21e62b9))

## [0.5.20](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.19...0.5.20) (2025-05-06)

### Bug Fixes

- use FileArchive (it probably wont work) ([34858f7](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/34858f765d32c0fa4b9d088c44cb1e85a8142194))

## [0.5.19](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.18...0.5.19) (2025-05-05)

### Bug Fixes

- try another way to generate the FileAsset ([1a1d845](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/1a1d84506414dfe1ae1274d721c10127101e07e9))

## [0.5.18](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.17...0.5.18) (2025-05-05)

### Bug Fixes

- set layer dependencies ([d0436fb](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/d0436fb688852745e4fc9621ef9595b78358d395))

## [0.5.17](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.16...0.5.17) (2025-05-05)

### Bug Fixes

- use zipPath for the file asset ([c60dfa0](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/c60dfa0230fb34f248314552fe2e2569bbca319b))

## [0.5.16](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.15...0.5.16) (2025-05-05)

### Bug Fixes

- ignore files which do not exist ([bbc2a1b](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/bbc2a1b8077e7ba8468c2cd3646454dafe4be924))

## [0.5.15](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.14...0.5.15) (2025-05-05)

### Bug Fixes

- ignore version numbers use wildcard ([48fc0ea](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/48fc0ea5ebba2824975386cb51fbefdfbe335b60))

## [0.5.14](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.13...0.5.14) (2025-05-02)

### Bug Fixes

- filter out .build-id ([e6c1c9c](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/e6c1c9c7507c719877bb76a6aa5ded9f5d259821))

## [0.5.13](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.12...0.5.13) (2025-05-02)

### Bug Fixes

- missing xargs ([fb749d7](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/fb749d7132920a995da98834806609087d15ec88))

## [0.5.12](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.11...0.5.12) (2025-05-02)

### Bug Fixes

- change RemoteImage to Image ([507520f](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/507520ffee6accaa8f8ddf4ae747396e701321fd))

## [0.5.11](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.10...0.5.11) (2025-05-02)

### Bug Fixes

- increase sleep time to 60s ([92e64d7](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/92e64d79941bf91647646126ebd894ca85407979))

## [0.5.10](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.9...0.5.10) (2025-05-02)

### Bug Fixes

- escape file output ([7591386](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/7591386207f7d090b33738cb7b551ac290c8906d))

## [0.5.9](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.8...0.5.9) (2025-05-02)

### Bug Fixes

- set context to root path ([861d46f](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/861d46fdb889753bd367f9f2f98bd04148625488))

## [0.5.8](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/compare/0.5.7...0.5.8) (2025-05-02)

### Bug Fixes

- use string version of regionName ([f6ed530](https://github.com/mwillbanks/pulumi-aws-lambda-layer-builder/commit/f6ed530ad2e4ceaf623bc0b8024378a6c0281020))

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
