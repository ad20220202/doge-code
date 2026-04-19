export interface ApiLimits {
  maxTokens: {
    min: number
    max: number
  }
}

export const API_LIMITS: Record<string, ApiLimits> = {
  'deepseek': {
    maxTokens: {
      min: 1,
      max: 8192
    }
  },
  'default': {
    maxTokens: {
      min: 1,
      max: 4096
    }
  }
}

export function getApiLimits(model: string): ApiLimits {
  if (model.toLowerCase().includes('deepseek')) {
    return API_LIMITS.deepseek
  }
  return API_LIMITS.default
}
