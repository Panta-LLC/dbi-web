import { Backpack, BookOpen, School } from "lucide-react";
import type { ComponentProps } from "react";
import { CampaignCtaBand } from "@/components/CampaignCtaBand";
import { CampaignGiveSection } from "@/components/CampaignGiveSection";
import { CampaignStat } from "@/components/CampaignStat";
import { GiftImpactList } from "@/components/GiftImpactList";
import { HeroSplitStatic } from "@/components/HeroSplitStatic";
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

/**
 * "Ready for What's Next" campaign: an entry point to the Network for Good campaign pages.
 * /donate uses this until the Sanity `/donate` page has a published Giving Options block.
 */
export function CampaignPage({ eoyCampaignUrl, monthlyUrl }: CampaignUrls) {
  return (
    <>
      <HeroSplitStatic
        backgroundPalette="color-1"
        imagePosition="right"
        imageSrc={HERO_IMAGE_SRC}
        imageAlt="DBI mentor with three graduating students in blue gowns"
        title="Ready for what's next."
        description="Help us empower African American students in Contra Costa County through culture, connection, and community."
        ctas={[{ href: "#give", label: "Choose how to give" }]}
      />

      <CampaignStat {...campaignStatProps} />

      <CampaignGiveSection
        title="Your gift keeps DBI on campus"
        paragraphs={[
          "Your contribution will help us spend more days on campus with students, and grow our school supply drive and summer reading program, so every student starts the year ready to learn and finishes high school prepared for what's next.",
          "Today DBI mentors students at Wren Avenue Elementary, Riverview Middle, and Liberty High. Monthly donors help us plan ahead and reach more schools across Antioch, Pittsburg, and Mt. Diablo.",
        ]}
        options={buildGivingOptions({ eoyCampaignUrl, monthlyUrl })}
      />

      <div id="where-it-goes" className="bg-[var(--color-3)]">
        <GiftImpactList
          intro="Every dollar to this campaign supports three things students tell us matter."
          items={giftImpactItems}
        />
      </div>

      <CampaignCtaBand
        title="When students have support, the numbers move."
        body="At Liberty High in Brentwood, college and career readiness for Black students rose 13 points in a single year. Help us bring that kind of progress to more schools."
        ctaLabel="Become a monthly donor"
        ctaHref={monthlyUrl}
      />
    </>
  );
}
