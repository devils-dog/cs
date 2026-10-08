import React from 'react'
import { LineupResponse } from '../api/types'
import VideoPlayer from './VideoPlayer'

interface LineupDetailsProps {
  lineup: LineupResponse
  onBack: () => void
}

const LineupDetails: React.FC<LineupDetailsProps> = ({ lineup, onBack }) => (
  <div className="lineup-details">
    <button className="back-button" onClick={onBack}>← Back</button>
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
      <VideoPlayer lineupId={lineup.id} />
    </div>
  </div>
)

export default LineupDetails
