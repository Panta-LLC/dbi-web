import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export type GiftImpactItem = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

type GiftImpactListProps = {
  title?: string;
  intro?: string;
  items: GiftImpactItem[];
};

export function GiftImpactList({
  title = "Where your gift goes",
  intro,
  items,
}: GiftImpactListProps) {
  return (
    <Section noPadding>
      <Container className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="heading-1 text-[var(--color-4)]">{title}</h2>
          {intro ? <p className="body-md mt-4 text-slate-700">{intro}</p> : null}
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map(({ title: itemTitle, description, icon: Icon }) => (
            <li key={itemTitle} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              {Icon ? (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-6)] text-[var(--color-2)]">
                  <Icon aria-hidden className="h-6 w-6" />
                </span>
              ) : null}
              <h3 className={`heading-3 text-[var(--color-4)] ${Icon ? "mt-4" : ""}`}>
                {itemTitle}
              </h3>
              <p className="body-md mt-3 text-slate-700">{description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
