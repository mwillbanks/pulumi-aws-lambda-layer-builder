import type { Config } from 'release-it';

export default {
  git: {
    commit: true,
    tag: true,
    push: true
  },
  github: {
    release: true,
    comments: {
      submit: true,
    },
  },
  npm: {
    publish: true
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: {
        name: 'atom',
      },
      infile: "CHANGELOG.md",
    },
  }
} satisfies Config;
