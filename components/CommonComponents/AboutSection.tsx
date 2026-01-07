import { Check, Milk, Tractor } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

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

const AboutSection = () => {
  return (
    <section className="bg-background py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-6 md:-16 items-center">
          {/* LEFT – Images */}
          <div className="relative">
            <img
              src="/about-us-image-1.jpg"
              alt="Cows in pasture"
              className="rounded-2xl w-40 md:w-96 object-cover"
            />

            <img
              src="/about-us-image-2.jpg"
              alt="Farmer feeding cows"
              className="rounded-2xl w-40 md:w-96 ml-auto -mt-28 md:-mt-52 shadow-xl border-4 border-background z-10 relative80"
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
  )
}

export default AboutSection