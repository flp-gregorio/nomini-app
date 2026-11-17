import { memo, useCallback, useRef, type KeyboardEvent } from "react";

export type CategoryGridItem = {
  id?: number | string;
  title?: string;
};

type CategoryNavigationGridProps = {
  categories: CategoryGridItem[];
  currentIndex: number;
  onSelectCategory: (index: number) => void;
};

/** Landscape layout, maximum 10 columns. 30 -> 10x3. */
function getGridColumns(total: number): number {
  if (total <= 0) return 1;
  return Math.min(10, total);
}

const pad = (n: number) => String(n).padStart(2, "0");

const CategoryNavigationGrid = memo(
  ({
    categories,
    currentIndex,
    onSelectCategory,
  }: CategoryNavigationGridProps) => {
    const gridRef = useRef<HTMLDivElement>(null);

    const total = categories?.length ?? 0;
    const columns = getGridColumns(total);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const buttons = gridRef.current?.children;
        if (!buttons) return;

        const focused = Array.from(buttons).indexOf(
          document.activeElement as Element
        );

        if (focused === -1) return;

        const delta: Record<string, number> = {
          ArrowRight: 1,
          ArrowLeft: -1,
          ArrowDown: columns,
          ArrowUp: -columns,
        };

        let next: number | null = null;

        if (e.key in delta) next = focused + delta[e.key];
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = total - 1;

        if (next === null || next < 0 || next >= total) return;

        e.preventDefault();
        (buttons[next] as HTMLElement).focus();
      },
      [columns, total]
    );

    if (!categories || total === 0) return null;

    const currentPosition =
      currentIndex >= 0 && currentIndex < total ? currentIndex + 1 : 0;

    const remainder = total % columns;
    const lastRowStart = total - remainder;
    const lastRowOffset = Math.floor((columns - remainder) / 2);

    return (
      <nav
        aria-label="Category navigation grid"
        className="mt-6 sm:mt-8 flex w-full justify-center"
      >
        <div className="flex w-fit max-w-full flex-col items-center gap-3">
          {/* Counter */}
          <div
            aria-live="polite"
            className="flex items-baseline justify-center gap-1 font-barlow tabular-nums"
          >
            <span className="text-xl font-semibold leading-none text-[#FF641A] drop-shadow-[0_0_8px_rgba(255,100,26,0.6)]">
              {pad(currentPosition)}
            </span>
            <span className="text-[11px] font-medium tracking-[0.14em] text-zinc-600">
              / {pad(total)}
            </span>
          </div>

          {/* Square indicators */}
          <div
            ref={gridRef}
            onKeyDown={handleKeyDown}
            className="grid w-fit max-w-full justify-center gap-x-2 gap-y-2.5"
            style={{
              gridTemplateColumns: `repeat(${columns}, 10px)`,
            }}
          >
            {categories.map((category, index) => {
              const categoryTitle =
                category.title?.trim() || `Category ${index + 1}`;

              const isCurrent = index === currentIndex;
              const isPast = index < currentIndex;

              const isInLastRow = remainder > 0 && index >= lastRowStart;

              const visualColumn = isInLastRow
                ? lastRowOffset + (index - lastRowStart)
                : index % columns;

              const gridPlacement = isInLastRow
                ? {
                    gridColumnStart: visualColumn + 1,
                    gridRowStart: Math.floor(index / columns) + 1,
                  }
                : undefined;

              const tooltipPosition =
                visualColumn === 0
                  ? "left-0"
                  : visualColumn === columns - 1
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2";

              const state = isCurrent
                ? "bg-[#FF641A] shadow-[0_0_18px_3px_rgba(255,100,26,0.75)]"
                : isPast
                ? "bg-[#FF641A]/35 hover:bg-[#FF641A] hover:shadow-[0_0_12px_2px_rgba(255,100,26,0.55)]"
                : "bg-white/15 hover:bg-[#FF641A] hover:shadow-[0_0_12px_2px_rgba(255,100,26,0.55)]";

              return (
                <button
                  key={category.id ?? `${categoryTitle}-${index}`}
                  type="button"
                  onClick={() => onSelectCategory(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={categoryTitle}
                  style={gridPlacement}
                  className={`group relative z-0 h-[10px] w-[10px] shrink-0 rounded-none border-0 p-0 outline-none transition-all duration-300 ease-out hover:z-10 hover:scale-125 motion-reduce:transition-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[#FF641A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] ${state}`}
                >
                  {/* Tooltip */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none invisible absolute bottom-full z-30 mb-3 flex w-max max-w-[180px] translate-y-1 flex-col items-center gap-0.5 border-l-2 border-[#FF641A] bg-black/95 px-2.5 py-1.5 text-center opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out motion-reduce:transition-none group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:max-w-[240px] ${tooltipPosition}`}
                  >
                    <span className="font-barlow text-[9px] font-semibold uppercase tabular-nums tracking-[0.18em] text-[#FF641A]">
                      {pad(index + 1)}
                    </span>
                    <span className="font-barlow text-[12px] font-medium uppercase leading-tight tracking-wide text-white">
                      {categoryTitle}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }
);

CategoryNavigationGrid.displayName = "CategoryNavigationGrid";

export default CategoryNavigationGrid;