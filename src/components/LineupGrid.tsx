import React from 'react'
import LineupCard from './LineupCard'
import { LineupResponse } from '../api/types'

interface LineupGridProps {
  lineups: LineupResponse[]
  onLineupSelect: (lineup: LineupResponse) => void
  loading?: boolean
  error?: string
  empty?: boolean
}

const LineupGrid: React.FC<LineupGridProps> = ({ 
  lineups, 
  onLineupSelect, 
  loading = false,
  error,
  empty = false
}) => {
  if (loading) {
    return (
      <div className="lineup-grid">
        <div className="loading">Loading lineups...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="lineup-grid">
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  if (empty) {
    return (
      <div className="lineup-grid">
        <div className="empty">No lineups found</div>
      </div>
    )
  }

  return (
    <div className="lineup-grid">
      {lineups.map((lineup) => (
        <LineupCard 
          key={lineup.id} 
          lineup={lineup} 
          onSelect={onLineupSelect} 
        />
      ))}
    </div>
  )
}

export default LineupGrid