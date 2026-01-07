import React from 'react'

const marqueeItems = [
  { id: 1, text: "Fresh Organic Milk" },
  { id: 2, text: "Pasture Raised Cows" },
  { id: 3, text: "Sustainable Farming" },
  { id: 4, text: "Ethical Dairy Practices" },
  { id: 5, text: "Farm to Table Quality" },
];

const MarqueeSection = () => {
  return (
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
)}

export default MarqueeSection