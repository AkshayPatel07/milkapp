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

const missionList = [
  {
    id: 1,
    text: "Ensures the health and welfare of our animals.",
  },
  {
    id: 2,
    text: "Pure, wholesome dairy products you can trust.",
  },
  {
    id: 3,
    text: "Deliver fresh, high-quality dairy products by caring.",
  },
];

const marqueeItems = [
  { id: 1, text: "Fresh Organic Milk" },
  { id: 2, text: "Pasture Raised Cows" },
  { id: 3, text: "Sustainable Farming" },
  { id: 4, text: "Ethical Dairy Practices" },
  { id: 5, text: "Farm to Table Quality" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
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
              <div className="flex items-center gap-6 pt-4">
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

      <section className="bg-primary py-6 overflow-x-hidden">
        <div className="marquee__track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              className="flex items-center text-foreground text-2xl font-semibold whitespace-nowrap"
              key={`${item.id}-${index}`}
            >
              <img src="/icon-star.svg" className="mx-5" />
              {item.text}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT – Images */}
          <div className="relative">
            <img
              src="/about-us-image-1.jpg"
              alt="Cows in pasture"
              className="rounded-2xl w-96 object-cover"
            />

            <img
              src="/about-us-image-2.jpg"
              alt="Farmer feeding cows"
              className="rounded-2xl w-96 ml-auto -mt-52 shadow-xl border-4 border-background z-10 relative80"
            />
          </div>

          {/* RIGHT – Content */}
          <div>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-primary">
              ✦{" "}
              <span className="uppercase tracking-widest text-foreground">
                About Us
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Fresh milk straight from our pasture to your table
            </h2>

            {/* Description */}
            <p className="text-secondary mb-8">
              We’re more than just a farm — we’re your neighbors. We’re proud to
              be part of the local community, providing families with wholesome
              dairy that’s produced just down the road. Our cows are
              pasture-raised.
            </p>

            {/* Mission */}
            <h4 className="font-semibold mb-4 text-foreground">Our Mission:</h4>

            <ul className="space-y-3 mb-8">
              {missionList.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="bg-primary p-1 rounded-full mt-1">
                    <Check size={14} className="text-white" />
                  </span>
                  <span className="text-secondary">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Bottom Section */}
            <div className="flex flex-wrap items-center gap-6 mb-10">
              {/* Experience Card */}
              <div className="bg-foreground text-white rounded-2xl px-8 py-6 text-center min-w-[140px]">
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm opacity-80">Years Of Experience</div>
              </div>

              {/* Icon Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-3 rounded-full">
                    <Milk className="text-foreground" size={20} />
                  </div>
                  <span className="font-medium text-foreground">
                    Driven by Tradition, Guided by Innovation
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary p-3 rounded-full">
                    <Tractor className="text-foreground" size={20} />
                  </div>
                  <span className="font-medium text-foreground">
                    Committed to Sustainable & Ethical Farming
                  </span>
                </div>
              </div>
            </div>

            <Button size="lg" className="text-lg">
              <Link href="/about">Learn More About</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
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
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Daily Delivery?
          </h2>
          <p className="text-lg mb-8 text-green-50 max-w-2xl mx-auto">
            Join thousands of happy families in Surat and Navsari enjoying
            fresh, pure milk every day
          </p>
          <Button size="lg" variant="secondary" className="text-lg" asChild>
            <Link href="/products">View Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
