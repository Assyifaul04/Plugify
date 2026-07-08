import Hero from "@/components/landing/hero";
import FeaturedProjects from "@/components/landing/featured-projects";
import TrendingProjects from "@/components/landing/trending-projects";
import NewestProjects from "@/components/landing/newest-projects";
import Categories from "@/components/landing/categories";
import Statistics from "@/components/landing/statistics";
import FavoriteLauncher from "@/components/landing/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <TrendingProjects />
      <NewestProjects />
      <Categories />
      <Statistics />
      <FavoriteLauncher />
    </>
  );
}