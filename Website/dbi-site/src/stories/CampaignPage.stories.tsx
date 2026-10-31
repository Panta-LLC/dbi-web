/**
 * "Ready for What's Next" fundraising campaign page, published at /donate.
 *
 * The page is an entry point: donors choose an amount and complete their gift on Network for Good.
 * The Network for Good URLs below are placeholders for Storybook; /donate reads them from
 * NEXT_PUBLIC_NFG_EOY_CAMPAIGN_URL and NEXT_PUBLIC_NFG_MONTHLY_URL.
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CampaignPage, campaignStatProps } from "@/components/CampaignPage";
import { CampaignStat } from "@/components/CampaignStat";
import { GivingOptions } from "@/components/GivingOptions";
import { NavBar } from "@/components/NavBar";
import { buildGivingOptions } from "@/lib/giving-options";

const campaignUrls = {
  eoyCampaignUrl: "https://deltabayimpact.networkforgood.com/",
  monthlyUrl: "https://deltabayimpact.networkforgood.com/",
};

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
        <CampaignPage {...campaignUrls} />
      </main>
    </>
  ),
};

export const WaysToGive: Story = {
  render: () => (
    <div className="mx-auto max-w-xl bg-white p-6">
      <GivingOptions options={buildGivingOptions(campaignUrls)} />
    </div>
  ),
};

export const ProofStat: Story = {
  render: () => <CampaignStat {...campaignStatProps} />,
};
