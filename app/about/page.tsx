import { SiteHeader } from "@/components/shared/layout/site-header";
import { SiteFooter } from "@/components/sections/home/site-footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About CollX</h1>
          <div className="mt-10 space-y-8 text-lg text-foreground/80 leading-relaxed">
            <p>
              CollX (pronounced "collects") is the fastest way for sports card collectors to track their 
              collections and find the value of their cards. By using advanced image recognition 
              technology, we make it possible to identify and price any card in seconds.
            </p>
            <p>
              Our mission is to empower collectors by providing them with the data and tools 
              they need to manage their cards like professional assets. Whether you're a 
              seasoned pro or just starting out, CollX is built for you.
            </p>
            <h2 className="text-2xl font-bold text-foreground">Our Story</h2>
            <p>
              Founded by passionate collectors, CollX was born out of the frustration of 
              manual pricing and disorganized spreadsheets. We wanted a better way to 
              see what our collections were worth and to connect with other collectors 
              around the world.
            </p>
            <p>
              Today, CollX is a vibrant community of thousands of collectors, scanning 
              millions of cards and building the most comprehensive database in the hobby.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
