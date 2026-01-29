import Image from "next/image";

type LogoItem =
  | string
  | {
      name?: string;
      logoSrc?: string;
      logoAlt?: string;
    };

type LogoGridProps = {
  items: LogoItem[];
};

const getItemName = (item: LogoItem | null | undefined) => {
  if (!item) {
    return "Partner";
  }

  return typeof item === "string" ? item : item.name || "Partner";
};

const getLogoSrc = (item: LogoItem | null | undefined) =>
  !item || typeof item === "string" ? undefined : item.logoSrc;

const getLogoAlt = (item: LogoItem | null | undefined) =>
  !item
    ? "Partner logo"
    : typeof item === "string"
      ? item
      : item.logoAlt || item.name || "Partner logo";

export function LogoGrid({ items }: LogoGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item, index) => {
        const name = getItemName(item);
        const logoSrc = getLogoSrc(item);
        const logoAlt = getLogoAlt(item);

        return (
          <div
            key={`${name}-${index}`}
            className="slang-clip-tight flex h-30 items-center justify-center  bg-white p-6 text-xs font-semibold text-slate-500"
          >
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={140}
                height={56}
                className="h-full w-auto object-contain"
              />
            ) : (
              name
            )}
          </div>
        );
      })}
    </div>
  );
}
