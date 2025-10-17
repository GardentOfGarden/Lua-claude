import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Settings, Sun, Moon } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

function Header() {
  const location = useLocation()
  const { settings, setTheme } = useSettings()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Eclipse Project
          </h1>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-claude-green text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Chat
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/settings'
                  ? 'bg-claude-green text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Settings size={16} />
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {settings.theme === 'dark' ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
