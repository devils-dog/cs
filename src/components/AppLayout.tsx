import React from 'react'
import './AppLayout.css'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>CS2 Nades</h1>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>CS2 Grenade Lineups Catalog</p>
      </footer>
    </div>
  )
}

export default AppLayout