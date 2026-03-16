import Image from "next/image";
import { Section } from "./Section";

type MissionBannerProps = {
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export function MissionBanner({
  title = "EDUCATE.\nADVOCATE.\nELEVATE.",
  imageSrc = "/images/mission-banner.jpg",
  imageAlt = "Community gathering",
  className = "",
}: MissionBannerProps) {
  return (
    <Section
      className={`relative flex items-center justify-center  w-full overflow-hidden bg-white ${className} min-h-[400px] md:min-h-[500px] lg:min-h-[600px]`}
    >
      <div className="grid lg:grid-cols-2 min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
        {/* Left section - Blue diagonal with mission statement */}
        <div className="relative flex items-center justify-center px-8 py-16 md:px-12 md:py-20 lg:py-24 overflow-hidden">
          {/* White background layer */}
          <div className="absolute inset-0 bg-white" />

          {/* Blue diagonal section */}
          <div
            className="absolute inset-0 bg-[#1e4d8b]"
            style={{
              clipPath: "polygon(0 0, 75% 0, 90% 100%, 0 100%)",
              WebkitClipPath: "polygon(0 0, 75% 0, 90% 100%, 0 100%)",
            }}
          />

          {/* Mission text */}
          <div className="relative z-10 text-white pl-4 md:pl-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.2] whitespace-pre-line">
              {title}
            </h2>
          </div>
        </div>

        {/* Right section - Image with decorative elements */}
        <div className="relative bg-slate-800 min-h-[300px] lg:min-h-full overflow-hidden">
          {/* Main image */}
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}

          {/* Decorative colored dots - Top Right Yellow */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 lg:top-6 lg:right-6 z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-yellow-400 rounded-full" />
          </div>

          {/* Decorative colored dots - Bottom Right */}
          <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6 z-10 flex items-end gap-2">
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-red-500 rounded-full" />
            <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>
    </Section>
  );
}
