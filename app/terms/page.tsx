import { SiteHeader } from "@/components/shared/layout/site-header";
import { SiteFooter } from "@/components/sections/home/site-footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 text-foreground/60 italic">Last updated: March 26, 2026</p>
          
          <div className="mt-10 space-y-8 text-lg text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using CollX, you agree to be bound by these Terms and Conditions 
                and our Privacy Policy. If you do not agree to all these terms, you may not 
                use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Use of Services</h2>
              <p>
                You are responsible for any activity that occurs through your account. You 
                agree that you will not use CollX for any illegal or unauthorized purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Content</h2>
              <p>
                You retain all rights to any images or data you upload to CollX. However, 
                by uploading content, you grant us a non-exclusive, royalty-free license 
                to use, store, and display that content as part of providing the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitation of Liability</h2>
              <p>
                CollX is provided "as is" without warranty of any kind. In no event 
                shall CollX be liable for any damages arising out of your use of the service.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
