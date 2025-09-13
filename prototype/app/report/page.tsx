import { ReportForm } from '@/components/report-form'

export default function ReportPage() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Report an Issue</h1>
      <ReportForm />
    </main>
  )
}

