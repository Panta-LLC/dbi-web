import { Container } from "./Container";

type PageHeaderProps = {
  title: string;
  subtitle: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-white">
      <Container className="py-12 text-center sm:py-14">
        <p className="heading-4 text-slate-500">
          {title}
        </p>
        <h1 className="display-l mt-4">
          {subtitle}
        </h1>
      </Container>
    </div>
  );
}
