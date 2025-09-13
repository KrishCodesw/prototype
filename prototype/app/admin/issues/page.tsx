import AdminIssuesClient from '@/components/admin-issues-client'

export default function AdminIssuesPage() {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin · Issues</h1>
      <AdminIssuesClient />
    </main>
  )
}

