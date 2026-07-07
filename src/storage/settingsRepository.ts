const STORAGE_KEY = 'fmc:settings'

export interface Settings {
  /** Never sent anywhere but directly to DeepSeek's API from the browser. See ADR-003. */
  deepseekApiKey?: string
  subscribedPlatforms: string[]
}

const DEFAULT_SETTINGS: Settings = { subscribedPlatforms: [] }

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function writeSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function setDeepseekApiKey(deepseekApiKey: string): void {
  writeSettings({ ...readSettings(), deepseekApiKey })
}

function clearDeepseekApiKey(): void {
  const settings = readSettings()
  delete settings.deepseekApiKey
  writeSettings(settings)
}

function setSubscribedPlatforms(subscribedPlatforms: string[]): void {
  writeSettings({ ...readSettings(), subscribedPlatforms })
}

export const settingsRepository = {
  getSettings: readSettings,
  setDeepseekApiKey,
  clearDeepseekApiKey,
  setSubscribedPlatforms,
}
