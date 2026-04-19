import { homedir } from 'os'
import { join } from 'path'

export function getClaudeConfigDir(): string {
  return process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude')
}

export function getClaudeGlobalConfigFile(): string {
  return join(getClaudeConfigDir(), '.claude.json')
}
