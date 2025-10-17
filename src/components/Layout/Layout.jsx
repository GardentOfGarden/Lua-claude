import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
