import type { AIProvider } from './AIProvider'
import { NullAIProvider } from './NullAIProvider'

const nullProvider = new NullAIProvider()

/**
 * Returns NullAIProvider until a real provider (DeepSeek) is wired up in a
 * later phase alongside the Settings screen's key entry. Callers should not
 * special-case the absence of a key — every AIProvider implementation must
 * work standalone.
 */
export function getAIProvider(): AIProvider {
  return nullProvider
}
