"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, MapPin, Clock, Flag, Eye } from 'lucide-react'
import Link from 'next/link'

type Issue = { 
  id: number; 
  status: string; 
  description: string; 
  tags?: string[]; 
  image_url?: string;
  flagged?: boolean;
  created_at: string;
  latitude?: number;
  longitude?: number;
  vote_count?: number;
}

const STATUS_COLORS: Record<string, string> = {
  'active': 'bg-red-100 text-red-800',
  'under_progress': 'bg-yellow-100 text-yellow-800',
  'under_review': 'bg-blue-100 text-blue-800',
  'closed': 'bg-green-100 text-green-800'
}

const CATEGORY_COLORS: Record<string, string> = {
  'pothole': 'bg-red-100 text-red-800',
  'streetlight': 'bg-yellow-100 text-yellow-800',
  'sanitation': 'bg-green-100 text-green-800',
  'water': 'bg-blue-100 text-blue-800',
  'traffic': 'bg-orange-100 text-orange-800',
  'park': 'bg-emerald-100 text-emerald-800',
  'other': 'bg-gray-100 text-gray-800'
}

export function IssueCard({ issue, onUpvote, showDistance }: { 
  issue: Issue, 
  onUpvote?: (id: number) => Promise<void>,
  showDistance?: number
}) {
  const [upvoting, setUpvoting] = useState(false)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [voteCount, setVoteCount] = useState(issue.vote_count || 0)

  const handleUpvote = async () => {
    if (!onUpvote || hasUpvoted || upvoting) return
    
    setUpvoting(true)
    try {
      await onUpvote(issue.id)
      setHasUpvoted(true)
      setVoteCount(prev => prev + 1)
    } catch (error) {
      console.error('Failed to upvote:', error)
    } finally {
      setUpvoting(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${
      issue.flagged ? 'border-red-200 bg-red-50/50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-muted-foreground">#{issue.id}</span>
              {issue.flagged && <Flag className="h-4 w-4 text-red-500" />}
              {showDistance && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {showDistance.toFixed(1)}km away
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={STATUS_COLORS[issue.status] || 'bg-gray-100 text-gray-800'}>
                {issue.status.replace('_', ' ')}
              </Badge>
              {issue.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className={CATEGORY_COLORS[tag] || 'bg-gray-100 text-gray-800'}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {onUpvote && (
            <Button
              size="sm"
              variant={hasUpvoted ? "default" : "outline"}
              onClick={handleUpvote}
              disabled={upvoting || hasUpvoted}
              className="flex items-center gap-1"
            >
              <ThumbsUp className={`h-4 w-4 ${hasUpvoted ? 'fill-current' : ''}`} />
              {voteCount > 0 && <span className="text-xs">{voteCount}</span>}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">{issue.description}</p>
        
        {issue.image_url && (
          <div className="rounded-lg overflow-hidden">
            <Image 
              src={issue.image_url} 
              alt="Issue photo" 
              width={400} 
              height={200} 
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(issue.created_at)}
          </div>
          
          <Link href={`/issues/${issue.id}`}>
            <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

