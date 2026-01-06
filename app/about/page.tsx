import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Leaf, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-foreground py-16 md:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About FreshMilk</h1>
            <p className="text-lg">
              We're committed to delivering the purest, freshest milk from our farms to your doorstep, ensuring quality
              and trust in every drop.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
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
                FreshMilk started with a simple mission: to provide families in Surat and Navsari with access to pure,
                farm-fresh milk. We believe that quality milk is the foundation of a healthy lifestyle, and we're
                dedicated to maintaining the highest standards in dairy farming and delivery.
              </p>
              <p className="leading-relaxed">
                Our cows are well-fed, healthy, and live in hygienic conditions. We use modern farming techniques
                combined with traditional care to ensure that every drop of milk meets our strict quality standards.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-xl">100% Natural</h3>
                <p className="text-muted-foreground text-sm">
                  No additives, preservatives, or artificial substances. Just pure milk.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-xl">Quality Certified</h3>
                <p className="text-muted-foreground text-sm">
                  Every batch is tested and certified for purity and nutrition.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-xl">Animal Welfare</h3>
                <p className="text-muted-foreground text-sm">
                  Our cows are treated with love and care in stress-free environments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-xl">Community First</h3>
                <p className="text-muted-foreground text-sm">
                  We support local farmers and contribute to our community's growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">Happy Families</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10000+</div>
              <div className="text-muted-foreground">Liters Delivered Daily</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2</div>
              <div className="text-muted-foreground">Cities Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
