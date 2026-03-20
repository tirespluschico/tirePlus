"use client";

import { useEffect, useState } from "react";

const reviews = [
  {
    author: "Danyelle Fargo",
    meta: "5 reviews • 3 months ago",
    services: "Tires, General repairs & maintenance",
    body:
      "Pulled in to get some air in my tires and the guys there were sweet and helpful and went way beyond just filling them. They patched leaking tires, rotated them, found a used tire for the bad one, and even tore off a dragging dust cover. I only stopped in because it was around the corner from work, and now I do not want to go anywhere else for tire-related needs.",
  },
  {
    author: "Victor Quintero",
    meta: "2 reviews • 1 photo • 3 years ago",
    services: "Painting, Tires, Wheel alignment",
    body:
      "JR and his team took great care of the alignment, wheels, and tires on my lifted truck. They moved quickly, got the exact tires I wanted, and showed me custom powder-coated wheels that finished the truck perfectly. The quality of the powder coat and color stood out.",
  },
  {
    author: "Rebecca Riordan",
    meta: "Local Guide • 12 reviews • 1 year ago",
    services: "Tires",
    body:
      "They greeted me immediately, had space in the garage right away, and got me set up with four new AWD tires for about half of another shop's quote. All four were in stock and installed in less than an hour. The staff felt welcoming, genuine, and never pushy.",
  },
  {
    author: "Stephen Metzger",
    meta: "2 reviews • 6 months ago",
    services: "Tires",
    body:
      "I had been coming to this shop for years and thought the new team would have huge shoes to fill. Kahlid, Junior, and crew did that and more. Personable, friendly, fair, prompt, and rooted in the community. I cannot recommend them highly enough.",
  },
  {
    author: "Nate Steffen",
    meta: "4 reviews • 1 year ago",
    services: "Clutch repair, Suspension work",
    body:
      "This is the only place I will take my car. Roy is worth his weight in gold, professional and honest every time. They replaced the clutch on my Subaru Outback and handled suspension work recently too. I cannot say enough good things about Roy and this shop.",
  },
  {
    author: "Randy Rick",
    meta: "3 reviews • 2 years ago",
    services: "Lift kits, Wheels, Tires",
    body:
      "I went to Tires Plus on a trusted recommendation and had my Jeep Wrangler Unlimited lifted with five new rims and tires. From consultation to installation, the experience was transparent, honest, and well executed. The owner and staff clearly care about matching customers with the right setup.",
  },
];

export default function ReviewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const activeReview = reviews[activeIndex];

  return (
    <section className="relative h-full overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(18,23,34,1)_0%,rgba(47,63,90,0.98)_52%,rgba(85,111,154,0.92)_100%)] shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(207,35,39,0.28),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />

      <div className="relative flex h-full flex-col gap-8 p-6 sm:p-8">
        <div className="max-w-md">
          <span className="text-brand-red text-xs font-bold uppercase tracking-[0.35em]">
            Customer Reviews
          </span>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Real feedback from local customers.
          </h2>
          <p className="mt-4 text-base leading-7 text-brand-muted">
            Real feedback from customers who came in for flats, full tire sets,
            lifted trucks, and major repair work.
          </p>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current - 1 + reviews.length) % reviews.length)
              }
              className="rounded-full border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/16"
              aria-label="Show previous review"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % reviews.length)}
              className="rounded-full bg-brand-red px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-red-hover"
              aria-label="Show next review"
            >
              Next
            </button>
          </div>
        </div>

        <div className="w-full flex-1 rounded-[1.75rem] border border-white/12 bg-white/9 p-1 backdrop-blur-sm">
          <div className="rounded-[1.75rem] border border-white/8 bg-black/16 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-black text-white">{activeReview.author}</p>
                <p className="mt-1 text-sm text-brand-muted">{activeReview.meta}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
                  Google
                </p>
                <p className="mt-1 text-base tracking-[0.25em] text-[#ffd166]">★★★★★</p>
              </div>
            </div>

            <p className="mt-8 text-lg leading-8 text-white/92 sm:text-[1.35rem] sm:leading-9">
              “{activeReview.body}”
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-brand-red/35 bg-brand-red/14 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red-soft">
                {activeReview.services}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {reviews.map((review, index) => (
                <button
                  key={review.author}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-10 bg-brand-red"
                      : "w-2.5 bg-white/35 hover:bg-white/55"
                  }`}
                  aria-label={`Show review from ${review.author}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
