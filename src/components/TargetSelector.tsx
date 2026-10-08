import React, { useState, useEffect } from 'react'

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
        const params = new URLSearchParams()
        if (side) params.append('side', side)
        if (grenadeType) params.append('grenade_type', grenadeType)
        
        // Fetch targets by getting lineups and extracting unique targets
        const response = await fetch(`/api/maps/${mapId}/lineups?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch lineups: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        const uniqueTargets = Array.from(new Set(data.items.map((item: any) => item.target))).sort()
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