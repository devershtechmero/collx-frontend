import { SiteHeader } from "@/components/shared/layout/site-header";
import { SiteFooter } from "@/components/sections/home/site-footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-foreground/60 italic">Last updated: March 26, 2026</p>
          
          <div className="mt-10 space-y-8 text-lg text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <p>
                At CollX, we respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when 
                you visit our website or use our mobile application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. The Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you 
                which we have grouped together as follows:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                <li>Identity Data (name, username)</li>
                <li>Contact Data (email address)</li>
                <li>Technical Data (IP address, device type)</li>
                <li>Usage Data (how you use our app and website)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, 
                we will use your personal data to provide and improve our services, manage 
                your account, and communicate with you about updates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal 
                data from being accidentally lost, used or accessed in an unauthorized way, 
                altered or disclosed.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
