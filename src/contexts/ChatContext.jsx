import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { chatService } from '../services/chatService'

const ChatContext = createContext()

const initialState = {
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
  searchQuery: ''
}

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CHATS':
      return { ...state, chats: action.payload }
    case 'SET_CURRENT_CHAT':
      return { 
        ...state, 
        currentChat: action.payload,
        messages: action.payload?.messages || []
      }
    case 'ADD_MESSAGE':
      const newMessages = [...state.messages, action.payload]
      return { 
        ...state, 
        messages: newMessages,
        currentChat: state.currentChat ? {
          ...state.currentChat,
          messages: newMessages,
          lastMessage: action.payload.content,
          updatedAt: new Date().toISOString()
        } : null
      }
    case 'UPDATE_MESSAGE':
      const updatedMessages = state.messages.map(msg =>
        msg.id === action.payload.id ? action.payload : msg
      )
      return { ...state, messages: updatedMessages }
    case 'NEW_CHAT':
      const newChat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      return {
        ...state,
        chats: [newChat, ...state.chats],
        currentChat: newChat,
        messages: [],
        error: null
      }
    case 'DELETE_CHAT':
      const filteredChats = state.chats.filter(chat => chat.id !== action.payload)
      const shouldClearCurrent = state.currentChat?.id === action.payload
      return {
        ...state,
        chats: filteredChats,
        currentChat: shouldClearCurrent ? null : state.currentChat,
        messages: shouldClearCurrent ? [] : state.messages
      }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    default:
      return state
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  useEffect(() => {
    const savedChats = localStorage.getItem('eclipse-chats')
    if (savedChats) {
      dispatch({ type: 'SET_CHATS', payload: JSON.parse(savedChats) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('eclipse-chats', JSON.stringify(state.chats))
  }, [state.chats])

  const sendMessage = async (content, chatId = null) => {
    if (!content.trim()) return

    const messageId = Date.now().toString()
    const userMessage = {
      id: messageId,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    }

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })

    // Create new chat if needed
    let currentChat = state.currentChat
    if (!currentChat) {
      const newChat = {
        id: chatId || Date.now().toString(),
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        messages: [userMessage],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      dispatch({ type: 'SET_CURRENT_CHAT', payload: newChat })
      dispatch({ type: 'SET_CHATS', payload: [newChat, ...state.chats] })
      currentChat = newChat
    } else {
      // Update chat title if it's the first message
      if (currentChat.messages.length === 0) {
        currentChat = {
          ...currentChat,
          title: content.slice(0, 50) + (content.length > 50 ? '...' : '')
        }
        dispatch({ type: 'SET_CURRENT_CHAT', payload: currentChat })
      }
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const response = await chatService.sendMessage(
        [...state.messages, userMessage],
        content
      )

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage })
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to send message' 
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const newChat = () => {
    dispatch({ type: 'NEW_CHAT' })
  }

  const selectChat = (chatId) => {
    const chat = state.chats.find(c => c.id === chatId)
    dispatch({ type: 'SET_CURRENT_CHAT', payload: chat })
  }

  const deleteChat = (chatId) => {
    dispatch({ type: 'DELETE_CHAT', payload: chatId })
  }

  const clearChats = () => {
    dispatch({ type: 'SET_CHATS', payload: [] })
    dispatch({ type: 'SET_CURRENT_CHAT', payload: null })
    dispatch({ type: 'SET_MESSAGES', payload: [] })
  }

  const exportChat = (chatId) => {
    const chat = state.chats.find(c => c.id === chatId)
    if (!chat) return

    const content = chat.messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `eclipse-chat-${chatId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }

  const filteredChats = state.chats.filter(chat =>
    chat.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.content.toLowerCase().includes(state.searchQuery.toLowerCase())
    )
  )

  return (
    <ChatContext.Provider value={{
      ...state,
      filteredChats,
      sendMessage,
      newChat,
      selectChat,
      deleteChat,
      clearChats,
      exportChat,
      setSearchQuery
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
