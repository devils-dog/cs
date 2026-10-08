import { ApiClient } from './client'

// Create a singleton instance
const apiClient = new ApiClient('/api')

export { apiClient }