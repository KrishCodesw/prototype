import IssuesListClient from '@/components/issues-list-client'

export default function IssuesPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Nearby Issues</h1>
      <IssuesListClient />
    </main>
  )
}

