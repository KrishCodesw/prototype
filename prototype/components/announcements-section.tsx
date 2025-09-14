"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Megaphone, 
  AlertCircle, 
  Info, 
  Construction, 
  Bell,
  Calendar,
  Building2,
  ChevronRight,
  X
} from 'lucide-react'

type Announcement = {
  id: number
  title: string
  content: string
  type: string
  priority: string
  created_at: string
  expires_at?: string
  department?: { name: string }
}

const TYPE_ICONS = {
  general: Bell,
  alert: AlertCircle,
  info: Info,
  maintenance: Construction
}

const PRIORITY_COLORS = {
  urgent: 'destructive',
  high: 'default',
  normal: 'secondary',
  low: 'outline'
} as const

const TYPE_COLORS = {
  alert: 'bg-red-50 border-red-200',
  urgent: 'bg-orange-50 border-orange-200',
  maintenance: 'bg-yellow-50 border-yellow-200',
  info: 'bg-blue-50 border-blue-200',
  general: 'bg-gray-50 border-gray-200'
}

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements')
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  const dismissAnnouncement = (id: number) => {
    const newDismissed = new Set(dismissed)
    newDismissed.add(id)
    setDismissed(newDismissed)
  }

  const visibleAnnouncements = announcements.filter(a => !dismissed.has(a.id))

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading announcements...</p>
        </CardContent>
      </Card>
    )
  }

  if (visibleAnnouncements.length === 0) {
    return null // Don't show anything if no announcements
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Government Announcements</h2>
        <Badge variant="outline">
          {visibleAnnouncements.length} active
        </Badge>
      </div>
      
      <div className="space-y-3">
        {visibleAnnouncements.map((announcement) => {
          const IconComponent = TYPE_ICONS[announcement.type as keyof typeof TYPE_ICONS] || Bell
          const isExpanded = expanded.has(announcement.id)
          const cardColor = TYPE_COLORS[announcement.type as keyof typeof TYPE_COLORS] || TYPE_COLORS.general
          
          return (
            <Card key={announcement.id} className={`${cardColor} relative`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      announcement.priority === 'urgent' ? 'bg-red-100' :
                      announcement.priority === 'high' ? 'bg-orange-100' :
                      'bg-blue-100'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        announcement.priority === 'urgent' ? 'text-red-600' :
                        announcement.priority === 'high' ? 'text-orange-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-tight">
                        {announcement.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant={PRIORITY_COLORS[announcement.priority as keyof typeof PRIORITY_COLORS] || 'secondary'}>
                          {announcement.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {announcement.type}
                        </Badge>
                        {announcement.department && (
                          <Badge variant="outline" className="text-xs">
                            <Building2 className="h-3 w-3 mr-1" />
                            {announcement.department.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(announcement.id)}
                      className="p-1"
                    >
                      <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAnnouncement(announcement.id)}
                      className="p-1 opacity-60 hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="pl-11">
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {announcement.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(announcement.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      
                      {announcement.expires_at && (
                        <div className="text-orange-600">
                          Expires: {new Date(announcement.expires_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
