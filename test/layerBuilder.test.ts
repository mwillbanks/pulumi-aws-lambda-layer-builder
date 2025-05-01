import { describe, expect, it } from "@jest/globals";
import { renderDockerfile } from "../src/utils";
import { LayerBuilderOpts } from "../src/layerBuilder";

describe("renderDockerfile", () => {
  it("includes wildcard repoquery when config is '*'", () => {
    const opts: LayerBuilderOpts = {
      name: "test",
      imageName: "amazonlinux:2023",
      imagePkgManager: "dnf",
      packages: [["openssl", "*"]],
    };
    const df = renderDockerfile(opts);
    expect(df).toContain("repoquery --list openssl");
  });

  it("includes correct lib paths for selective config", () => {
    const opts: LayerBuilderOpts = {
      name: "test",
      imageName: "amazonlinux:2023",
      imagePkgManager: "dnf",
      packages: [["zip", { bin: true, lib: true, shared: false, conf: false }]],
    };
    const df = renderDockerfile(opts);
    expect(df).toMatch(/dnf install -y zip/);
    expect(df).toMatch(/usr\/lib64\/|usr\/lib\//);
  });
});
