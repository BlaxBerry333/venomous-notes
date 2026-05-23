// Conventional Commits：feat / fix / chore / docs / style / refactor / perf / test / build / ci / revert
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'subject-case': [0],
  },
}
