import React from 'react'

interface VideoPlayerProps {
  telegramMessageId: number
  telegramUrl?: string
  onVideoUnavailable?: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ telegramMessageId, telegramUrl, onVideoUnavailable }) => {
  const openTelegramPost = () => {
    if (!telegramUrl) {
      onVideoUnavailable?.()
      return
    }
    window.open(telegramUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="video-player">
      <div className="video-container">
        <div className="video-placeholder">
          <p>{telegramUrl ? `Video from Telegram channel message #${telegramMessageId}` : 'Telegram video is unavailable.'}</p>
          {telegramUrl && (
            <button
              className="open-telegram-button"
              onClick={openTelegramPost}
              aria-label={`Open Telegram post #${telegramMessageId} in Telegram`}
            >
              Open in Telegram
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
