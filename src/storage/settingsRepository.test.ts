import { beforeEach, describe, expect, it } from 'vitest'
import { settingsRepository } from './settingsRepository'

beforeEach(() => {
  localStorage.clear()
})

describe('settingsRepository', () => {
  it('defaults to no api key and no subscribed platforms', () => {
    expect(settingsRepository.getSettings()).toEqual({ subscribedPlatforms: [] })
  })

  it('persists an api key and can clear it without touching other settings', () => {
    settingsRepository.setSubscribedPlatforms(['netflix'])
    settingsRepository.setDeepseekApiKey('sk-test-123')

    expect(settingsRepository.getSettings()).toEqual({
      subscribedPlatforms: ['netflix'],
      deepseekApiKey: 'sk-test-123',
    })

    settingsRepository.clearDeepseekApiKey()

    expect(settingsRepository.getSettings()).toEqual({ subscribedPlatforms: ['netflix'] })
  })

  it('persists subscribed platforms independently of the api key', () => {
    settingsRepository.setDeepseekApiKey('sk-test-123')
    settingsRepository.setSubscribedPlatforms(['netflix', 'primevideo'])

    expect(settingsRepository.getSettings()).toEqual({
      subscribedPlatforms: ['netflix', 'primevideo'],
      deepseekApiKey: 'sk-test-123',
    })
  })

  it('survives malformed localStorage content', () => {
    localStorage.setItem('fmc:settings', '{not valid json')
    expect(settingsRepository.getSettings()).toEqual({ subscribedPlatforms: [] })
  })
})
