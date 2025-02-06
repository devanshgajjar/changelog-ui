"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import type { LogEntry } from "../../types/logs"
import { fetchApprovedLogs, unpublishLog } from '../../lib/api'

export default function ApprovedPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUnpublishing, setIsUnpublishing] = useState<string | null>(null)

  const loadLogs = async () => {
    try {
      setError(null)
      setLoading(true)
      const approvedLogs = await fetchApprovedLogs()
      console.log('Loaded approved logs:', approvedLogs)
      setLogs(Array.isArray(approvedLogs) ? approvedLogs : [])
    } catch (error) {
      console.error('Error loading approved logs:', error)
      setError(error instanceof Error ? error.message : 'Failed to load logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const handleUnpublish = async (id: string) => {
    setIsUnpublishing(id)
    try {
      await unpublishLog(id)
      setLogs(currentLogs => currentLogs.filter(log => log.id !== id))
    } catch (error) {
      console.error('Error unpublishing log:', error)
      await loadLogs()
    } finally {
      setIsUnpublishing(null)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading logs: {error}</p>
        <Button onClick={loadLogs} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="max-w-[1080px] mx-auto px-4">
      <div className="py-6">
        <h1 className="text-2xl font-semibold">Approved Changes</h1>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No approved changes
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{log.title}</h3>
              <p className="text-gray-600 mb-4">{log.content}</p>
              {log.image_url && (
                <img 
                  src={log.image_url} 
                  alt="" 
                  className="mb-4 rounded-lg max-h-[200px] object-cover"
                />
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleUnpublish(log.id)}
                  disabled={isUnpublishing === log.id}
                >
                  {isUnpublishing === log.id ? 'Unpublishing...' : 'Unpublish'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 