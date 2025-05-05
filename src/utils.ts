import * as crypto from "crypto";
import { LayerBuilderOpts, LayerBuilderPackageOpts } from "./layerBuilder";

function installPackageMgrDependencies(
  mgr: string,
  packages: [string, LayerBuilderPackageOpts][],
): string {
  if (packages.length === 0) {
    return "";
  }

  const manualPackages = packages.reduce(
    (acc, [pkg, config]) => {
      if (
        config &&
        typeof config === "object" &&
        "manualDownloadUrl" in config &&
        config.manualDownloadUrl
      ) {
        acc.push([pkg, config.manualDownloadUrl]);
      }
      return acc;
    },
    [] as [string, string][],
  );
  const normalPackages = packages.map(([pkg]) => pkg);

  switch (mgr) {
    case "apt":
      return [
        `RUN apt-get update`,
        `RUN apt-get install -y apt-utils unzip zip`,
        ...(manualPackages.length
          ? [
              [`RUN mkdir -p /tmp/packages`],
              ...manualPackages.map(([pkg, url]) => {
                return `RUN wget -O /tmp/packages/${pkg}.deb ${url}`;
              }),
              `RUN dpkg-scanpackages /tmp/packages /dev/null | gzip -9c > /tmp/packages/Packages.gz`,
              `RUN echo "deb [trusted=yes] file:/tmp/packages ./" > /etc/apt/sources.list.d/local.list`,
              `RUN apt-get update`,
            ]
          : []),
        `RUN apt-get install -y ${normalPackages.join(" ")}`,
      ].join("\n");
    case "yum":
      return [
        "RUN yum update -y",
        "RUN yum install -y yum-utils createrepo unzip zip",
        ...(manualPackages.length
          ? [
              `RUN mkdir -p /tmp/packages`,
              ...manualPackages.map(([pkg, url]) => {
                return `RUN wget -O /tmp/packages/${pkg}.rpm ${url}`;
              }),
              `RUN createrepo /tmp/packages`,
              `RUN echo "[localrepo]\\\nname=Local Repo\\\nbaseurl=file:///tmp/packages\\\nenabled=1\\\ngpgcheck=0" > /etc/yum.repos.d/local.repo`,
              `RUN yum makecache`,
            ]
          : []),
        `RUN yum install -y ${normalPackages.join(" ")}`,
      ].join("\n");
    case "dnf":
      return [
        "RUN dnf update -y",
        "RUN dnf install -y dnf dnf-utils createrepo findutils unzip zip",
        ...(manualPackages.length
          ? [
              `RUN mkdir -p /tmp/packages`,
              ...manualPackages.map(([pkg, url]) => {
                return `RUN wget -O /tmp/packages/${pkg}.rpm ${url}`;
              }),
              `RUN createrepo /tmp/packages`,
              `RUN echo "[localrepo]\\\nname=Local Repo\\\nbaseurl=file:///tmp/packages\\\nenabled=1\\\ngpgcheck=0" > /etc/yum.repos.d/local.repo`,
              `RUN dnf makecache`,
            ]
          : []),
        `RUN dnf install -y ${normalPackages.join(" ")}`,
      ].join("\n");
    default:
      throw new Error(`Unsupported package manager: ${mgr}`);
  }
}

export function renderDockerfile(opts: LayerBuilderOpts): string {
  const lines: string[] = [
    `FROM ${opts.imageName}`,
    installPackageMgrDependencies(opts.imagePkgManager, opts.packages),
    `RUN mkdir -p /tmp/layer/bin /tmp/layer/lib /tmp/layer/share /tmp/layer/etc`,
  ];

  for (const [pkg, config] of opts.packages) {
    if (config === "*") {
      lines.push(
        `RUN repoquery --list ${pkg} | grep -v '/.build-id' | sed 's/\\.[0-9][^/\\]*$/*/' | xargs -r -I '{}' sh -c '(cp -r --parents $(echo {}) /tmp/layer || true)'`,
      );
    } else if (config) {
      const patterns: string[] = [];
      if (config.bin) patterns.push("^/usr/bin/", "^/bin/");
      if (config.include) patterns.push("^/usr/include/", "^/include/");
      if (config.lib) patterns.push("^/usr/lib64/", "^/usr/lib/", "^/lib/");
      if (config.shared) patterns.push("^/usr/share/");
      if (config.conf) patterns.push("^/etc/");
      const regex = patterns.join("|");
      lines.push(
        `RUN repoquery --list ${pkg} | grep -E '${regex}' | grep -v '/.build-id' | sed 's/\\.[0-9][^/\\]*$/*/' | xargs -r -I '{}' sh -c '(cp -r --parents $(echo {}) /tmp/layer || true)'`,
      );
    }
  }

  lines.push(`WORKDIR /tmp/layer`);
  lines.push(`RUN zip -r ${opts.name}.zip .`);
  return lines.join("\n");
}

export function hashContent(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 8);
}
