import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Issue = { id: number; status: string; description: string; tags?: string[]; image_url?: string }
export function IssueCard({ issue, onUpvote }: { issue: Issue, onUpvote?: (id: number) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-base">#{issue.id} · {issue.status.replaceAll('_',' ')}</span>
          {onUpvote && (
            <Button size="sm" variant="secondary" onClick={() => onUpvote(issue.id)}>Upvote</Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{issue.description}</p>
        <div className="flex gap-2 text-xs">
          {issue.tags?.map((t: string) => (
            <span key={t} className="px-2 py-0.5 rounded bg-muted">{t}</span>
          ))}
        </div>
        {issue.image_url && (
          <Image src={issue.image_url} alt="issue" width={600} height={400} className="rounded" />
        )}
      </CardContent>
    </Card>
  )
}

