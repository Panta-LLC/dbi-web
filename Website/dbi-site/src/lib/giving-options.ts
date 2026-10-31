import type { GivingOption } from "@/components/GivingOptions";
import type { CampaignUrls } from "@/lib/donate-url";

export function buildGivingOptions({ eoyCampaignUrl, monthlyUrl }: CampaignUrls): GivingOption[] {
  return [
    {
      eyebrow: "Year-end campaign",
      title: "Help us raise $20,000 by year's end",
      description:
        "Your gift goes to work right away, so students start the new year with more support on campus.",
      ctaLabel: "Give to the year-end campaign",
      href: eoyCampaignUrl,
    },
    {
      eyebrow: "Monthly giving",
      title: "Support students all year",
      description:
        "Monthly gifts give students support they can count on and help DBI plan ahead for more schools.",
      ctaLabel: "Become a monthly donor",
      href: monthlyUrl,
    },
  ];
}
