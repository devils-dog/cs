import React from 'react'
import { LineupResponse } from '../api/types'
import { getTelegramWebApp } from '../telegram/sdk'

interface LineupDetailsProps {
  lineup: LineupResponse
  onBack: () => void
}

const LineupDetails: React.FC<LineupDetailsProps> = ({ lineup, onBack }) => {
  const openTelegramPost = () => {
    const webApp = getTelegramWebApp()
    if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
      // Deep linking to Telegram channel post
      const telegramUrl = `https://t.me/c/0/${lineup.telegram_message_id}`
      window.open(telegramUrl, '_blank')
    } else {
      // Fallback for development mode
      console.warn('Not in Telegram environment, can\'t open Telegram post directly')
      const telegramUrl = `https://t.me/c/0/${lineup.telegram_message_id}`
      window.open(telegramUrl, '_blank')
    }
  }

  return (
    <div className="lineup-details">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>
      
      <div className="lineup-header">
        <h1>{lineup.title}</h1>
        <div className="lineup-meta">
          <span className="map-badge">{lineup.map_id.toUpperCase()}</span>
          <span className="side-badge">{lineup.side}</span>
          <span className="grenade-badge">{lineup.grenade_type}</span>
          <span className="target-badge">{lineup.target}</span>
        </div>
      </div>
      
      <div className="lineup-description">
        <p>{lineup.description || 'No description available.'}</p>
      </div>
      
      <div className="video-player-container">
        <h2>Video</h2>
        <div className="video-placeholder">
          <p>Watch the lineup video on Telegram</p>
          <button 
            className="open-telegram-button"
            onClick={openTelegramPost}
          >
            Open video in Telegram
          </button>
        </div>
      </div>
    </div>
  )
}

export default LineupDetails