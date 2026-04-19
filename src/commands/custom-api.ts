#!/usr/bin/env bun
import { Command } from '@commander-js/extra-typings'
import {
  setupCustomApiEndpoint,
  clearCustomApiEndpoint,
  getCurrentCustomApiConfig,
  testCustomApiEndpoint
} from '../utils/setupCustomApi.js'

const program = new Command()

program
  .name('custom-api')
  .description('Manage custom OpenAI-compatible API endpoint configuration')
  .version('1.0.0')

program
  .command('setup')
  .description('Setup a custom OpenAI-compatible API endpoint')
  .requiredOption('-p, --provider <provider>', 'API provider (anthropic or openai)', 'openai')
  .requiredOption('-u, --url <url>', 'Base URL of the API endpoint')
  .option('-k, --api-key <key>', 'API key (optional)')
  .option('-m, --model <model>', 'Default model to use (optional)')
  .option('--skip-checks', 'Skip Anthropic endpoint checks', true)
  .action(async (options) => {
    try {
      if (options.provider !== 'anthropic' && options.provider !== 'openai') {
        console.error('❌ Provider must be either "anthropic" or "openai"')
        process.exit(1)
      }

      await setupCustomApiEndpoint({
        provider: options.provider,
        baseURL: options.url,
        apiKey: options.apiKey,
        model: options.model,
        skipAnthropicChecks: options.skipChecks
      })
    } catch (error) {
      console.error('❌ Failed to setup custom API endpoint:', error instanceof Error ? error.message : String(error))
      process.exit(1)
    }
  })

program
  .command('clear')
  .description('Clear custom API endpoint configuration')
  .action(() => {
    try {
      clearCustomApiEndpoint()
    } catch (error) {
      console.error('❌ Failed to clear custom API endpoint:', error instanceof Error ? error.message : String(error))
      process.exit(1)
    }
  })

program
  .command('show')
  .description('Show current custom API endpoint configuration')
  .action(() => {
    try {
      const config = getCurrentCustomApiConfig()

      if (!config.provider || !config.baseURL) {
        console.log('No custom API endpoint configured')
        return
      }

      console.log('Current custom API endpoint configuration:')
      console.log(`  Provider: ${config.provider}`)
      console.log(`  Base URL: ${config.baseURL}`)
      console.log(`  API Key: ${config.apiKey ? '***' + config.apiKey.slice(-4) : 'Not set'}`)
      console.log(`  Model: ${config.model || 'Not specified'}`)
      console.log(`  Saved Models: ${config.savedModels?.join(', ') || 'None'}`)
    } catch (error) {
      console.error('❌ Failed to get configuration:', error instanceof Error ? error.message : String(error))
      process.exit(1)
    }
  })

program
  .command('test')
  .description('Test connectivity to the custom API endpoint')
  .action(async () => {
    try {
      console.log('Testing custom API endpoint connectivity...')
      const result = await testCustomApiEndpoint()

      if (result.success) {
        console.log('✅ Custom API endpoint is reachable')
      } else {
        console.log('❌ Custom API endpoint test failed:', result.error)
        process.exit(1)
      }
    } catch (error) {
      console.error('❌ Test failed:', error instanceof Error ? error.message : String(error))
      process.exit(1)
    }
  })

program
  .command('env')
  .description('Show environment variables for using custom API')
  .action(() => {
    const config = getCurrentCustomApiConfig()

    if (!config.provider || !config.baseURL) {
      console.log('No custom API endpoint configured')
      return
    }

    console.log('Environment variables for using custom API:')
    console.log('')
    console.log('# Skip Anthropic endpoint checks')
    console.log('export CLAUDE_CODE_SKIP_ANTHROPIC_CHECKS=1')
    console.log('')

    if (config.apiKey) {
      console.log('# API Key (if not already saved in config)')
      console.log(`export DOGE_API_KEY=${config.apiKey}`)
      console.log('')
    }

    console.log('# Optional: Force OAuth if needed for complex scenarios')
    console.log('# export CLAUDE_CODE_FORCE_OAUTH=1')
    console.log('')
    console.log('💡 Tip: Add these to your shell profile (.bashrc, .zshrc, etc.)')
  })

if (import.meta.main) {
  program.parse()
}

export default program