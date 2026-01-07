import AboutSection from "@/components/CommonComponents/AboutSection";
import MarqueeSection from "@/components/CommonComponents/MarqueeSection";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, Leaf, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-foreground py-12 md:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About FreshMilk
            </h1>
            <p className="text-lg">
              We're committed to delivering the purest, freshest milk from our
              farms to your doorstep, ensuring quality and trust in every drop.
            </p>
          </div>
        </div>
      </section>

      <MarqueeSection />

      {/* Mission Section */}
      <section className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center mb-6 md:mb-16">
            <div>
              <img
                src="/about-1.jpg"
                alt="Our Farm"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
              <p className="leading-relaxed">
                FreshMilk started with a simple mission: to provide families in
                Surat and Navsari with access to pure, farm-fresh milk. We
                believe that quality milk is the foundation of a healthy
                lifestyle, and we're dedicated to maintaining the highest
                standards in dairy farming and delivery.
              </p>
              <p className="leading-relaxed">
                Our cows are well-fed, healthy, and live in hygienic conditions.
                We use modern farming techniques combined with traditional care
                to ensure that every drop of milk meets our strict quality
                standards.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4 md:p-6 text-center space-y-4 bg-white rounded-xl">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-xl">100% Natural</h3>
                <p className="text-sm">
                  No additives, preservatives, or artificial substances. Just
                  pure milk.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6 text-center space-y-4 bg-primary rounded-xl">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-xl">Quality Certified</h3>
                <p className="text-sm">
                  Every batch is tested and certified for purity and nutrition.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6 text-center space-y-4 bg-white rounded-xl">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-xl">Animal Welfare</h3>
                <p className="text-sm">
                  Our cows are treated with love and care in stress-free
                  environments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6 text-center space-y-4 bg-primary rounded-xl">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-xl">Community First</h3>
                <p className="text-sm">
                  We support local farmers and contribute to our community's
                  growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-foreground py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
            <div className="h-full">
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-primary">
                ✦{" "}
                <span className="uppercase tracking-widest text-white">
                  FRESH COMMITMENT
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Spreading wellness with every drop of milk
              </h2>
              <div className="grid grid-cols-2 gap-5 text-center">
                <div className="p-4 md:p-6 rounded-2xl text-center space-y-4 bg-muted-foreground h-full">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    5000+
                  </div>
                  <div className="text-muted">Happy Families</div>
                </div>
                <div className="p-4 md:p-6 rounded-2xl text-center space-y-4 bg-muted-foreground h-full">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    10000+
                  </div>
                  <div className="text-muted">
                    Liters Delivered Daily
                  </div>
                </div>
                <div className="p-4 md:p-6 rounded-2xl text-center space-y-4 bg-muted-foreground h-full">
                  <div className="text-3xl md:text-4xl font-bold text-primary">2</div>
                  <div className="text-muted">Cities Served</div>
                </div>
                <div className="p-4 md:p-6 rounded-2xl text-center space-y-4 bg-muted-foreground h-full">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    100%
                  </div>
                  <div className="text-muted">
                    Customer Satisfaction
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full">
              <img src="about-2.jpg" className="rounded-2xl shadow-2xl h-full" />
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
    </div>
  );
}
