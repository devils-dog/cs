import React, { useState, useEffect } from 'react'
import { MapResponse, LineupResponse } from './api/types'
import { apiClient } from './api/clientSingleton'
import AppLayout from './components/AppLayout'
import MapSelector from './components/MapSelector'
import SideSelector from './components/SideSelector'
import GrenadeTypeSelector from './components/GrenadeTypeSelector'
import TargetSelector from './components/TargetSelector'
import LineupGrid from './components/LineupGrid'
import LineupDetails from './components/LineupDetails'
import { initTelegramWebApp } from './telegram/sdk'

function App() {
  // State management
  const [selectedMap, setSelectedMap] = useState<MapResponse | null>(null)
  const [selectedSide, setSelectedSide] = useState<'T' | 'CT' | null>(null)
  const [selectedGrenadeType, setSelectedGrenadeType] = useState<'smoke' | 'flash' | 'molotov' | 'he' | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [selectedLineup, setSelectedLineup] = useState<LineupResponse | null>(null)
  const [lineups, setLineups] = useState<LineupResponse[]>([])
  const [lineupsLoading, setLineupsLoading] = useState(false)
  const [lineupsError, setLineupsError] = useState<string | null>(null)
  const [lineupsEmpty, setLineupsEmpty] = useState(false)
  
  // Initialize Telegram WebApp once only
  useEffect(() => {
    initTelegramWebApp()
  }, [])
  
  // Handle map selection
  const handleMapSelect = (map: MapResponse) => {
    setSelectedMap(map)
    setSelectedSide(null)
    setSelectedGrenadeType(null)
    setSelectedTarget(null)
    setSelectedLineup(null)
    setLineups([])
  }
  
  // Handle side selection
  const handleSideSelect = (side: 'T' | 'CT') => {
    setSelectedSide(side)
    setSelectedGrenadeType(null)
    setSelectedTarget(null)
    setSelectedLineup(null)
    setLineups([])
  }
  
  // Handle grenade type selection
  const handleGrenadeTypeSelect = (grenadeType: 'smoke' | 'flash' | 'molotov' | 'he') => {
    setSelectedGrenadeType(grenadeType)
    setSelectedTarget(null)
    setSelectedLineup(null)
    setLineups([])
  }
  
  // Handle target selection
  const handleTargetSelect = (target: string) => {
    setSelectedTarget(target)
    setSelectedLineup(null)
  }
  
  // Handle lineup selection
  const handleLineupSelect = (lineup: LineupResponse) => {
    setSelectedLineup(lineup)
  }
  
  // Handle back to lineup list
  const handleBackToLineups = () => {
    setSelectedLineup(null)
  }
  
  // Fetch lineups when filters change
  React.useEffect(() => {
    const fetchLineups = async () => {
      if (!selectedMap) return
      
      setLineupsLoading(true)
      setLineupsError(null)
      setLineupsEmpty(false)
      
      try {
        const filters: {
          side?: 'T' | 'CT'
          grenade_type?: 'smoke' | 'flash' | 'molotov' | 'he'
          target?: string
        } = {}
        if (selectedSide) filters.side = selectedSide
        if (selectedGrenadeType) filters.grenade_type = selectedGrenadeType
        if (selectedTarget) filters.target = selectedTarget
        
        const result = await apiClient.getMapLineups(selectedMap.id, filters)
        setLineups(result.items)
        
        if (result.items.length === 0) {
          setLineupsEmpty(true)
        }
      } catch (error) {
        if (error instanceof Error) {
          setLineupsError(error.message)
        } else {
          setLineupsError('An unknown error occurred')
        }
        setLineups([])
      } finally {
        setLineupsLoading(false)
      }
    }
    
    if (selectedMap) {
      fetchLineups()
    }
  }, [selectedMap, selectedSide, selectedGrenadeType, selectedTarget])
  
  // Reset state when map changes
  React.useEffect(() => {
    if (selectedMap) {
      setSelectedSide(null)
      setSelectedGrenadeType(null)
      setSelectedTarget(null)
      setSelectedLineup(null)
      setLineups([])
    }
  }, [selectedMap])
  
  // Main layout with different views
  return (
    <div className="app">
      <AppLayout>
        {selectedLineup ? (
          <LineupDetails 
            lineup={selectedLineup} 
            onBack={handleBackToLineups} 
          />
        ) : (
          <>
            <div className="app-header">
              <h1>CS2 Nades</h1>
            </div>
            
            {!selectedMap ? (
              <MapSelector 
                onSelectMap={handleMapSelect} 
                selectedMapId={selectedMap?.id} 
              />
            ) : (
              <>
                <div className="filter-section">
                  <SideSelector 
                    selectedSide={selectedSide} 
                    onSideSelect={handleSideSelect} 
                  />
                  <GrenadeTypeSelector 
                    selectedGrenadeType={selectedGrenadeType} 
                    onGrenadeTypeSelect={handleGrenadeTypeSelect} 
                  />
                  <TargetSelector 
                    selectedTarget={selectedTarget}
                    onTargetSelect={handleTargetSelect}
                    mapId={selectedMap?.id}
                    side={selectedSide}
                    grenadeType={selectedGrenadeType}
                  />
                </div>
                
                <LineupGrid 
                  lineups={lineups}
                  onLineupSelect={handleLineupSelect}
                  loading={lineupsLoading}
                  error={lineupsError}
                  empty={lineupsEmpty}
                />
              </>
            )}
          </>
        )}
      </AppLayout>
    </div>
  )
}

export default App