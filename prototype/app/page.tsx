import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-8 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Civic Reporter</Link>
              <div className="flex items-center gap-2">
                <Link href="/report" className="underline">Report</Link>
                <Link href="/issues" className="underline">Nearby</Link>
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-10 max-w-3xl p-5">
          <h1 className="text-3xl font-semibold">Crowdsourced Civic Issue Reporting</h1>
<p className="text-muted-foreground">Report issues, see what&apos;s nearby, and track progress as officials resolve them.</p>
          <div className="flex gap-4">
            <Link href="/report" className="underline">Report an issue</Link>
            <Link href="/issues" className="underline">View nearby issues</Link>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
          <p>Powered by Supabase</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
