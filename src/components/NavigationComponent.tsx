import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type NavHeaderProps = {
  onPrevious: () => void;
  onNext: () => void;
  headerText: string;
  description?: string;
  currentIndex?: number;
  totalCategories?: number;
};

const NavigationComponent = ({
  onPrevious,
  onNext,
  headerText,
  description,
  currentIndex = 0,
  totalCategories = 1,
}: NavHeaderProps) => {
  const safeTotal = Math.max(1, totalCategories);
  const currentStep = Math.min(safeTotal, Math.max(1, currentIndex + 1));
  const formattedCurrent = String(currentStep).padStart(2, "0");
  const formattedTotal = String(safeTotal).padStart(2, "0");
  const progressPercent = (currentStep / safeTotal) * 100;

  return (
    <section
      aria-label="Category Header"
      className="w-full pt-4 sm:pt-5 pb-3 sm:pb-4"
    >
      {/* Top Meta Bar: Event Label & Category Counter */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="text-[#FF641A] text-[11px] sm:text-xs font-bold font-montserrat uppercase tracking-[0.26em]">
          The Game Awards 2026
        </span>
        <span
          aria-label={`Category ${currentStep} of ${safeTotal}`}
          className="font-montserrat font-bold text-xs sm:text-sm tracking-[0.18em] tabular-nums text-[#F5F5F5] shrink-0"
        >
          {formattedCurrent}{" "}
          <span className="text-zinc-500">/ {formattedTotal}</span>
        </span>
      </div>

      {/* Subtle Horizontal Progress Indicator */}
      <div
        role="progressbar"
        aria-label="Category progress"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
        className="w-full h-[2px] bg-zinc-800/90 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-[#FF641A] transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Category Title + Prev / Next Controls */}
      <div className="flex items-center justify-between gap-3 sm:gap-6 mt-3.5 sm:mt-4">
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Previous category"
          title="Previous category (Left Arrow)"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-zinc-800 bg-[#141416] text-zinc-300 hover:border-[#FF641A] hover:text-[#FF641A] hover:bg-[#FF641A]/10 active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A]"
        >
          <FaArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
        </button>

        <h1 className="flex-1 min-w-0 text-center text-3xl sm:text-4xl lg:text-[3.25rem] font-black font-barlow uppercase tracking-tight leading-[0.95] text-[#FF641A] break-words">
          {headerText}
        </h1>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next category"
          title="Next category (Right Arrow)"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-zinc-800 bg-[#141416] text-zinc-300 hover:border-[#FF641A] hover:text-[#FF641A] hover:bg-[#FF641A]/10 active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A]"
        >
          <FaArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Category Description */}
      {description && (
        <p className="mt-2 sm:mt-2.5 text-zinc-400 font-barlow text-sm sm:text-base leading-snug max-w-2xl text-center mx-auto">
          {description}
        </p>
      )}
    </section>
  );
};

export default NavigationComponent;
