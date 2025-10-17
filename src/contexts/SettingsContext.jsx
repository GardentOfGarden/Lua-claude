import React, { createContext, useContext, useReducer, useEffect } from 'react'

const SettingsContext = createContext()

const initialState = {
  theme: 'dark',
  apiKey: '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',
  model: 'claude-3-sonnet-20240229',
  temperature: 0.7,
  maxTokens: 4000,
  systemPrompt: 'You are a helpful AI assistant.',
  enableVoice: false,
  enableMarkdown: true,
  autoScroll: true
}

function settingsReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'UPDATE_SETTINGS':
      return { ...state, ...action.payload }
    case 'RESET_SETTINGS':
      return initialState
    default:
      return state
  }
}

export function SettingsProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialState)

  useEffect(() => {
    const saved = localStorage.getItem('eclipse-settings')
    if (saved) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: JSON.parse(saved) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('eclipse-settings', JSON.stringify(settings))
    
    // Apply theme to document
    document.documentElement.className = settings.theme
  }, [settings])

  const updateSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings })
  }

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme })
  }

  const resetSettings = () => {
    dispatch({ type: 'RESET_SETTINGS' })
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      setTheme,
      resetSettings
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
