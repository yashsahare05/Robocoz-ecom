"use client";

import { useEffect, useState } from "react";

type Slide = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
};

const defaultSlides: Slide[] = [
  {
    eyebrow: "Projects",
    title: "From prototype to production-ready builds.",
    subtitle:
      "See how teams use Robocoz to ship reliable electronics faster.",
    imageSrc: "/images/hero/slideshow1/projects.jpg",
    imageAlt: "Assorted electronics projects on a workbench",
  },
  {
    eyebrow: "3D Printing",
    title: "Precision FDM & SLA parts in days.",
    subtitle: "Fast turnaround with inspection-ready finishes.",
    imageSrc: "/images/hero/slideshow1/3d-printing.jpg",
    imageAlt: "3D printing process in action",
  },
  {
    eyebrow: "PCB Manufacturing",
    title: "Custom PCB runs with tight tolerances.",
    subtitle: "Turnkey fabrication, assembly, and QA for critical projects.",
    imageSrc: "/images/hero/slideshow1/Custom-PCB.jpg",
    imageAlt: "Custom PCB assembly close-up",
  },
];

type HeroSlideshowProps = {
  slides?: Slide[];
};

export const HeroSlideshow = ({ slides = defaultSlides }: HeroSlideshowProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200  bg-gray-700  shadow-sm">
      <div className="relative min-h-[280px]">
        {slides.map((slide, index) => (
          <div
            key={slide.imageSrc ?? slide.title ?? `${index}`}
            className={`absolute inset-0 transition-none ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.imageSrc ? (
              <>
                <img
                  src={slide.imageSrc}
                  alt={slide.imageAlt ?? "Hero slide"}
                  className="absolute opacity-60 inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/15 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand/15 via-white to-white" />
            )}
            <div className="relative h-full p-8">
              {slide.eyebrow ? (
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                    slide.imageSrc ? "text-white/90" : "text-brand-dark/70"
                  }`}
                >
                  {slide.eyebrow}
                </p>
              ) : null}
              {slide.title ? (
                <h2
                  className={`mt-2 text-2xl font-heading font-semibold ${
                    slide.imageSrc ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {slide.title}
                </h2>
              ) : null}
              {slide.subtitle ? (
                <p
                  className={`mt-2 text-sm ${
                    slide.imageSrc ? "text-white/90" : "text-zinc-600"
                  }`}
                >
                  {slide.subtitle}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 left-8 flex items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={`${slide.imageSrc ?? slide.title ?? index}-dot`}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-8 rounded-full transition ${
              index === activeIndex ? "bg-brand" : "bg-zinc-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
