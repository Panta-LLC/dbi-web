type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? (
        <p className="heading-4 text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="heading-2 mt-3">{title}</h2>
      {description ? (
        <p className="body-lg mt-4 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
