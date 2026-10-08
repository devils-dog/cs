import React from 'react'

const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon">🔍</div>
      <h2>No items found</h2>
      <p>Try selecting different filters</p>
    </div>
  )
}

export default EmptyState