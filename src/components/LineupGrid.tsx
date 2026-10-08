import React from 'react'
import LineupCard from './LineupCard'
import { LineupResponse } from '../api/types'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'

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
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (empty) {
    return <EmptyState />
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