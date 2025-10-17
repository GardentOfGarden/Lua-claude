import axios from 'axios'

const API_URL = 'https://api.anthropic.com/v1/messages'
const API_KEY = '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'

class ChatService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      }
    })
  }

  async sendMessage(messages, newMessage, settings = {}) {
    try {
      const response = await this.client.post('', {
        model: settings.model || 'claude-3-sonnet-20240229',
        max_tokens: settings.maxTokens || 4000,
        temperature: settings.temperature || 0.7,
        system: settings.systemPrompt || 'You are a helpful AI assistant.',
        messages: [
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: newMessage
          }
        ]
      })

      if (response.data && response.data.content && response.data.content[0]) {
        return response.data.content[0].text
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (error) {
      console.error('API Error:', error)
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Invalid API key')
          case 429:
            throw new Error('Rate limit exceeded. Please try again later.')
          case 500:
            throw new Error('Server error. Please try again later.')
          default:
            throw new Error(error.response.data?.error?.message || 'API request failed')
        }
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.')
      } else {
        throw new Error('An unexpected error occurred')
      }
    }
  }
}

export const chatService = new ChatService()
