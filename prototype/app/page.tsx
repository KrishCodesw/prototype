import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import IssuesMap from "@/components/issues-map";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation user={user} />
      
      {/* Main content with proper responsive container */}
      <div className="flex-1 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12 py-6 sm:py-8 lg:py-12">
            
            {/* Hero Section - Improved responsive design */}
            <section className="text-center space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                  Crowdsourced Civic Issue Reporting
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                  Report issues, see what&apos;s nearby, and track progress as
                  officials resolve them.
                </p>
              </div>
              
              {/* CTA Buttons - Better responsive layout */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
                <Link
                  href="/report"
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg hover:bg-primary/90 transition-all duration-200 text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
                >
                  Report an Issue
                </Link>
                <Link
                  href="/issues"
                  className="w-full sm:w-auto border border-border bg-background px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg hover:bg-accent transition-all duration-200 text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
                >
                  View All Issues
                </Link>
              </div>
            </section>

            {/* Map Section - Better responsive handling */}
            <section className="w-full">
              <div className="rounded-lg overflow-hidden border border-border shadow-sm">
                <IssuesMap className="w-full h-[300px] sm:h-[400px] lg:h-[500px]" />
              </div>
            </section>

            {/* Features Section - Improved grid layout */}
            <section className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="group text-center p-6 sm:p-8 border border-border rounded-lg bg-card hover:shadow-md transition-all duration-200">
                  <div className="text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">📍</div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Location-Based</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Report and view issues based on your location
                  </p>
                </div>
                
                <div className="group text-center p-6 sm:p-8 border border-border rounded-lg bg-card hover:shadow-md transition-all duration-200">
                  <div className="text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">🏛️</div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Official Response</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Track progress as local officials address issues
                  </p>
                </div>
                
                <div className="group text-center p-6 sm:p-8 border border-border rounded-lg bg-card hover:shadow-md transition-all duration-200 sm:col-span-2 lg:col-span-1">
                  <div className="text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">👥</div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Community Driven</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Vote on issues to help prioritize community needs
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}