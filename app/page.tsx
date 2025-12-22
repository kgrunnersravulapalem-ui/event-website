import Hero from "@/components/sections/Hero/Hero";
import About from "@/components/sections/About/About";
import RaceCategories from "@/components/sections/RaceCategories/RaceCategories";
import Venue from "@/components/sections/Venue/Venue";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KONASEEMA RUN 2026 - Ravulapalem | Our Health, Our Village",
  description: "The official website for KONASEEMA RUN 2026. Join us on Feb 8th, 2026, for a marathon experience in Ravulapalem. Categories: 3K, 5K, 10K.",
};

export default function Home() {
  return (
    <main>
      {/* We need to restructure Hero to show countdown or place it here */}
      <Hero />

      {/* Sections for Homepage information */}
      <About />
      <RaceCategories />
      <Venue />
    </main>
  );
}
