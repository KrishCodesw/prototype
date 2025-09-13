"use client"

import { useEffect, useState } from 'react'

type Issue = { id: number; status: string; description: string }
export default function IssuesListClient() {
  const [issues, setIssues] = useState<Issue[]>([])
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      const res = await fetch(`/api/issues/near?lat=${lat}&lng=${lng}`, { cache: 'no-store' })
      const data = await res.json()
      setIssues(data || [])
    })
  }, [])

  return (
    <div className="space-y-3">
      {issues.map((it) => (
        <div key={it.id} className="p-3 rounded border text-sm">
          <a className="underline" href={`/issues/${it.id}`}>#{it.id}</a> {it.status} · {it.description}
        </div>
      ))}
      {!issues.length && <div className="text-sm text-muted-foreground">No nearby issues yet</div>}
    </div>
  )
}

