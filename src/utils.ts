import * as crypto from "crypto";
import { LayerBuilderOpts } from "./layerBuilder";

export function renderDockerfile(opts: LayerBuilderOpts): string {
  const lines: string[] = [
    `FROM ${opts.baseImage}`,
    `RUN yum install -y yum-utils`,
    `RUN mkdir -p /tmp/layer/bin /tmp/layer/lib /tmp/layer/share /tmp/layer/etc`,
  ];

  for (const [pkg, config] of opts.packages) {
    lines.push(`RUN yum install -y ${pkg}`);
    if (config === "*") {
      lines.push(
        `RUN repoquery --list ${pkg} | xargs -I '{}' cp --parents '{}' /tmp/layer || true`
      );
    } else if (config) {
      const patterns: string[] = [];
      if (config.bin) patterns.push("^/usr/bin/", "^/bin/");
      if (config.lib) patterns.push("^/usr/lib64/", "^/usr/lib/", "^/lib/");
      if (config.shared) patterns.push("^/usr/share/");
      if (config.conf) patterns.push("^/etc/");
      const regex = patterns.join("|");
      lines.push(
        `RUN repoquery --list ${pkg} | grep -E '${regex}' | xargs -I '{}' cp --parents '{}' /tmp/layer || true`
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
