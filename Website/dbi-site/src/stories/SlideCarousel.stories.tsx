import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId } from "react";
import { resolveCarouselSettings, SlideCarousel, useCarousel } from "@/components/carousel";

function SlideCarouselDemo() {
  const slides = [
    "First highlight line for the carousel demo.",
    "Second highlight with a different message.",
    "Third slide to show dots and navigation.",
  ];
  const count = slides.length;
  const resolved = resolveCarouselSettings({
    transition: "fade",
    transitionDurationMs: 680,
    showPagination: true,
    showProgress: false,
  });
  const c = useCarousel(count, { autoPlayMs: undefined });
  const baseId = useId();
  const regionId = `${baseId}-region`;
  const labelId = `${baseId}-label`;

  return (
    <div className="bg-light-gray py-12 px-4">
      <SlideCarousel
        count={count}
        multi={c.multi}
        activeIndex={c.activeIndex}
        direction={c.direction}
        transition={resolved.transition}
        transitionDurationMs={resolved.transitionDurationMs}
        autoPlayMs={resolved.autoPlayMs}
        showPagination={resolved.showPagination ?? c.multi}
        showProgress={false}
        regionId={regionId}
        labelId={labelId}
        srLabel={`Demo carousel, slide ${c.activeIndex + 1} of ${count}`}
        onKeyDown={c.onKeyDown}
        onPointerEnter={() => c.setPaused(true)}
        onPointerLeave={() => c.setPaused(false)}
        goPrev={c.goPrev}
        goNext={c.goNext}
        goToIndex={c.goToIndex}
        prevArrowLabel="Previous"
        nextArrowLabel="Next"
        dotNavLabel="Pagination"
        getDotLabel={(i, n) => `Go to slide ${i + 1} of ${n}`}
        theme="light"
        className="relative flex flex-col items-center justify-center max-w-3xl mx-auto outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm w-full"
        contentWrapperClassName="min-h-32 flex items-center justify-center py-4"
        renderSlide={() => (
          <p className="display-m font-semibold text-center text-balance">{slides[c.activeIndex]}</p>
        )}
      />
    </div>
  );
}

const meta: Meta<typeof SlideCarouselDemo> = {
  title: "Components/SlideCarousel",
  component: SlideCarouselDemo,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SlideCarouselDemo>;

export const LightTheme: Story = {
  render: () => <SlideCarouselDemo />,
};
