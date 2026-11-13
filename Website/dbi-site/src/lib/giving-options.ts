import type { GivingOption } from "@/components/GivingOptions";
import type { CampaignUrls } from "@/lib/donate-url";

export function buildGivingOptions({ eoyCampaignUrl, monthlyUrl }: CampaignUrls): GivingOption[] {
  return [
    {
      eyebrow: "Year-end campaign",
      title: "Help us raise $10,000 by year's end",
      description:
        "Give once to bring more DBI days to campus and carry that support into 2027.",
      ctaLabel: "Give to the year-end campaign",
      href: eoyCampaignUrl,
    },
    {
      eyebrow: "Monthly giving",
      title: "Support students all year",
      description:
        "Make it monthly to give students support they can count on all year long.",
      ctaLabel: "Become a monthly donor",
      href: monthlyUrl,
    },
  ];
}
