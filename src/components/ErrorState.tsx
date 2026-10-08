import React from 'react'

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h2>Error</h2>
      <p>{error}</p>
      <button className="retry-button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  )
}

export default ErrorState