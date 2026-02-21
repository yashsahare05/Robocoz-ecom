import { Hero } from "@/components/home/hero";
import { CategoryHighlights } from "@/components/home/category-highlights";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ServicesOverview } from "@/components/home/services-overview";
import { Testimonials } from "@/components/home/testimonials";
import { WhyChooseUs } from "@/components/home/value-props";

export default function HomePage() {
  return (
    <>
      
      <Hero />
      <CategoryHighlights />
      <FeaturedProducts />
      <ServicesOverview />
      <Testimonials />
      <WhyChooseUs />
            
    </>
  );
}
