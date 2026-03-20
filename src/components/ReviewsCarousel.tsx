"use client";

import { useEffect, useState } from "react";

const reviews = [
  {
    author: "Danyelle Fargo",
    meta: "5 reviews • 3 months ago",
    services: "Tires, General repairs & maintenance",
    mobileBody:
      "Stopped in for air and the team went far beyond that. They patched leaks, rotated the tires, and found a replacement.",
    body:
      "I stopped in for air and the team went far beyond that. They patched leaking tires, rotated them, found a used replacement, and even fixed a dragging dust cover. I will not be going anywhere else for tire work.",
  },
  {
    author: "Victor Quintero",
    meta: "2 reviews • 1 photo • 3 years ago",
    services: "Painting, Tires, Wheel alignment",
    mobileBody:
      "JR and his team handled my lifted truck exactly right. Fast work, right tires, and great custom powder-coated wheels.",
    body:
      "JR and his team handled the alignment, wheels, and tires on my lifted truck exactly right. They moved quickly, got the tires I wanted, and the custom powder-coated wheels finished the truck perfectly.",
  },
  {
    author: "Rebecca Riordan",
    meta: "Local Guide • 12 reviews • 1 year ago",
    services: "Tires",
    mobileBody:
      "They had all four AWD tires in stock, finished fast, and came in at about half of another shop's quote.",
    body:
      "They greeted me immediately, had all four AWD tires in stock, and finished in less than an hour. The price came in at about half of another shop's quote, and the staff felt welcoming and genuine the whole time.",
  },
  {
    author: "Stephen Metzger",
    meta: "2 reviews • 6 months ago",
    services: "Tires",
    mobileBody:
      "Kahlid, Junior, and crew are friendly, fair, prompt, and rooted in the community.",
    body:
      "Kahlid, Junior, and crew had huge shoes to fill and they did that and more. Personable, friendly, fair, prompt, and deeply rooted in the community. I cannot recommend them highly enough.",
  },
  {
    author: "Nate Steffen",
    meta: "4 reviews • 1 year ago",
    services: "Clutch repair, Suspension work",
    mobileBody:
      "This is the only place I take my car. Roy is professional, honest, and consistently reliable.",
    body:
      "This is the only place I will take my car. Roy is professional and honest every time. They replaced the clutch on my Subaru Outback and handled suspension work recently too.",
  },
  {
    author: "Randy Rick",
    meta: "3 reviews • 2 years ago",
    services: "Lift kits, Wheels, Tires",
    mobileBody:
      "My Jeep lift, wheels, and tires were handled with an honest, transparent process from start to finish.",
    body:
      "I had my Jeep Wrangler Unlimited lifted with five new rims and tires. From consultation to installation, the experience was transparent, honest, and well executed. The team clearly cares about matching customers with the right setup.",
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
    <section className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(18,23,34,1)_0%,rgba(47,63,90,0.98)_52%,rgba(85,111,154,0.92)_100%)] shadow-2xl lg:h-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(207,35,39,0.28),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />

      <div className="relative flex flex-col gap-4 p-4 sm:p-7 lg:h-full lg:gap-5">
        <div className="max-w-lg">
          <span className="text-brand-red text-xs font-bold uppercase tracking-[0.35em]">
            Customer Reviews
          </span>
          <h2 className="mt-2 text-[1.45rem] font-black leading-tight text-white sm:text-4xl">
            Real feedback from local customers.
          </h2>
          <p className="mt-3 hidden text-sm leading-6 text-brand-muted sm:block sm:text-base sm:leading-7 lg:max-w-xl">
            Real feedback from customers who came in for flats, full tire sets,
            lifted trucks, and major repair work.
          </p>

          <div className="mt-3 flex gap-2 sm:mt-6 sm:gap-3">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current - 1 + reviews.length) % reviews.length)
              }
              className="rounded-full border border-white/20 bg-white/8 px-3.5 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/16 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.2em]"
              aria-label="Show previous review"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % reviews.length)}
              className="rounded-full bg-brand-red px-3.5 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-red-hover sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.2em]"
              aria-label="Show next review"
            >
              Next
            </button>
          </div>
        </div>

        <div className="w-full rounded-[1.75rem] border border-white/12 bg-white/9 p-1 backdrop-blur-sm lg:flex-1">
          <div className="flex flex-col rounded-[1.75rem] border border-white/8 bg-black/16 p-4 sm:p-7 lg:h-full">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-black text-white sm:text-xl">{activeReview.author}</p>
                <p className="mt-1 text-xs text-brand-muted sm:text-sm">{activeReview.meta}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red sm:text-sm">
                  Google
                </p>
                <p className="mt-1 text-sm tracking-[0.22em] text-[#ffd166] sm:text-base sm:tracking-[0.25em]">★★★★★</p>
              </div>
            </div>

            <p className="mt-3 text-[0.93rem] leading-5.5 text-white/92 sm:mt-6 sm:text-[1.08rem] sm:leading-7 lg:text-[1.02rem]">
              <span className="sm:hidden">“{activeReview.mobileBody}”</span>
              <span className="hidden sm:inline">“{activeReview.body}”</span>
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-6">
              <span className="rounded-full border border-brand-red/35 bg-brand-red/14 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-brand-red-soft sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
                {activeReview.services}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:mt-auto sm:pt-6">
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
