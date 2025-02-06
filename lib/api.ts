import type { LogEntry } from "@/types/logs"

const API_URL = 'http://localhost:3003'

export async function fetchPendingLogs(): Promise<LogEntry[]> {
  try {
    const response = await fetch(`${API_URL}/api/logs/pending`)
    console.log('Response:', response.status)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('Data:', data)
    return data
  } catch (error) {
    console.error('Error fetching pending logs:', error)
    throw error
  }
}

export async function fetchApprovedLogs(): Promise<LogEntry[]> {
  const response = await fetch(`${API_URL}/api/logs/approved`)
  if (!response.ok) throw new Error('Failed to fetch approved logs')
  return response.json()
}

export async function createLog(log: Partial<LogEntry>): Promise<LogEntry> {
  const response = await fetch(`${API_URL}/api/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: log.title,
      content: log.content,
      status: 'pending'
    })
  })
  if (!response.ok) throw new Error('Failed to create log')
  return response.json()
}

export async function updateLogStatus(id: string, status: string): Promise<void> {
  try {
    console.log('Updating status:', id, status)
    const response = await fetch(`${API_URL}/api/logs/${id}/status?status=${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    console.log('Update response:', response.status)
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to update log status')
    }
  } catch (error) {
    console.error('Error updating status:', error)
    throw error
  }
}

export async function updateLogContent(id: string, content: Partial<LogEntry>): Promise<void> {
  const response = await fetch(`${API_URL}/api/logs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content)
  })
  if (!response.ok) throw new Error('Failed to update log content')
}

export async function unpublishLog(id: string): Promise<void> {
  try {
    console.log('Unpublishing log:', id)
    const response = await fetch(`${API_URL}/api/logs/${id}/status?status=pending`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    console.log('Unpublish response:', response.status)
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to unpublish log')
    }
  } catch (error) {
    console.error('Error unpublishing:', error)
    throw error
  }
} 