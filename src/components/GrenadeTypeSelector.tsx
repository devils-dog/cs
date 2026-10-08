import React from 'react'

interface GrenadeTypeSelectorProps {
  selectedGrenadeType: 'smoke' | 'flash' | 'molotov' | 'he' | null
  onGrenadeTypeSelect: (grenadeType: 'smoke' | 'flash' | 'molotov' | 'he') => void
}

const GrenadeTypeSelector: React.FC<GrenadeTypeSelectorProps> = ({ 
  selectedGrenadeType, 
  onGrenadeTypeSelect 
}) => {
  const grenadeTypes = [
    { id: 'smoke', name: 'Smoke' },
    { id: 'flash', name: 'Flash' },
    { id: 'molotov', name: 'Molotov' },
    { id: 'he', name: 'HE' }
  ]

  return (
    <div className="grenade-type-selector">
      <h3>Select Grenade Type</h3>
      <div className="grenade-buttons">
        {grenadeTypes.map((grenade) => (
          <button
            key={grenade.id}
            className={`grenade-button ${selectedGrenadeType === grenade.id ? 'selected' : ''}`}
            onClick={() => onGrenadeTypeSelect(grenade.id as any)}
          >
            {grenade.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GrenadeTypeSelector