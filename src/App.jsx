import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChatProvider } from './contexts/ChatContext'
import { SettingsProvider } from './contexts/SettingsContext'
import Layout from './components/Layout/Layout'
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <SettingsProvider>
      <ChatProvider>
        <Router>
          <div className="App min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <Layout>
              <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/chat/:chatId" element={<ChatPage />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </ChatProvider>
    </SettingsProvider>
  )
}

export default App
