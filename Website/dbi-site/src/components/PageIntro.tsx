import { Container } from "./Container";

type PageIntroProps = {
  title: string;
  lead: string;
  description?: string;
  align?: "center" | "left";
};

export function PageIntro({ title, lead, description, align = "center" }: PageIntroProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <>
      <Container className="py-12 sm:py-16">
        <div className={`max-w-3xl ${alignment}`}>
          <h1 className="display-m mt-4">{lead}</h1>
          {description ? <p className="body-md mt-4 text-slate-600">{description}</p> : null}
        </div>
      </Container>
    </>
  );
}
