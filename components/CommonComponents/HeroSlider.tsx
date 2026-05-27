"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  src: string;
  alt: string;
};

type HeroSliderProps = {
  slides?: Slide[];
  intervalMs?: number;
  className?: string;
};

const DEFAULT_SLIDES: Slide[] = [
  { src: "/hero-image.jpg", alt: "Fresh Milk" },
  { src: "/home-image-1.jpg", alt: "Cows in pasture" },
];

export default function HeroSlider({
  slides,
  intervalMs = 5000,
  className,
}: HeroSliderProps) {
  const resolvedSlides = useMemo(
    () => (slides && slides.length > 0 ? slides : DEFAULT_SLIDES),
    [slides],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const goTo = (nextIndex: number) => {
    const safeIndex =
      ((nextIndex % resolvedSlides.length) + resolvedSlides.length) %
      resolvedSlides.length;
    setActiveIndex(safeIndex);
  };

  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  useEffect(() => {
    if (resolvedSlides.length <= 1) return;
    if (isPaused) return;

    intervalRef.current = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % resolvedSlides.length);
    }, intervalMs);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [intervalMs, isPaused, resolvedSlides.length]);

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl",
        "w-full h-[600px] md:h-[70vh]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {resolvedSlides.map((slide, index) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={[
            "absolute inset-0 h-full w-full object-cover",
            "transition-opacity duration-500",
            index === activeIndex ? "opacity-100" : "opacity-0",
          ].join(" ")}
          draggable={false}
        />
      ))}

      {resolvedSlides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur">
            {resolvedSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={[
                  "h-2.5 w-2.5 rounded-full transition",
                  index === activeIndex ? "bg-white" : "bg-white/50 hover:bg-white/80",
                ].join(" ")}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
