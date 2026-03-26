import { SiteHeader } from "@/components/shared/layout/site-header";
import { SiteFooter } from "@/components/sections/home/site-footer";

export default function DataPrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Data Privacy Policy</h1>
          <p className="mt-4 text-foreground/60 italic">Last updated: March 26, 2026</p>
          
          <div className="mt-10 space-y-8 text-lg text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Data Ownership</h2>
              <p>
                Your data belongs to you. CollX acts as a processor for the collection 
                data you provide. We do not sell your personal information or collection 
                data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Data Storage and Location</h2>
              <p>
                We use secure, enterprise-grade cloud servers to store your data. 
                Data is encrypted at rest and in transit using industry-standard protocols.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active. If you choose 
                to delete your account, we will remove your personal data from our 
                active databases within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Your Rights (GDPR/CCPA)</h2>
              <p>
                Depending on your location, you may have rights to access, correct, 
                or delete your personal data. You can exercise these rights by contacting 
                our privacy team at privacy@collx.app.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
