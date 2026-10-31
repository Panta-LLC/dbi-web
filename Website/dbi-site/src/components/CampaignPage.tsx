import { Backpack, BookOpen, School } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/Button";
import { CampaignStat } from "@/components/CampaignStat";
import { Container } from "@/components/Container";
import { GiftImpactList } from "@/components/GiftImpactList";
import { GivingOptions } from "@/components/GivingOptions";
import { HeroSplitStatic } from "@/components/HeroSplitStatic";
import { Section } from "@/components/Section";
import type { CampaignUrls } from "@/lib/donate-url";
import { buildGivingOptions } from "@/lib/giving-options";

const HERO_IMAGE_SRC =
  "https://cdn.sanity.io/images/39057kga/production/a19c66803e9f97f375d69f31bb4d2d0715376c38-5712x4284.jpg";

/**
 * The stat's math: 241 of 730 Black graduates (33%) across Mt. Diablo, Antioch, Pittsburg and
 * Liberty Union were rated "Prepared" on the 2026 Dashboard College/Career Indicator.
 */
export const campaignStatProps: ComponentProps<typeof CampaignStat> = {
  stat: "2 in 3",
  statement: "Black graduates in our communities finish high school unprepared for their next step.",
  body: "They earned the diploma. What's often missing is someone in their corner, helping them see the path and take it. That's what DBI mentors do.",
  source: "California School Dashboard, 2025–26 College/Career Indicator",
  sourceHref: "https://www.caschooldashboard.org/",
};

const giftImpactItems: ComponentProps<typeof GiftImpactList>["items"] = [
  {
    icon: School,
    title: "More DBI days on campus",
    description:
      "More time with mentors who help students set goals, stay on track, and map a path to college or career.",
  },
  {
    icon: Backpack,
    title: "School supply drive",
    description:
      "Students start the year with the backpacks and supplies they need to show up ready to learn.",
  },
  {
    icon: BookOpen,
    title: "Summer reading",
    description:
      "Books and reading support that keep skills sharp over the summer, so students start each year strong.",
  },
];

/** "Ready for What's Next" campaign: an entry point to the Network for Good campaign pages. */
export function CampaignPage({ eoyCampaignUrl, monthlyUrl }: CampaignUrls) {
  return (
    <>
      {/* `cta-primary` is the same blue as this palette, so restyle it to match `cta-knockout`. */}
      <div className="[&_.slanted-button--cta-primary]:text-black [&_.slanted-button--cta-primary]:before:bg-white">
        <HeroSplitStatic
          backgroundPalette="color-1"
          imagePosition="right"
          imageSrc={HERO_IMAGE_SRC}
          imageAlt="DBI mentor with three graduating students in blue gowns"
          title="Ready for what's next."
          description="Help us empower African American students in Contra Costa County through culture, connection, and community."
          ctas={[{ href: "#give", label: "Choose how to give" }]}
        />
      </div>

      <CampaignStat {...campaignStatProps} />

      <Section id="give" className="scroll-mt-20 bg-white" noPadding>
        <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <h2 className="heading-1 text-[var(--color-4)]">Your gift keeps DBI on campus</h2>
            <p className="body-md mt-6 text-slate-700">
              Your contribution will help us spend more days on campus with students, and grow our
              school supply drive and summer reading program, so every student starts the year
              ready to learn and finishes high school prepared for what&apos;s next.
            </p>
            <p className="body-md mt-4 text-slate-700">
              Today DBI mentors students at Wren Avenue Elementary, Riverview Middle, and Liberty
              High. Monthly donors help us plan ahead and reach more schools across Antioch,
              Pittsburg, and Mt. Diablo.
            </p>
          </div>
          <GivingOptions options={buildGivingOptions({ eoyCampaignUrl, monthlyUrl })} />
        </Container>
      </Section>

      <div id="where-it-goes" className="bg-[var(--color-3)]">
        <GiftImpactList
          intro="Every dollar to this campaign supports three things students tell us matter."
          items={giftImpactItems}
        />
      </div>

      <Section className="bg-[var(--color-1)]" noPadding>
        <Container maxWidth="narrow" className="py-16 text-center md:py-20">
          <h2 className="heading-1 text-white">When students have support, the numbers move.</h2>
          <p className="body-md mt-4 text-white">
            At Liberty High in Brentwood, college and career readiness for Black students rose 13
            points in a single year. Help us bring that kind of progress to more schools.
          </p>
          <Button href={monthlyUrl} variant="cta-knockout" className="mt-8">
            Become a monthly donor
          </Button>
        </Container>
      </Section>
    </>
  );
}
