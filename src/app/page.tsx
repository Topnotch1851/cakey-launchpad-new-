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
      {/*
        Prefetch the 3D scene binary in the background.  By the time the
        hero idle-mounts the Spline runtime, the browser already has the
        ~1.3MB binary cached, so first-paint isn't competing for bandwidth
        and the robot appears as soon as the runtime is ready.
      */}
      <link
        rel="prefetch"
        as="fetch"
        href="/scene.splinecode"
        media="(min-width: 768px) and (hover: hover) and (pointer: fine)"
        crossOrigin="anonymous"
      />
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
