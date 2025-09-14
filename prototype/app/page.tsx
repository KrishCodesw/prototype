import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import IssuesMap from "@/components/issues-map";
import { DebugTest } from "@/components/debug-test";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation user={user} />
      <div className="flex-1 w-full flex flex-col gap-4 sm:gap-6 lg:gap-8 items-center">
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 lg:gap-8 max-w-5xl px-3 sm:px-4 lg:px-5 w-full">
          {/* Hero Section */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Crowdsourced Civic Issue Reporting
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              Report issues, see what&apos;s nearby, and track progress as
              officials resolve them.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                href="/report"
                className="bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base font-medium"
              >
                Report an Issue
              </Link>
              <Link
                href="/issues"
                className="border border-border px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-accent transition-colors text-sm sm:text-base font-medium"
              >
                View All Issues
              </Link>
            </div>
          </div>

          {/* Debug Test */}
          <DebugTest />

          {/* Map Section */}
          <div className="w-full">
            <IssuesMap className="w-full" />
          </div>

          {/* Quick Stats or Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6 lg:mt-8">
            <div className="text-center p-4 sm:p-6 border border-border rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-primary">📍</div>
              <h3 className="font-semibold mt-2 text-sm sm:text-base">Location-Based</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Report and view issues based on your location
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 border border-border rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-primary">🏛️</div>
              <h3 className="font-semibold mt-2 text-sm sm:text-base">Official Response</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Track progress as local officials address issues
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 border border-border rounded-lg sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary">👥</div>
              <h3 className="font-semibold mt-2 text-sm sm:text-base">Community Driven</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Vote on issues to help prioritize community needs
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
