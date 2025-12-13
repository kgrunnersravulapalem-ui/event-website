import Hero from "@/components/sections/Hero/Hero";
import About from "@/components/sections/About/About";
import RaceCategories from "@/components/sections/RaceCategories/RaceCategories";
import Venue from "@/components/sections/Venue/Venue";

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
