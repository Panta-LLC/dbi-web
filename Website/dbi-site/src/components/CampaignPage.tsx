import { Backpack, School, Users } from "lucide-react";
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
    icon: Backpack,
    title: "$50–75",
    description: "Gives one student the supplies and curriculum materials they need for the year.",
  },
  {
    icon: School,
    title: "$500–750",
    description: "Funds a full day of DBI programming on a school campus.",
  },
  {
    icon: Users,
    title: "$10,000",
    description: "Could bring up to 20 more mentoring days to our schools.",
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
        description="Delta Bay Impact mentors students at Wren Elementary, Riverview Middle School, and Liberty High School, helping them build the confidence and skills they need for college, career, and the future."
        ctas={[{ href: "#give", label: "Choose how to give" }]}
      />

      <CampaignStat {...campaignStatProps} />

      <CampaignGiveSection
        title="Your gift keeps DBI on campus"
        paragraphs={[
          "This year-end, we're raising $10,000 to bring more DBI days to campus and grow our school supply giveaway, so every student we serve has a mentor in their corner and the tools to succeed.",
          "Your gift today carries that support into 2027. Give once, or make it monthly to help students all year long.",
        ]}
        options={buildGivingOptions({ eoyCampaignUrl, monthlyUrl })}
      />

      <div id="where-it-goes" className="bg-[var(--color-3)]">
        <GiftImpactList
          title="Here's what your gift makes possible"
          items={giftImpactItems}
        />
      </div>

      <CampaignCtaBand
        title="When students have support, the numbers move."
        body="Every student we serve deserves a mentor in their corner. Make your gift monthly to help students all year long."
        ctaLabel="Become a monthly donor"
        ctaHref={monthlyUrl}
      />
    </>
  );
}
