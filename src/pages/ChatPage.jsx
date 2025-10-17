import React, { useRef, useEffect } from 'react'
import { useChat } from '../contexts/ChatContext'
import { useSettings } from '../contexts/SettingsContext'
import Message from '../components/Chat/Message'
import MessageInput from '../components/Chat/MessageInput'
import { Bot, AlertCircle } from 'lucide-react'

function ChatPage() {
  const { messages, loading, error, currentChat } = useChat()
  const { settings } = useSettings()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (settings.autoScroll) {
      scrollToBottom()
    }
  }, [messages, settings.autoScroll])

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto px-6">
              <div className="w-16 h-16 bg-claude-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Eclipse Project
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                A free, enhanced version of Claude with extended functionality. 
                Start a conversation by typing a message below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    💡 Creative Writing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help me write a short story about artificial intelligence
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    🔍 Problem Solving
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Explain quantum computing in simple terms
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    💻 Code Help
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Write a Python function to sort a list efficiently
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    📚 Learning
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help me understand the theory of relativity
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {loading && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 message-assistant">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-claude-green rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Eclipse
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-claude-green rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-claude-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-claude-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        Thinking...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 max-w-md mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <MessageInput />
    </div>
  )
}

export default ChatPage
