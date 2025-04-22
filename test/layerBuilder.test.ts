import { describe, expect, it } from '@jest/globals';
import { renderDockerfile } from "../src/utils";
import { LayerBuilderOpts } from "../src/layerBuilder";

describe("renderDockerfile", () => {
  it("includes wildcard repoquery when config is '*'", () => {
    const opts: LayerBuilderOpts = {
      name: "test",
      baseImage: "amazonlinux:2023",
      packages: [["openssl11", "*"]],
    };
    const df = renderDockerfile(opts);
    expect(df).toContain("repoquery --list openssl11");
  });

  it("includes correct lib paths for selective config", () => {
    const opts: LayerBuilderOpts = {
      name: "test",
      baseImage: "amazonlinux:2023",
      packages: [["zip", { bin: true, lib: true, shared: false, conf: false }]],
    };
    const df = renderDockerfile(opts);
    expect(df).toMatch(/yum install -y zip/);
    expect(df).toMatch(/usr\/lib64\/|usr\/lib\//);
  });
});
