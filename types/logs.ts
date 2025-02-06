export interface LogEntry {
  id: string
  title: string
  content: string
  date: string
  image_url?: string
  status: 'pending' | 'approved'
  pr_url?: string
  pr_number?: string
} 