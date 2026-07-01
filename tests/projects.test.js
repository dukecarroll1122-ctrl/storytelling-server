import { describe, it, expect } from 'vitest'

describe('Project API', () => {
  it('should return 200 from health check', async () => {
    const response = await fetch('http://localhost:3001')
    expect(response.status).toBe(200)
  })

  it('should return an array or error for a user endpoint', async () => {
  const response = await fetch('http://localhost:3001/api/projects/temp-user')
  expect(response.status).toBe(200 || 500)
  const data = await response.json()
  expect(Array.isArray(data) || typeof data === 'object').toBe(true)
})

  it('should return 404 for unknown routes', async () => {
    const response = await fetch('http://localhost:3001/api/unknown-route')
    expect(response.status).toBe(404)
  })

  it('should reject project creation without required fields', async () => {
    const response = await fetch('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(response.status).toBe(400)
  })
})