import React from 'react'
import { LineupResponse } from '../api/types'

interface LineupCardProps {
  lineup: LineupResponse
  onSelect: (lineup: LineupResponse) => void
}

const grenadeLabels: Record<LineupResponse['grenade_type'], string> = {
  smoke: 'Smoke',
  flash: 'Flash',
  molotov: 'Molotov',
  he: 'HE grenade'
}

const LineupCard: React.FC<LineupCardProps> = ({ lineup, onSelect }) => {
  const open = () => onSelect(lineup)

  return (
    <article
      className="lineup-card"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          open()
        }
      }}
      aria-label={`Play ${lineup.title}`}
    >
      <div className="lineup-thumbnail">
        {lineup.thumbnail_url ? (
          <img src={lineup.thumbnail_url} alt={`Preview: ${lineup.title}`} loading="lazy" />
        ) : (
          <div className="thumbnail-placeholder" aria-hidden="true">
            <span className="placeholder-map">{lineup.map_id.replace(/^de_/, '').toUpperCase()}</span>
            <span className="play-icon" />
            <span className="placeholder-caption">VIDEO PREVIEW</span>
          </div>
        )}
        <span className="thumbnail-side">{lineup.side}</span>
      </div>
      <div className="lineup-card-content">
        <div className="lineup-card-eyebrow">
          <span className={`side-badge side-${lineup.side.toLowerCase()}`}>{lineup.side}</span>
          <span className="grenade-badge">{grenadeLabels[lineup.grenade_type] || lineup.grenade_type}</span>
        </div>
        <h3 className="lineup-title">{lineup.title}</h3>
        {lineup.target && <p className="lineup-target"><span aria-hidden="true">⌖</span> {lineup.target}</p>}
        <div className="lineup-card-action">
          <span>Watch lineup</span>
          <span className="action-arrow" aria-hidden="true">↗</span>
        </div>
      </div>
    </article>
  )
}

export default LineupCard
