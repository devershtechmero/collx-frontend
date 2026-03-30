import { SiteHeader } from "@/components/shared/layout/site-header";
import { AuthCta } from "@/components/sections/home/auth-cta";
import { CollectionSection } from "@/components/sections/home/collection-section";
import { DownloadAppSection } from "@/components/sections/home/download-app-section";
import { FeaturesSection } from "@/components/sections/home/features-section";
import { HeroSlider } from "@/components/sections/home/hero-slider";
import { HowItWorksSection } from "@/components/sections/home/how-it-works-section";
import { MarketplaceSection } from "@/components/sections/home/marketplace-section";
import { SiteFooter } from "@/components/sections/home/site-footer";

export function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <AuthCta />
      <HeroSlider />
      <FeaturesSection />
      <MarketplaceSection />
      <CollectionSection />
      <DownloadAppSection />
      <HowItWorksSection />
      <SiteFooter />
    </main>
  );
}
