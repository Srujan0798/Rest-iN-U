module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, semicolons, etc.)
        'refactor', // Code refactoring (no feature change, no bug fix)
        'perf',     // Performance improvements
        'test',     // Adding or updating tests
        'build',    // Build system or external dependencies
        'ci',       // CI/CD configuration changes
        'chore',    // Maintenance tasks
        'revert',   // Reverting a previous commit
      ],
    ],
    'scope-enum': [
      1, // Warning only, not error
      'always',
      [
        'frontend',
        'backend',
        'estate',
        'agents',
        'auth',
        'api',
        'ui',
        'db',
        'ci',
        'docs',
        'deps',
        'config',
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
