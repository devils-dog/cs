import React from 'react'

interface VideoPlayerProps {
  telegramMessageId: number
  telegramUrl?: string
  onVideoUnavailable?: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ telegramMessageId, telegramUrl, onVideoUnavailable }) => {
  const openTelegramPost = () => {
    // Use the telegram_url from the API if available
    if (telegramUrl) {
      window.open(telegramUrl, '_blank')
    } else {
      // Fallback to the Telegram channel URL if no specific URL is provided
      console.warn('No telegram_url provided from API, using fallback')
      // This should not happen in production - the API should provide the full URL
      window.open(`https://t.me/placeholder_channel/${telegramMessageId}`, '_blank')
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