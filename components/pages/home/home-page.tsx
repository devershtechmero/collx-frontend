import { SiteHeader } from "@/components/shared/layout/site-header";
import { AuthCta } from "@/components/sections/home/auth-cta";
import { HeroSlider } from "@/components/sections/home/hero-slider";

export function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <HeroSlider />
      <AuthCta />
    </main>
  );
}
