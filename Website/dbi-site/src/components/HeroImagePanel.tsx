import Image from "next/image";

type HeroImagePanelProps = {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export function HeroImagePanel({
  imageSrc,
  imageAlt = "Delta Bay Impact hero",
  className = "",
}: HeroImagePanelProps) {
  if (!imageSrc) return null;

  return (
    <div
      className={`relative bg-slate-800 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] w-full overflow-hidden ${className}`}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />

      <div className="absolute top-2 right-2 md:top-4 md:right-4 lg:top-6 lg:right-6 z-10">
        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-yellow-400 rounded-full" />
      </div>

      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6 z-10 flex items-end gap-2">
        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-red-500 rounded-full" />
        <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-green-500 rounded-full" />
      </div>
    </div>
  );
}

