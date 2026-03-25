import { SiteHeader } from "@/components/layout/site-header";
import { AuthCta } from "@/components/sections/auth-cta";
import { HeroSlider } from "@/components/sections/hero-slider";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <HeroSlider />
      <AuthCta />
    </main>
  );
}
