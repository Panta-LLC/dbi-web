import { CampaignPaceMeter } from "@/components/CampaignPaceMeter";
import { Container } from "@/components/Container";
import { getYearEndCampaignProgress } from "@/lib/campaign-progress";

type YearEndCampaignTrackerProps = {
  variant?: "full" | "compact";
  ctaHref?: string;
};

/**
 * Campaign tracker with the live Network for Good total. Text and dates come from the
 * Sanity Fundraising Campaign. Renders nothing when no campaign is live, the homepage
 * tracker is turned off, or the total can't be read.
 */
export async function YearEndCampaignTracker({ variant = "full", ctaHref }: YearEndCampaignTrackerProps) {
  const progress = await getYearEndCampaignProgress();
  if (!progress) return null;

  const { campaign, ...meter } = progress;
  const full = variant === "full";
  if (!full && !campaign.showOnHomepage) return null;

  return (
    <div className={full ? "bg-white py-10 md:py-14" : "bg-white py-6 md:py-8"}>
      <Container maxWidth={full ? "site" : "narrow"}>
        <CampaignPaceMeter
          {...meter}
          variant={variant}
          eyebrow={campaign.eyebrow || undefined}
          milestones={
            full
              ? campaign.milestones.map((m) => ({ label: m.label, date: `${m.date}T00:00:00-08:00` }))
              : []
          }
          ctaHref={ctaHref}
          ctaLabel={full ? campaign.donateCtaLabel : campaign.homepageCtaLabel}
        />
      </Container>
    </div>
  );
}
