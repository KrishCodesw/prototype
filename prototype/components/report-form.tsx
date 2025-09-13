"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ReportForm() {
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude)
        setLng(pos.coords.longitude)
      })
    }
  }, [])

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          description,
          flagged: false,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          latitude: lat,
          longitude: lng,
          images: imageUrl ? [imageUrl] : [],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit')
      // Redirect to issue detail after submit
      window.location.href = `/issues/${data.id}`
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Input placeholder="Describe the issue" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <Input placeholder="Image URL (Cloudinary/Cloudflare)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <div className="text-xs text-muted-foreground">Location: {lat?.toFixed(5)}, {lng?.toFixed(5)}</div>
      <Button disabled={loading || !description || lat === null || lng === null} onClick={submit}>
        {loading ? 'Submitting...' : 'Submit Issue'}
      </Button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  )
}

