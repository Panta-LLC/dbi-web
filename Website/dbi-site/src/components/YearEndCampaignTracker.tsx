import { CampaignPaceMeter } from "@/components/CampaignPaceMeter";
import { Container } from "@/components/Container";
import { getYearEndCampaignProgress } from "@/lib/campaign-progress";

type YearEndCampaignTrackerProps = {
  variant?: "full" | "compact";
  ctaHref?: string;
  ctaLabel?: string;
};

/**
 * Year-end campaign tracker with the live Network for Good total. Renders nothing when
 * no campaign is configured or the total can't be read.
 */
export async function YearEndCampaignTracker({
  variant = "full",
  ctaHref,
  ctaLabel = "Give now",
}: YearEndCampaignTrackerProps) {
  const progress = await getYearEndCampaignProgress();
  if (!progress) return null;

  const full = variant === "full";
  return (
    <div className={full ? "bg-white py-10 md:py-14" : "bg-white py-6 md:py-8"}>
      <Container maxWidth={full ? "site" : "narrow"}>
        <CampaignPaceMeter
          {...progress}
          variant={variant}
          eyebrow="Bigger impact in 2027"
          milestones={full ? [{ date: "2026-12-01T00:00:00-08:00", label: "Giving Tuesday" }] : []}
          ctaHref={ctaHref}
          ctaLabel={ctaLabel}
        />
      </Container>
    </div>
  );
}
