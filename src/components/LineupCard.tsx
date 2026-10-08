import React from 'react'
import { LineupResponse } from '../api/types'

interface LineupCardProps {
  lineup: LineupResponse
  onSelect: (lineup: LineupResponse) => void
}

const LineupCard: React.FC<LineupCardProps> = ({ lineup, onSelect }) => {
  return (
    <div 
      className="lineup-card"
      onClick={() => onSelect(lineup)}
    >
      <div className="lineup-thumbnail">
        {lineup.thumbnail_url ? (
          <img src={lineup.thumbnail_url} alt={lineup.title} />
        ) : (
          <div className="no-thumbnail">No thumbnail</div>
        )}
      </div>
      <div className="lineup-details">
        <h3 className="lineup-title">{lineup.title}</h3>
        <div className="lineup-info">
          <span className="side-badge">{lineup.side}</span>
          <span className="grenade-badge">{lineup.grenade_type}</span>
          <span className="target-badge">{lineup.target}</span>
        </div>
      </div>
    </div>
  )
}

export default LineupCard