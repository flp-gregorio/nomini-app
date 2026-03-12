import { useState, useEffect } from "react";
import { Category, Nominee } from "../../@types/NomineeType";
import api from "../../lib/api";

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

  // Fetch available years on mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const { data } = await api.get<number[]>("/categories/years");
        setYears(data);
        if (data.length > 0) {
          setSelectedYear(data[0]); // latest year (sorted desc)
        }
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    fetchYears();
  }, []);

  // Fetch winners when selectedYear changes
  useEffect(() => {
    if (selectedYear === null) return;

    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const { data: categories } = await api.get<Category[]>(
          `/categories?year=${selectedYear}`
        );

        const promisedResults = categories.map(async (category) => {
          try {
            const { data: nominees } = await api.get<NomineeWithStatus[]>(
              `/categories/${category.id}/nominees`
            );

            const winnerNominee =
              nominees.find((n) => n.Winner === true || n.winner === true) ||
              null;

            return { category, winnerNominee };
          } catch (err) {
            console.error(
              `Failed to load data for category: ${category.title}`,
              err
            );
            return { category, winnerNominee: null };
          }
        });

        const results = await Promise.all(promisedResults);
        setWinnersData(results);
      } catch (error) {
        console.error("Critical error fetching winners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [selectedYear]);

  if (isLoading && years.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-white text-2xl font-barlow font-bold tracking-widest uppercase animate-pulse">
          Loading Results...
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-black text-white font-barlow uppercase tracking-tighter">
          And the <span className="text-orange-500">Winners</span> are...
        </h1>
      </div>

      {/* Year Selector */}
      {years.length > 0 && (
        <div className="flex justify-center gap-3 mb-10">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-5 py-2 rounded-full font-barlow font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
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

      {/* Subtitle */}
      <p className="text-zinc-400 text-center mb-8 font-barlow text-lg">
        Official results from The Game Awards {selectedYear}
      </p>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-white text-lg font-barlow font-bold uppercase animate-pulse">
            Loading...
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winnersData.map((item) => (
            <div
              key={item.category.id}
              className={`group relative bg-zinc-900 border rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                item.winnerNominee
                  ? "border-orange-500/50 hover:shadow-orange-500/20"
                  : "border-zinc-800"
              }`}
            >
              {/* Image Section */}
              <div className="aspect-video w-full relative bg-black">
                {item.winnerNominee ? (
                  <>
                    <img
                      src={item.winnerNominee.image}
                      alt={item.winnerNominee.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
                      Winner
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50">
                    <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center mb-2">
                      <span className="text-zinc-500 text-xl font-bold">?</span>
                    </div>
                    <span className="text-zinc-500 font-barlow uppercase tracking-widest text-sm">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 relative">
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
