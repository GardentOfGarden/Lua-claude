import React, { useState } from 'react'
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Search, 
  Download,
  Menu,
  X
} from 'lucide-react'
import { useChat } from '../../contexts/ChatContext'

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const {
    chats,
    filteredChats,
    currentChat,
    searchQuery,
    newChat,
    selectChat,
    deleteChat,
    exportChat,
    setSearchQuery
  } = useChat()

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={newChat}
          className="p-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="New Chat"
        >
          <Plus size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Eclipse Project
        </h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={newChat}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {chats.length === 0 ? 'No chats yet' : 'No chats found'}
          </div>
        ) : (
          filteredChats.map(chat => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                currentChat?.id === chat.id ? 'bg-blue-100 dark:bg-blue-900/30' : ''
              }`}
              onClick={() => selectChat(chat.id)}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {chat.messages.length} messages
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    exportChat(chat.id)
                  }}
                  className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Export chat"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteChat(chat.id)
                  }}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors text-red-500"
                  title="Delete chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Sidebar
