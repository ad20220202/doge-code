# 自定义 OpenAI 兼容 API 端点配置指南

本文档介绍如何将项目配置为使用自定义的 OpenAI 兼容 API 端点，而不是默认的 Anthropic 登录方式。

## 快速开始

### 1. 安装依赖
```bash
bun install
```

### 2. 设置自定义 API 端点
```bash
# 使用内置命令
bun run custom-api setup --provider openai --url https://api.example.com/v1

# 或直接运行
bun run ./src/commands/custom-api.ts setup --provider openai --url https://api.example.com/v1

# 安装后使用全局命令
claude-custom-api setup --provider openai --url https://api.example.com/v1
```

### 3. 测试连接
```bash
bun run custom-api test
```

### 4. 查看配置
```bash
bun run custom-api show
```

## 详细配置选项

### 基本配置
```bash
# 设置 OpenAI 兼容端点
bun run custom-api setup \
  --provider openai \
  --url https://api.example.com/v1 \
  --api-key sk-xxxxxx \
  --model gpt-3.5-turbo

# 设置 Anthropic 兼容端点
bun run custom-api setup \
  --provider anthropic \
  --url https://api.anthropic.com \
  --api-key your-api-key \
  --model claude-3-opus-20240229
```

### 环境变量
配置完成后，建议设置以下环境变量：

```bash
# 跳过 Anthropic 端点检查（推荐）
export CLAUDE_CODE_SKIP_ANTHROPIC_CHECKS=1

# 如果配置中未保存 API key，可以在这里设置
export DOGE_API_KEY=sk-xxxxxx

# 可选：强制启用 OAuth（用于复杂场景）
# export CLAUDE_CODE_FORCE_OAUTH=1
```

使用 `bun run custom-api env` 命令可以生成这些环境变量。

## 管理配置

### 查看当前配置
```bash
bun run custom-api show
```

### 清除配置
```bash
bun run custom-api clear
```

### 测试连接
```bash
bun run custom-api test
```

## 工作原理

### 认证流程优化
项目已优化为优先使用自定义 API 端点：

1. **检测自定义配置**：系统首先检查是否有自定义 API 端点配置
2. **禁用 Anthropic 认证**：如果检测到自定义配置，默认禁用 Anthropic OAuth 认证
3. **优先使用自定义端点**：所有 API 请求都会发送到配置的自定义端点

### 预检检查优化
预检检查逻辑已优化：

1. **优先检查自定义端点**：首先检查自定义 API 端点的连通性
2. **可跳过 Anthropic 检查**：通过 `CLAUDE_CODE_SKIP_ANTHROPIC_CHECKS=1` 环境变量可以跳过 Anthropic 端点检查
3. **更好的错误提示**：为自定义端点提供更详细的错误信息

## 高级配置

### 使用环境变量直接配置
除了使用命令工具，也可以直接通过环境变量配置：

```bash
# 通过环境变量配置（临时）
export DOGE_CUSTOM_API_PROVIDER=openai
export DOGE_CUSTOM_API_URL=https://api.example.com/v1
export DOGE_CUSTOM_API_KEY=sk-xxxxxx
export DOGE_CUSTOM_API_MODEL=gpt-3.5-turbo
export CLAUDE_CODE_SKIP_ANTHROPIC_CHECKS=1
```

### 配置文件位置
配置存储在以下位置：

1. **安全存储**：`~/.claude/.credentials.json`（加密存储）
2. **全局配置**：`~/.claude.json`（向后兼容）

### 支持的 API 提供商
- `openai`: OpenAI 兼容 API（如 OpenAI, Azure OpenAI, 本地部署等）
- `anthropic`: Anthropic 兼容 API

## 故障排除

### 连接测试失败
1. 检查 URL 是否正确
2. 验证 API key 是否有权限
3. 检查网络连接和防火墙设置
4. 确认端点支持 OpenAI 兼容的 API 格式

### 认证问题
1. 确保 `CLAUDE_CODE_SKIP_ANTHROPIC_CHECKS=1` 已设置
2. 检查 API key 格式是否正确
3. 验证端点是否需要额外的认证头

### 预检检查失败
如果预检检查失败但 API 实际可用：
```bash
# 禁用预检检查（不推荐）
export CLAUDE_CODE_SKIP_PREFLIGHT_CHECKS=1
```

## 开发说明

### 代码变更
主要优化了以下文件：

1. **`src/utils/auth.ts`**：简化认证逻辑，优先支持自定义 API
2. **`src/utils/preflightChecks.tsx`**：优化预检检查
3. **`src/utils/setupCustomApi.ts`**：新增配置工具
4. **`src/commands/custom-api.ts`**：新增 CLI 命令

### 向后兼容性
- 原有 Anthropic OAuth 登录方式仍然可用
- 可以通过 `CLAUDE_CODE_FORCE_OAUTH=1` 强制使用 OAuth
- 原有配置格式保持不变

## 常见问题

### Q: 如何切换回原来的 Anthropic 登录？
A: 清除自定义配置并移除环境变量：
```bash
bun run custom-api clear
unset CLAUDE_CODE_SKIP_ANTHROPIC_CHECKS
```

### Q: 支持哪些 OpenAI 兼容的 API？
A: 支持任何实现 OpenAI Chat Completions API 的端点，包括：
- OpenAI 官方 API
- Azure OpenAI
- 本地部署的 OpenAI 兼容服务
- 其他云提供商的 OpenAI 兼容服务

### Q: 配置是否安全？
A: API key 默认存储在加密的安全存储中，不会以明文形式出现在配置文件中。

### Q: 是否可以同时配置多个端点？
A: 当前版本只支持一个自定义端点配置。可以通过环境变量临时覆盖配置。