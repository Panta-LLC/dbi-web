"use client";

import { useState } from "react";

type WhatWeDoItem = {
  title: string;
  description: string;
};

type WhatWeDoTabsProps = {
  items: WhatWeDoItem[];
};

export function WhatWeDoTabs({ items }: WhatWeDoTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="grid gap-0 lg:grid-cols-10">
      <div className="relative z-12 mr-[-24] col-span-4
      ">
        <div className="space-y-1">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`${
                  isActive ? "bevel-tl-br w-full" : "bevel-tl w-[calc(100%_-_40px)]"
                } px-8 py-4 text-left text-sm transition-all duration-400 ease-in-out ${
                  isActive
                    ? "relative z-20 bg-primary text-white shadow-sm lg:-mr-12 lg:translate-x-2"
                    : "relative z-0 bg-secondary text-white lg:translate-x-4"
                }`}
              >
                <p className="font-semibold">{item.title}</p>
                <div
                  className={`overflow-hidden transition-all duration-400 ease-in-out ${
                    isActive ? "max-h-16 opacity-90" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="mt-1 text-xs">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative z-10 flex min-h-[260px] items-center justify-center bg-slate-200 px-6 py-10 text-sm font-semibold text-slate-500 col-span-6 bevel-tl-br-lg">
        Program photo placeholder
      </div>
    </div>
  );
}
