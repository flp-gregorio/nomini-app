import { useState, useEffect, useRef } from "react";
import { Category, Nominee } from "../../@types/NomineeType";
import { dataService } from "../../services/dataService";

interface NomineeWithStatus extends Nominee {
  Winner?: boolean;
  winner?: boolean;
}

type WinnerCardData = {
  category: Category;
  winnerNominee: NomineeWithStatus | null;
};

const Winners = () => {
  const [winnersData, setWinnersData] = useState<WinnerCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const loadedYearRef = useRef<number | null>(null);

  // Fetch consolidated winners (and available years) in a single request
  useEffect(() => {
    if (selectedYear !== null && loadedYearRef.current === selectedYear) {
      return;
    }

    const cached = dataService.getCachedWinners(selectedYear ?? undefined);
    if (cached) {
      loadedYearRef.current = cached.year;
      setYears(cached.years);
      if (selectedYear === null && cached.year) {
        setSelectedYear(cached.year);
      }
      setWinnersData(cached.categories);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchWinners = async () => {
      try {
        setIsLoading(true);
        const data = await dataService.getWinners(selectedYear ?? undefined);
        if (!isMounted) return;

        loadedYearRef.current = data.year;
        setYears(data.years);
        if (selectedYear === null && data.year) {
          setSelectedYear(data.year);
        }
        setWinnersData(data.categories);
      } catch (error) {
        console.error("Critical error fetching winners:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchWinners();
    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Idle-prefetch alternate seasons (e.g. 2025) so year tab switching is instant
  useEffect(() => {
    if (isLoading || years.length <= 1 || selectedYear === null) return;
    const otherYears = years.filter((y) => y !== selectedYear);
    if (otherYears.length === 0) return;

    const prefetchOthers = () => {
      otherYears.forEach((y) => {
        if (!dataService.getCachedWinners(y)) {
          void dataService.getWinners(y).catch(() => {});
        }
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(prefetchOthers, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(prefetchOthers, 400);
    return () => window.clearTimeout(timer);
  }, [isLoading, years, selectedYear]);

  return (
    <div className="w-[94%] max-w-[1800px] mx-auto px-2 sm:px-4 py-6">
      {/* Header & Year Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white font-barlow uppercase tracking-tighter">
            And the <span className="text-orange-500">Winners</span> are...
          </h1>
          <p className="text-zinc-400 font-barlow text-base md:text-lg mt-1">
            Official results from The Game Awards {selectedYear ?? 2026}
          </p>
        </div>

        {/* Year Selector */}
        {years.length > 0 && (
          <div className="flex justify-center lg:justify-end gap-3 flex-wrap">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-5 py-2 font-barlow font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                  selectedYear === year
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div
          aria-label="Loading results"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6"
        >
          {Array.from({ length: Math.max(winnersData.length, 12) }).map((_, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 overflow-hidden animate-pulse"
            >
              <div className="aspect-video w-full bg-zinc-800/70" />
              <div className="p-6 min-h-[152px] space-y-3">
                <div className="h-3 w-1/2 bg-zinc-800" />
                <div className="h-6 w-3/4 bg-zinc-800" />
                <div className="h-4 w-full bg-zinc-800/70" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
          {winnersData.map((item, index) => (
            <div
              key={item.category.id}
              className={`group relative bg-zinc-900 border overflow-hidden shadow-lg transition-all duration-300 flex flex-col ${
                item.winnerNominee
                  ? "border-orange-500/50 hover:shadow-orange-500/20"
                  : "border-zinc-800"
              }`}
            >
              {/* Image Section */}
              <div className="aspect-video w-full relative bg-black shrink-0">
                {item.winnerNominee ? (
                  <>
                    <img
                      src={item.winnerNominee.image}
                      alt={item.winnerNominee.name}
                      width={420}
                      height={236}
                      loading={index < 8 ? "eager" : "lazy"}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider shadow-lg animate-pulse">
                      Winner
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50">
                    <div className="w-12 h-12 border-2 border-zinc-700 flex items-center justify-center mb-2">
                      <span className="text-zinc-500 text-xl font-bold">?</span>
                    </div>
                    <span className="text-zinc-500 font-barlow uppercase tracking-widest text-sm">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 min-h-[152px] relative flex-1">
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-2 font-barlow">
                  {item.category.title}
                </h3>
                <h2
                  className={`text-2xl font-black uppercase leading-tight font-barlow italic ${
                    item.winnerNominee ? "text-white" : "text-zinc-700"
                  }`}
                >
                  {item.winnerNominee ? item.winnerNominee.name : "TBA"}
                </h2>
                {item.winnerNominee && (
                  <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                    {item.winnerNominee.description ||
                      item.winnerNominee.publisher ||
                      "No description available."}
                  </p>
                )}
                {!item.winnerNominee && (
                  <p className="text-zinc-600 text-sm mt-2 italic">
                    Winner has not been announced yet.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Winners;
