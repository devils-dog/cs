import React, { useState } from 'react'

interface VideoPlayerProps {
  lineupId: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ lineupId }) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="video-player">
        <div className="video-container">
          <div className="video-placeholder"><p>Video is unavailable.</p></div>
        </div>
      </div>
    )
  }

  return (
    <div className="video-player">
      <div className="video-container">
        <video
          controls
          playsInline
          preload="metadata"
          width="100%"
          src={`/api/telegram/lineups/${encodeURIComponent(lineupId)}/video`}
          onError={() => setHasError(true)}
          aria-label={`Lineup video for ${lineupId}`}
        />
      </div>
    </div>
  )
}

export default VideoPlayer
