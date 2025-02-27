"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Button } from "./button"
import type { LogEntry } from "../../types/logs"

interface EditLogModalProps {
  log: LogEntry
  isOpen: boolean
  onClose: () => void
  onSave: (updates: Partial<LogEntry>) => Promise<void>
}

export function EditLogModal({ log, isOpen, onClose, onSave }: EditLogModalProps) {
  const [title, setTitle] = useState(log.title)
  const [content, setContent] = useState(log.content)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // Just use onSave for both create and edit
      await onSave({
        id: log.id,
        title,
        content,
        date: new Date().toISOString(),
        status: 'pending'
      })
      onClose()
    } catch (error) {
      console.error('Failed to save changes:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{log.id ? 'Edit' : 'Create'} Changelog Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              rows={5}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : log.id ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 