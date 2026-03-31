"use client";

import { SiteHeader } from "@/components/shared/layout/site-header";
import { AuthCta } from "@/components/sections/home/auth-cta";
import { CollectionSection } from "@/components/sections/home/collection-section";
import { DownloadAppSection } from "@/components/sections/home/download-app-section";
import { FeaturesSection } from "@/components/sections/home/features-section";
import { HeroSlider } from "@/components/sections/home/hero-slider";
import { HowItWorksSection } from "@/components/sections/home/how-it-works-section";
import { MarketplaceSection } from "@/components/sections/home/marketplace-section";
import { SiteFooter } from "@/components/sections/home/site-footer";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (user) {
    return null;
  }

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
