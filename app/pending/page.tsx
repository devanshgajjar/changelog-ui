"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import type { LogEntry } from "../../types/logs"
import { fetchPendingLogs, updateLogStatus, updateLogContent } from '../../lib/api'
import { useApp } from "../../contexts/AppContext"
import { EditLogModal } from "../../components/ui/EditLogModal"

export default function PendingPage() {
  const { refreshPendingCount } = useApp()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const loadLogs = async () => {
    try {
      setError(null)
      const pendingLogs = await fetchPendingLogs()
      setLogs(pendingLogs)
    } catch (error) {
      console.error('Error fetching logs:', error)
      setError(error instanceof Error ? error.message : 'Failed to load logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const handleApprove = async (id: string) => {
    setIsUpdating(id)
    try {
      await updateLogStatus(id, 'approved')
      setLogs(currentLogs => currentLogs.filter(log => log.id !== id))
      await refreshPendingCount()
    } catch (error) {
      console.error('Error approving log:', error)
      await loadLogs()
    } finally {
      setIsUpdating(null)
    }
  }

  const handleEdit = async (updatedLog: LogEntry) => {
    try {
      await updateLogContent(updatedLog.id, {
        title: updatedLog.title,
        content: updatedLog.content,
        image_url: updatedLog.image_url
      })
      await loadLogs()
    } catch (error) {
      console.error('Error updating log:', error)
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
      <div className="flex justify-between items-center py-6">
        <h1 className="text-2xl font-semibold">Pending Changes</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-full px-6"
        >
          Create New
        </Button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No pending changes
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
                  onClick={() => handleEdit(log)}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleApprove(log.id)}
                  disabled={isUpdating === log.id}
                >
                  {isUpdating === log.id ? 'Approving...' : 'Approve'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditLogModal
        log={{
          id: '',
          title: '',
          content: '',
          date: new Date().toISOString(),
          status: 'pending'
        }}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleEdit}
      />
    </div>
  )
} 