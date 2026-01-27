import { Container } from "./Container";

type ContactBandProps = {
  title?: string;
};

export function ContactBand({ title = "Contact" }: ContactBandProps) {
  return (
    <div className="border-y border-border bg-white">
      <Container className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading-2 tracking-[0.2em] text-slate-700 uppercase">
            {title}
          </h2>
        </div>
      </Container>
    </div>
  );
}
