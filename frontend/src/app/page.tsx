import { CtaSection } from "@/components/landing/cta-section";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Hero } from "@/components/landing/hero";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { TechStrip } from "@/components/landing/tech-strip";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <Hero />
      <TechStrip />
      <FeatureGrid />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
