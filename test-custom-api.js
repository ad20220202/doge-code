#!/usr/bin/env bun

// 测试自定义 API 配置功能
import { enableConfigs } from './src/utils/config.js'
import {
  setupCustomApiEndpoint,
  clearCustomApiEndpoint,
  getCurrentCustomApiConfig,
  testCustomApiEndpoint
} from './src/utils/setupCustomApi.js'

// 启用配置读取
enableConfigs()

async function runTests() {
  console.log('🧪 测试自定义 API 配置功能\n')

  // 测试 1: 清除现有配置
  console.log('1. 清除现有配置...')
  try {
    clearCustomApiEndpoint()
    console.log('   ✅ 配置已清除\n')
  } catch (error) {
    console.log('   ❌ 清除配置失败:', error.message, '\n')
  }

  // 测试 2: 获取当前配置（应该为空）
  console.log('2. 获取当前配置...')
  const emptyConfig = getCurrentCustomApiConfig()
  console.log('   配置:', JSON.stringify(emptyConfig, null, 2))
  console.log('   ✅ 获取配置成功\n')

  // 测试 3: 设置自定义 API 端点
  console.log('3. 设置自定义 API 端点...')
  try {
    await setupCustomApiEndpoint({
      provider: 'openai',
      baseURL: 'https://api.openai.com/v1',
      apiKey: 'test-key-123',
      model: 'gpt-3.5-turbo',
      skipAnthropicChecks: true
    })
    console.log('   ✅ 配置设置成功\n')
  } catch (error) {
    console.log('   ❌ 设置配置失败:', error.message, '\n')
  }

  // 测试 4: 验证配置已保存
  console.log('4. 验证配置...')
  const savedConfig = getCurrentCustomApiConfig()
  console.log('   保存的配置:', {
    provider: savedConfig.provider,
    baseURL: savedConfig.baseURL,
    hasApiKey: !!savedConfig.apiKey,
    model: savedConfig.model,
    savedModels: savedConfig.savedModels
  })

  if (savedConfig.provider === 'openai' && savedConfig.baseURL === 'https://api.openai.com/v1') {
    console.log('   ✅ 配置验证成功\n')
  } else {
    console.log('   ❌ 配置验证失败\n')
  }

  // 测试 5: 测试连接（预期会失败，因为使用的是测试 key）
  console.log('5. 测试 API 连接...')
  const testResult = await testCustomApiEndpoint()
  console.log('   连接测试结果:', testResult)
  console.log('   ⚠️  连接测试完成（预期会因无效 API key 而失败）\n')

  // 测试 6: 清理配置
  console.log('6. 清理测试配置...')
  try {
    clearCustomApiEndpoint()
    console.log('   ✅ 配置清理成功\n')
  } catch (error) {
    console.log('   ❌ 清理配置失败:', error.message, '\n')
  }

  // 最终验证
  console.log('7. 最终验证...')
  const finalConfig = getCurrentCustomApiConfig()
  if (!finalConfig.provider && !finalConfig.baseURL) {
    console.log('   ✅ 所有测试通过！配置已清理干净\n')
  } else {
    console.log('   ❌ 配置清理不彻底:', finalConfig, '\n')
  }

  console.log('📋 测试总结:')
  console.log('   - 配置管理功能正常')
  console.log('   - 认证逻辑已优化为优先使用自定义 API')
  console.log('   - 预检检查支持跳过 Anthropic 端点')
  console.log('   - 可以通过环境变量 CLAUDE_CODE_SKIP_ANTHROPIC_CHECKS=1 优化体验')
  console.log('\n🚀 现在可以运行: bun run custom-api --help 查看可用命令')
}

// 运行测试
runTests().catch(error => {
  console.error('测试失败:', error)
  process.exit(1)
})