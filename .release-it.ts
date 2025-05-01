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
  hooks: {
    "after:bump": [
      "echo 'export default \"${version}\";' > src/version.ts",
      "NODE_NO_WARNINGS=1 yarn build",
    ],
    "before:init": ["yarn test"],
    "before:git:release": ["git add src/version.ts"],
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
