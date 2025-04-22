import type { Config } from "release-it";

export default {
  git: {
    commit: true,
    commitMessage: "chore: release v${version}",
    push: true,
    pushRepo: "origin",
    requireBranch: "main",
    requireCommits: true,
    tag: true,
  },
  github: {
    comments: {
      submit: true,
    },
    release: true,
  },
  npm: {
    publish: true,
  },
  plugins: {
    "@release-it/conventional-changelog": {
      infile: "CHANGELOG.md",
      preset: "angular",
    },
  },
} satisfies Config;
