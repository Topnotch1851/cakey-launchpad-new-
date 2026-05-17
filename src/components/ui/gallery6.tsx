"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface GalleryItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

export interface Gallery6Props {
  id?: string;
  heading?: React.ReactNode;
  description?: string;
  eyebrow?: string;
  demoUrl?: string;
  demoLabel?: string;
  items?: GalleryItem[];
}

const DEFAULT_EYEBROW = "Capabilities";

const defaultItems: GalleryItem[] = [
  {
    id: "item-1",
    title: "Build Modern UIs",
    summary:
      "Create stunning user interfaces with our comprehensive design system.",
    url: "#",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "item-2",
    title: "Computer Vision Technology",
    summary:
      "Powerful image recognition and processing capabilities that allow AI systems to analyze, understand, and interpret visual information from the world.",
    url: "#",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "item-3",
    title: "Machine Learning Automation",
    summary:
      "Self-improving algorithms that learn from data patterns to automate complex tasks and make intelligent decisions with minimal human intervention.",
    url: "#",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "item-4",
    title: "Predictive Analytics",
    summary:
      "Advanced forecasting capabilities that analyze historical data to predict future trends and outcomes, helping businesses make data-driven decisions.",
    url: "#",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "item-5",
    title: "Neural Network Architecture",
    summary:
      "Sophisticated AI models inspired by human brain structure, capable of solving complex problems through deep learning and pattern recognition.",
    url: "#",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
  },
];

export function Gallery6({
  id,
  heading = "Gallery",
  description,
  eyebrow = DEFAULT_EYEBROW,
  demoUrl,
  demoLabel = "Book a demo",
  items = defaultItems,
}: Gallery6Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    carouselApi.on("reInit", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
      carouselApi.off("reInit", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section id={id} className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl text-left"
          >
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent backdrop-blur sm:w-auto sm:justify-start">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_oklch(0.82_0.11_82/0.5)]" />
              {eyebrow}
            </span>
            <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
              {heading}
            </h2>
            {description ? (
              <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </motion.div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous"
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next"
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": { dragFree: true },
            },
          }}
          className="relative"
        >
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem key={item.id} className="basis-[85%] pl-4 sm:basis-1/2 md:basis-full md:max-w-[452px]">
                <motion.a
                  href={item.url}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.45 }}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col"
                >
                  <div className="flex aspect-[3/2] overflow-hidden rounded-xl border border-border bg-card">
                    <div
                      className="h-full w-full origin-bottom bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${item.image})` }}
                      role="img"
                      aria-label={item.title}
                    />
                  </div>
                  <div className="mb-2 line-clamp-2 break-words pt-4 font-display text-lg font-medium md:mb-3 md:text-xl lg:text-2xl">
                    {item.title}
                  </div>
                  <div className="mb-6 line-clamp-3 text-sm text-muted-foreground md:mb-8 md:text-base">
                    {item.summary}
                  </div>
                  <div className="flex items-center text-sm text-accent">
                    Read more
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
