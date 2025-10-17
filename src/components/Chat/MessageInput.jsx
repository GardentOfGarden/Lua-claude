import React, { useState, useRef } from 'react'
import { Send, Paperclip, Mic } from 'lucide-react'
import { useChat } from '../../contexts/ChatContext'

function MessageInput() {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)
  const { sendMessage, loading } = useChat()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    await sendMessage(message)
    setMessage('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Attach file"
            >
              <Paperclip size={16} />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Voice input"
            >
              <Mic size={16} />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Eclipse..."
            disabled={loading}
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-claude-green focus:border-transparent resize-none transition-all duration-200 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="absolute right-3 bottom-3 p-2 text-gray-500 dark:text-gray-400 hover:text-claude-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}

export default MessageInput
