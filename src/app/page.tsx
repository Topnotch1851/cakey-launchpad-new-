import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { FeaturesGallery } from "@/components/landing/FeaturesGallery";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Roadmap } from "@/components/landing/Roadmap";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <Hero />
      <Problem />
      <FeaturesGallery />
      <HowItWorks />
      <Roadmap />
      <Waitlist />
      <Footer />
    </main>
  );
}
