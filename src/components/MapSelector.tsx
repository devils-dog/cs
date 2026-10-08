import React, { useState, useEffect } from 'react'
import { MapResponse } from '../api/types'

interface MapSelectorProps {
  onSelectMap: (map: MapResponse) => void
  selectedMapId?: string
}

const MapSelector: React.FC<MapSelectorProps> = ({ onSelectMap, selectedMapId }) => {
  const [maps, setMaps] = useState<MapResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/maps')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMaps(data)
        setLoading(false)
      } catch (err) {
        setError(`Failed to fetch maps: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setLoading(false)
      }
    }

    fetchMaps()
  }, [])

  const handleMapClick = (map: MapResponse) => {
    onSelectMap(map)
  }

  if (loading) {
    return <div className="map-selector-loading">Loading maps...</div>
  }

  if (error) {
    return <div className="map-selector-error">Error: {error}</div>
  }

  return (
    <div className="map-selector">
      <h2>Select a Map</h2>
      <div className="map-grid">
        {maps.map((map) => (
          <div
            key={map.id}
            className={`map-card ${selectedMapId === map.id ? 'selected' : ''}`}
            onClick={() => handleMapClick(map)}
          >
            <div className="map-name">{map.name}</div>
            <div className="map-lineup-count">Lineups: {map.lineup_count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MapSelector