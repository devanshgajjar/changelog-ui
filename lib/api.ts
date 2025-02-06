import type { LogEntry } from "@/types/logs"

const API_URL = 'http://localhost:3003/api'

export async function fetchPendingLogs(): Promise<LogEntry[]> {
  const response = await fetch(`${API_URL}/logs/pending`)
  if (!response.ok) throw new Error('Failed to fetch pending logs')
  return response.json()
}

export async function fetchApprovedLogs(): Promise<LogEntry[]> {
  const response = await fetch(`${API_URL}/logs/approved`)
  if (!response.ok) throw new Error('Failed to fetch approved logs')
  return response.json()
}

export async function updateLogStatus(id: string, status: string): Promise<void> {
  const response = await fetch(`${API_URL}/logs/${id}/status?status=${status}`, {
    method: 'PUT'
  })
  if (!response.ok) throw new Error('Failed to update log status')
}

export async function updateLogContent(id: string, content: Partial<LogEntry>): Promise<void> {
  const response = await fetch(`${API_URL}/logs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  })
  if (!response.ok) throw new Error('Failed to update log content')
} 