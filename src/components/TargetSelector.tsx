import React, { useState, useEffect } from 'react'
import { apiClient } from '../api/clientSingleton'

interface TargetSelectorProps {
  selectedTarget: string | null
  onTargetSelect: (target: string) => void
  mapId: string | null
  side: 'T' | 'CT' | null
  grenadeType: 'smoke' | 'flash' | 'molotov' | 'he' | null
}

const TargetSelector: React.FC<TargetSelectorProps> = ({ selectedTarget, onTargetSelect, mapId, side, grenadeType }) => {
  const [targets, setTargets] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch unique targets from existing lineups for the current map and filters
  useEffect(() => {
    if (!mapId) return
    
    const fetchTargets = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Build query parameters based on current selections
        const filters: any = {}
        if (side) filters.side = side
        if (grenadeType) filters.grenade_type = grenadeType
        
        // Fetch targets by getting lineups and extracting unique targets
        const result = await apiClient.getMapLineups(mapId, filters)
        
        const uniqueTargets = Array.from(new Set(result.items.map((item: any) => item.target))).sort()
        setTargets(uniqueTargets)
      } catch (err) {
        console.error('Error fetching targets:', err)
        setError('Failed to load targets')
        setTargets([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchTargets()
  }, [mapId, side, grenadeType])

  // Handle target selection
  const handleSelect = (target: string) => {
    onTargetSelect(target)
  }

  if (loading) {
    return (
      <div className="target-selector">
        <h3>Target</h3>
        <p>Loading targets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="target-selector">
        <h3>Target</h3>
        <p className="error">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="target-selector">
      <h3>Target</h3>
      <div className="target-buttons">
        {targets.length > 0 ? (
          targets.map(target => (
            <button
              key={target}
              className={`target-button ${selectedTarget === target ? 'selected' : ''}`}
              onClick={() => handleSelect(target)}
            >
              {target}
            </button>
          ))
        ) : (
          <p>No targets available</p>
        )}
      </div>
    </div>
  )
}

export default TargetSelector