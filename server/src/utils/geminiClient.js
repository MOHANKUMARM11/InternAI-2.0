import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const GEMINI_MODEL = 'gemini-2.0-flash'

const apiKey = process.env.GEMINI_API_KEY || 'dummy_key_for_testing'
const genAI = new GoogleGenerativeAI(apiKey)

/**
 * Generate content using Gemini AI
 * @param {string} prompt - The user prompt
 * @param {Object} options - Configuration options
 * @param {string} [options.systemInstruction] - System role context or instruction
 * @param {boolean} [options.json] - Whether to enforce JSON output using responseMimeType
 * @param {number} [options.retries=1] - Number of retries on transient errors
 */
export const generateContent = async (prompt, options = {}) => {
  const { systemInstruction, json = false, retries = 1 } = options
  
  const modelConfig = {
    model: GEMINI_MODEL,
    ...(systemInstruction && { systemInstruction })
  }
  
  const generationConfig = {}
  if (json) {
    generationConfig.responseMimeType = 'application/json'
  }

  const model = genAI.getGenerativeModel(modelConfig)

  let attempt = 0
  while (attempt <= retries) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig
      })
      const text = result.response.text()
      
      if (json) {
        return JSON.parse(text)
      }
      return text
    } catch (error) {
      attempt++
      if (attempt > retries) {
        throw error
      }
      // Simple transient error backoff
      await new Promise(res => setTimeout(res, 1000 * attempt))
    }
  }
}
