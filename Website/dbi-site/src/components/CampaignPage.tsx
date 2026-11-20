import { GraduationCap, School, Users } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
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
    icon: GraduationCap,
    title: "Awards ceremony",
    description:
      "An org-wide celebration of the growth and achievements of students from all three of our schools.",
  },
  {
    icon: Users,
    title: "Field trips",
    description:
      "More trips that take students beyond the classroom and show them what's possible for college, career, and the future.",
  },
  {
    icon: School,
    title: "In-school programs & events",
    description:
      "More programming and events on campus, like Black History Month, that connect students to their history and their community.",
  },
];

type CampaignPageProps = CampaignUrls & {
  /** Campaign progress tracker, shown under the hero. */
  tracker?: ReactNode;
};

/**
 * "Ready for What's Next" campaign: an entry point to the Network for Good campaign pages.
 * /donate uses this until the Sanity `/donate` page has a published Giving Options block.
 */
export function CampaignPage({ eoyCampaignUrl, monthlyUrl, tracker }: CampaignPageProps) {
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

      {tracker}

      <CampaignStat {...campaignStatProps} />

      <CampaignGiveSection
        title="Your gift helps our programs grow"
        paragraphs={[
          "This year-end, we're raising $10,000 to grow our programs: an org-wide awards ceremony that celebrates our students, more field trips beyond the classroom, and more in-school programming and events like Black History Month.",
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
