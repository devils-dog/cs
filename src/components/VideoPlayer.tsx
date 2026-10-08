import React from 'react'
import { getTelegramWebApp } from '../telegram/sdk'

interface VideoPlayerProps {
  telegramMessageId: number
  telegramUrl?: string
  onVideoUnavailable?: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ telegramMessageId, telegramUrl, onVideoUnavailable }) => {
  const openTelegramPost = () => {
    const webApp = getTelegramWebApp()
    if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
      // If we have a pre-formatted URL from the API, use it
      if (telegramUrl) {
        window.open(telegramUrl, '_blank')
      } else {
        // Fallback for development mode - construct URL from message ID
        const fallbackUrl = `https://t.me/${process.env.TELEGRAM_CHANNEL_USERNAME}/${telegramMessageId}`
        window.open(fallbackUrl, '_blank')
      }
    } else {
      // Fallback for development mode - show a fallback link or handle gracefully
      console.warn('Not in Telegram environment, showing fallback for video access')
      const fallbackUrl = `https://t.me/${process.env.TELEGRAM_CHANNEL_USERNAME}/${telegramMessageId}`
      window.open(fallbackUrl, '_blank')
    }
  }

  return (
    <div className="video-player">
      <div className="video-container">
        <div className="video-placeholder">
          <p>Video from Telegram channel message #{telegramMessageId}</p>
          <button 
            className="open-telegram-button"
            onClick={openTelegramPost}
            aria-label={`Open Telegram post #${telegramMessageId} in Telegram`}
          >
            Open in Telegram
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer