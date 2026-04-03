import { Container } from "./Container";

type PageIntroProps = {
  /** Admin / document title (primary H1). */
  title: string;
  /** Lead line or hero subtitle below the title. */
  lead: string;
  description?: string;
  align?: "center" | "left";
};

export function PageIntro({ title, lead, description, align = "center" }: PageIntroProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <Container maxWidth="narrow" className={`py-12 sm:py-16 ${alignment}`}>
      <h1 className="display-m mt-4">{title}</h1>
      {lead.trim() ? <p className="body-md mt-3 text-slate-800">{lead}</p> : null}
      {description ? <p className="body-md mt-4 text-slate-600">{description}</p> : null}
    </Container>
  );
}
