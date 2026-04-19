import { writeCustomApiStorage, type CustomApiStorageData, readCustomApiStorage } from './customApiStorage.js'
import { getGlobalConfig, saveGlobalConfig } from './config.js'

/**
 * Setup custom API endpoint configuration
 */
export async function setupCustomApiEndpoint(options: {
  provider: 'anthropic' | 'openai'
  baseURL: string
  apiKey?: string
  model?: string
  skipAnthropicChecks?: boolean
}): Promise<void> {
  const { provider, baseURL, apiKey, model, skipAnthropicChecks = true } = options

  // Validate base URL
  try {
    new URL(baseURL)
  } catch {
    throw new Error(`Invalid base URL: ${baseURL}`)
  }

  // Prepare configuration
  const config: CustomApiStorageData = {
    provider,
    baseURL,
    apiKey,
    model,
    savedModels: model ? [model] : []
  }

  // Save to secure storage
  writeCustomApiStorage(config)

  // Also update global config for backward compatibility
  saveGlobalConfig(current => ({
    ...current,
    customApiEndpoint: {
      ...current.customApiEndpoint,
      provider,
      baseURL,
      apiKey,
      model,
      savedModels: model ? [model] : []
    }
  }))

  console.log(`✅ Custom API endpoint configured:`)
  console.log(`   Provider: ${provider}`)
  console.log(`   Base URL: ${baseURL}`)
  console.log(`   Model: ${model || 'Not specified'}`)

  if (skipAnthropicChecks) {
    console.log(`\n💡 Tip: Set CLAUDE_CODE_SKIP_ANTHROPIC_CHECKS=1 to skip Anthropic endpoint checks`)
  }
}

/**
 * Clear custom API endpoint configuration
 */
export function clearCustomApiEndpoint(): void {
  // Clear from secure storage
  const emptyConfig: CustomApiStorageData = {
    provider: undefined,
    baseURL: undefined,
    apiKey: undefined,
    model: undefined,
    savedModels: []
  }
  writeCustomApiStorage(emptyConfig)

  // Clear from global config
  saveGlobalConfig(current => ({
    ...current,
    customApiEndpoint: {
      provider: undefined,
      baseURL: undefined,
      apiKey: undefined,
      model: undefined,
      savedModels: []
    }
  }))

  console.log('✅ Custom API endpoint configuration cleared')
}

/**
 * Get current custom API endpoint configuration
 */
export function getCurrentCustomApiConfig(): CustomApiStorageData {
  const globalConfig = getGlobalConfig()
  const customApiStorage = readCustomApiStorage()

  return {
    provider: customApiStorage.provider || globalConfig.customApiEndpoint?.provider,
    baseURL: customApiStorage.baseURL || globalConfig.customApiEndpoint?.baseURL,
    apiKey: customApiStorage.apiKey || globalConfig.customApiEndpoint?.apiKey,
    model: customApiStorage.model || globalConfig.customApiEndpoint?.model,
    savedModels: customApiStorage.savedModels || globalConfig.customApiEndpoint?.savedModels || []
  }
}

/**
 * Test custom API endpoint connectivity
 */
export async function testCustomApiEndpoint(): Promise<{ success: boolean; error?: string }> {
  const config = getCurrentCustomApiConfig()

  if (!config.provider || !config.baseURL) {
    return { success: false, error: 'No custom API endpoint configured' }
  }

  try {
    let testUrl: string
    if (config.provider === 'openai') {
      testUrl = `${config.baseURL}/v1/models`
    } else {
      testUrl = `${config.baseURL}/api/hello`
    }

    const response = await fetch(testUrl, {
      headers: config.apiKey ? {
        'Authorization': `Bearer ${config.apiKey}`
      } : {}
    })

    if (response.ok) {
      return { success: true }
    } else {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Re-export readCustomApiStorage for convenience
export { readCustomApiStorage } from './customApiStorage.js'