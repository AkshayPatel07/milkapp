import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Milk,
  Truck,
  Clock,
  Shield,
  MapPin,
  Star,
  Tractor,
  ArrowRight,
  Check,
} from "lucide-react";
import MarqueeSection from "@/components/CommonComponents/MarqueeSection";
import AboutSection from "@/components/CommonComponents/AboutSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-primary">
                ✦{" "}
                <span className="uppercase tracking-widest text-white">
                  Pure dairy Goodness
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Pure Farm-Fresh Milk Delivered to Your Doorstep
              </h1>
              <p className="text-lg text-white">
                Get 100% pure, farm-fresh milk delivered daily in Surat and
                Navsari. Quality you can trust, convenience you'll love.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-lg">
                  <Link href="/products">Order Now</Link>
                </Button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 md:pt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Surat & Navsari</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="ml-2 text-sm text-background">
                    5.0 Rating
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/hero-image.jpg"
                alt="Fresh Milk"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <MarqueeSection />

      <AboutSection />  

      {/* Features Section */}
      <section className="py-12 md:py-24 bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-background max-w-2xl mx-auto">
              We're committed to delivering the highest quality milk with
              unmatched convenience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6 h-full">
              <div className="p-6 rounded-2xl text-center space-y-4 bg-muted-foreground h-full">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Milk className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-xl">100% Pure</h3>
                <p className="text-background">
                  Directly from healthy, well-fed cows. No additives or
                  preservatives.
                </p>
              </div>

              <div className="p-6 rounded-2xl text-center space-y-4 bg-muted-foreground h-full">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-xl">Daily Delivery</h3>
                <p className="text-background">
                  Fresh milk delivered to your doorstep every morning before 7
                  AM.
                </p>
              </div>
            </div>

            {/* CENTER IMAGE */}
            <div className="h-full">
              <img
                src="/home-image-1.jpg"
                alt="Cows in pasture"
                className="rounded-2xl w-full h-full object-cover"
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6 h-full">
              <div className="p-6 rounded-2xl text-center space-y-4 bg-muted-foreground h-full">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-xl">On Time</h3>
                <p className="text-background">
                  Reliable service with consistent delivery times you can count
                  on.
                </p>
              </div>

              <div className="p-6 rounded-2xl text-center space-y-4 bg-muted-foreground h-full">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-xl">Quality Tested</h3>
                <p className="text-background">
                  Every batch is tested for purity and quality standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Daily Delivery?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy families in Surat and Navsari enjoying
            fresh, pure milk every day
          </p>
          <Button size="lg" className="text-lg">
            <Link href="/products">View Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
