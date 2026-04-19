# 仓库指南

## 项目结构与模块组织
核心源代码位于 `src/` 目录。入口点和 CLI 连接位于 `src/dev-entry.ts`、`src/main.tsx` 和 `src/commands.ts` 等文件中。功能代码按区域分组在 `src/commands/`、`src/services/`、`src/components/`、`src/tools/` 和 `src/utils/` 等文件夹中。恢复的或兼容性代码也出现在 `vendor/` 目录中，本地包填充层在 `shims/` 目录中。当前恢复的代码树中没有专门的 `test/` 目录；将靠近更改模块的针对性验证作为默认做法。

## 构建、测试和开发命令
使用 Bun 进行本地开发。

- `bun install`: 安装依赖项和本地填充包。
- `bun run dev`: 交互式启动恢复的 CLI 入口点。
- `bun run start`: 开发入口点的别名。
- `bun run version`: 验证 CLI 启动并打印其版本。

如果更改 TypeScript 模块，请运行上述相关命令并手动验证受影响的工作流。此仓库当前未在 `package.json` 中公开一流的 `lint` 或 `test` 脚本。

## 编码风格与命名约定
代码库以 TypeScript 优先，使用 ESM 导入和 `react-jsx`。完全匹配周围文件的风格：许多文件省略分号，使用单引号，变量和函数使用描述性驼峰命名法，React 组件和管理器类使用帕斯卡命名法，命令文件夹使用短横线命名法，例如 `src/commands/install-slack-app/`。当注释警告不要重新排序时，保持导入稳定。优先使用小型、专注的模块，而不是广泛的实用程序集合。

## 测试指南
仓库根目录尚未配置统一的自动化测试套件。对于贡献者的更改，请使用有针对性的运行时检查：

- 使用 `bun run dev` 启动 CLI
- 使用 `bun run version` 进行版本输出冒烟测试
- 运行您更改的特定命令、服务或 UI 路径

添加测试时，将它们放在靠近所覆盖功能的位置，并根据被测模块或行为命名。

## 提交与 Pull Request 指南
Git 历史目前以单个 `first commit` 开始，因此没有建立强大的约定模式。使用简短、命令式的提交主题，例如 `Fix MCP config normalization`。Pull requests 应解释用户可见的影响，注明特定于恢复的权衡，列出验证步骤，并仅对 TUI/UI 更改包含截图。

## 恢复说明
这是一个重建的源代码树，不是原始的上游代码。优先进行最小化、可审计的更改，并记录因模块使用回退或填充行为而添加的任何变通方法。
