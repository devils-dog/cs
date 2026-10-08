import React from 'react'
import { getTelegramWebApp } from '../telegram/sdk'

interface VideoPlayerProps {
  telegramMessageId: number
  onVideoUnavailable?: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ telegramMessageId, onVideoUnavailable }) => {
  const openTelegramPost = () => {
    const webApp = getTelegramWebApp()
    if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
      // Use Telegram's deep linking to open the message in the channel
      const telegramUrl = `https://t.me/c/0/${telegramMessageId}`
      window.open(telegramUrl, '_blank')
    } else {
      // Fallback for development mode - show a fallback link or handle gracefully
      console.warn('Not in Telegram environment, showing fallback for video access')
      const telegramUrl = `https://t.me/c/0/${telegramMessageId}`
      window.open(telegramUrl, '_blank')
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