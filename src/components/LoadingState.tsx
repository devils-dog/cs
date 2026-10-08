import React from 'react'

const LoadingState: React.FC = () => {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  )
}

export default LoadingState