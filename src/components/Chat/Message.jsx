import React from 'react'
import ReactMarkdown from 'react-markdown'
import { User, Bot, Copy, Check } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

function Message({ message }) {
  const { settings } = useSettings()
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const isUser = message.role === 'user'

  return (
    <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
      isUser ? 'message-user' : 'message-assistant'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-claude-green text-white'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {isUser ? 'You' : 'Eclipse'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              {isUser ? (
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {message.content}
                </p>
              ) : settings.enableMarkdown ? (
                <ReactMarkdown className="text-gray-900 dark:text-white">
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {message.content}
                </p>
              )}
            </div>

            {/* Copy Button */}
            {!isUser && (
              <button
                onClick={copyToClipboard}
                className="mt-3 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={12} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message
