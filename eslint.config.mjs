// ESLint flat config (v9)
// 入口：eslint-config-next (Next 16 已原生导出 flat 数组) + typescript-eslint + Prettier 关停冲突
import next from 'eslint-config-next'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier/flat'

export default [
  // 忽略：构建产物 / 依赖 / 内容 / AI 工作目录
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'coverage/**',
      'next-env.d.ts',
      'public/**',
      '__ai__/**',
      '.claude/**',
    ],
  },

  // Next 官方推荐（含 react / react-hooks / jsx-a11y / import / @next/next）
  ...next,

  // TypeScript 推荐（非 type-checked 一档——type-checked 要 parserOptions.project，先不开）
  ...tseslint.configs.recommended,

  // 项目自定义微调
  {
    rules: {
      // any 偶尔需要，warn 不 error；具体场景可在行内 disable
      '@typescript-eslint/no-explicit-any': 'warn',
      // 下划线前缀变量允许未用
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // Next 16 新规则——本项目现有代码多处 useEffect 同步 setState，先 warn 留可见性，后续逐个整改
      'react-hooks/set-state-in-effect': 'warn',
    },
  },

  // 必须放最后：关掉所有跟 Prettier 冲突的格式类规则
  prettier,
]
