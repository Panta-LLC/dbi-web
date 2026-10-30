/**
 * "Ready for What's Next" fundraising campaign page. Storybook only for now.
 *
 * - `NFG_DONATE_URL` is a placeholder until DBI's Network for Good campaign page exists.
 * - Tier impact lines are placeholders until DBI confirms real costs.
 * - The stat's math: 241 of 730 Black graduates (33%) across Mt. Diablo, Antioch, Pittsburg and
 *   Liberty Union were rated "Prepared" on the 2026 Dashboard College/Career Indicator.
 */
import { Backpack, BookOpen, School } from "lucide-react";
import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/Button";
import { CampaignStat } from "@/components/CampaignStat";
import { Container } from "@/components/Container";
import { GiftImpactList } from "@/components/GiftImpactList";
import { GivingForm } from "@/components/GivingForm";
import { HeroSplitStatic } from "@/components/HeroSplitStatic";
import { NavBar } from "@/components/NavBar";
import { Section } from "@/components/Section";

const NFG_DONATE_URL = "https://www.networkforgood.com/"; // TODO: DBI campaign donation page

const statProps: ComponentProps<typeof CampaignStat> = {
  stat: "2 in 3",
  statement: "Black graduates in our communities finish high school unprepared for their next step.",
  body: "They earned the diploma. What's often missing is someone in their corner, helping them see the path and take it. That's what DBI mentors do.",
  source: "California School Dashboard, 2025–26 College/Career Indicator",
  sourceHref: "https://www.caschooldashboard.org/",
};

const givingFormProps: ComponentProps<typeof GivingForm> = {
  title: "Help students get ready for what's next",
  description:
    "Monthly gifts give DBI steady support all year. One-time gifts go to work right away.",
  donateUrl: NFG_DONATE_URL,
  monthlyTiers: [
    { amount: 10, impact: "Helps keep students reading all summer long." },
    { amount: 25, impact: "Helps stock backpacks for our school supply drive." },
    { amount: 50, impact: "Helps put DBI mentors on campus more often." },
    { amount: 100, impact: "Helps bring more DBI days on campus, all year round." },
  ],
  oneTimeTiers: [
    { amount: 50, impact: "Helps students start the year with the supplies they need." },
    { amount: 100, impact: "Helps grow our summer reading program." },
    { amount: 250, impact: "Helps fund an additional DBI day on campus." },
    { amount: 500, impact: "Helps bring DBI's support to more students and schools." },
  ],
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

const meta: Meta = {
  title: "Pages/Campaign: Ready for What's Next",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const FullPage: Story = {
  render: () => (
    <>
      <NavBar donateHref="#give" />
      <main className="pt-[68px] md:pt-[80px]">
        {/* `cta-primary` is the same blue as this palette, so restyle it to match `cta-knockout`. */}
        <div className="[&_.slanted-button--cta-primary]:text-black [&_.slanted-button--cta-primary]:before:bg-white">
          <HeroSplitStatic
            backgroundPalette="color-1"
            imagePosition="right"
            imageSrc="https://picsum.photos/seed/dbi-campaign/800/900"
            imageAlt="DBI mentor working with students on campus"
            title="Ready for what's next."
            description="Help us empower African American students in Contra Costa County through culture, connection, and community."
            ctas={[{ href: "#give", label: "Give monthly" }]}
          />
        </div>

        <CampaignStat {...statProps} />

        <Section id="give" className="scroll-mt-20 bg-white" noPadding>
          <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <h2 className="heading-1 text-[var(--color-4)]">Your gift keeps DBI on campus</h2>
              <p className="body-md mt-6 text-slate-700">
                Your contribution will help us spend more days on campus with students, and grow
                our school supply drive and summer reading program, so every student starts the
                year ready to learn and finishes high school prepared for what&apos;s next.
              </p>
              <p className="body-md mt-4 text-slate-700">
                Today DBI mentors students at Wren Avenue Elementary, Riverview Middle, and Liberty
                High. Monthly donors help us plan ahead and reach more schools across Antioch,
                Pittsburg, and Mt. Diablo.
              </p>
            </div>
            <GivingForm {...givingFormProps} />
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
            <Button href="#give" variant="cta-knockout" className="mt-8">
              Become a monthly donor
            </Button>
          </Container>
        </Section>
      </main>
    </>
  ),
};

export const GivingFormMonthly: Story = {
  render: () => (
    <div className="mx-auto max-w-xl p-6">
      <GivingForm {...givingFormProps} />
    </div>
  ),
};

export const GivingFormOneTime: Story = {
  render: () => (
    <div className="mx-auto max-w-xl p-6">
      <GivingForm {...givingFormProps} defaultFrequency="one-time" />
    </div>
  ),
};

export const ProofStat: Story = {
  render: () => <CampaignStat {...statProps} />,
};
