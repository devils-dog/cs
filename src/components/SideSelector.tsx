import React from 'react'

interface SideSelectorProps {
  selectedSide: 'T' | 'CT' | null
  onSideSelect: (side: 'T' | 'CT') => void
}

const SideSelector: React.FC<SideSelectorProps> = ({ selectedSide, onSideSelect }) => {
  return (
    <div className="side-selector">
      <h3>Select Side</h3>
      <div className="side-buttons">
        <button
          className={`side-button ${selectedSide === 'T' ? 'selected' : ''}`}
          onClick={() => onSideSelect('T')}
        >
          T
        </button>
        <button
          className={`side-button ${selectedSide === 'CT' ? 'selected' : ''}`}
          onClick={() => onSideSelect('CT')}
        >
          CT
        </button>
      </div>
    </div>
  )
}

export default SideSelector