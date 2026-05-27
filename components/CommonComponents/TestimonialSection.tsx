"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const testimonials = [
  {
    id: 1,
    name: "Kaustubh Karale",
    image: "/review1.png",
    review:
      "Since 2018, we have been having pure cow milk. The quality is amazing and my son loves it. The milk is thick, creamy and very nutritious.",
  },
  {
    id: 2,
    name: "Kalpesh Patil",
    image: "/review2.png",
    review:
      "We receive milk daily exactly on time. Service is very prompt and delivery is fast. We regularly order paneer and curd too.",
  },
  {
    id: 3,
    name: "Shamakant Nangre",
    image: "/review3.png",
    review:
      "We are regular customers. Product quality, freshness and packaging are excellent. Delivery is hygienic and convenient.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-14 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}

        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Customer Testimonials
          </h2>

          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy families in Navsari enjoying fresh, pure
            milk every day
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="
              bg-[#DCECF7]
              rounded-2xl
              border
              border-black/20
              p-6
              hover:-translate-y-2
              transition-all
              duration-300
              "
            >
              {/* Top */}
              <div className="flex items-center gap-5 mb-6">
                <div className="relative w-28 h-28 shrink-0">
                  <div className="absolute inset-0 rounded-full border-[5px] border-white overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <h3 className="text-primary text-2xl font-semibold leading-tight">
                  {item.name}
                </h3>
              </div>

              {/* Review */}
              <p className="text-foreground">{item.review}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 flex justify-center">
          <Button>
            <Link href="/reviews">View All</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
