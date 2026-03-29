# Lemon Vue

基于 [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin) ,[ruoyi-plus-vben5](https://github.com/imdap/ruoyi-plus-vben5)

## 特性

- **Vue 3** + **TypeScript** + **Vite 8** — 现代化前端技术栈
- **pnpm Monorepo** + **Turbo** — 高效的 monorepo 管理与构建缓存
- **Ant Design Vue** — UI 组件库（同时支持 Element Plus、Naive UI、TDesign）
- **Pinia** — 状态管理（支持持久化）
- **Vue Router 5** — 路由管理
- **TanStack Vue Query** — 服务端状态管理
- **VeeValidate** + **Zod** — 表单校验
- **Vue I18n** — 国际化
- **Tailwind CSS 4** + **Sass** — 样式方案
- **Vitest** + **Playwright** — 单元测试与 E2E 测试
- **ESLint** + **Oxlint** + **Stylelint** — 代码规范

## 环境要求

- Node.js `^20.19.0 || ^22.18.0 || ^24.0.0`
- pnpm `>=10.0.0`

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务（所有应用）
pnpm dev

# 仅启动 Ant Design Vue 版本
pnpm dev:antd
```

## 常用命令

```bash
# 构建
pnpm build           # 构建所有包
pnpm build:antd      # 仅构建 @lemon-vue/web-antd

# 代码检查
pnpm lint            # ESLint + Oxlint
pnpm check           # 类型检查 + 循环依赖检查

# 测试
pnpm test:unit       # 单元测试（Vitest）
pnpm test:e2e        # E2E 测试（Playwright）

# 提交代码
pnpm commit          # 交互式规范提交（czg）
```

如需对单个包执行命令：

```bash
pnpm -F <package-name> run <script>
```

## 项目结构

```
lemon-vue/
├── apps/                    # 用户应用
│   └── web-antd/            # Ant Design Vue 版本
├── packages/                # 共享运行时包
│   ├── @core/               # 核心框架包
│   │   ├── base/            # 基础能力
│   │   ├── ui-kit/          # UI 组件
│   │   └── forward/         # 转发层
│   ├── effects/             # 副作用包（API、Store 等）
│   └── business/            # 业务组件与逻辑
├── internal/                # 内部工具与 lint 配置
│   └── lint-configs/        # ESLint / Stylelint 等配置
└── pnpm-workspace.yaml      # 工作区与依赖版本目录
```

> 依赖版本统一在 `pnpm-workspace.yaml` 的 `catalog:` 中管理，各包 `package.json` 中引用 `catalog:` 而非直接指定版本号。

## License

[MIT](./LICENSE) © 2026 Lemon
