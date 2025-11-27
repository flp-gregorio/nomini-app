import { useState, useEffect } from "react";
import { Category, Nominee } from "../../@types/NomineeType";
import api from "../../lib/api";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

// Extend the base Nominee type to include the Winner boolean from data.json
// We check for both "Winner" (from JSON) and "winner" (standard API) just in case
interface NomineeWithStatus extends Nominee {
  Winner?: boolean;
  winner?: boolean;
}

// This represents the fully combined data for a single card
type WinnerCardData = {
  category: Category;
  winnerNominee: NomineeWithStatus | null; // Null if no winner selected in JSON yet
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const Winners = () => {
  const [winnersData, setWinnersData] = useState<WinnerCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch Categories
        const { data: categories } = await api.get<Category[]>("/categories");

        // 2. Parallel Fetch: Get nominees for ALL categories
        // We no longer fetch "/votes/stats" because the winner is determined by the JSON boolean
        const promisedResults = categories.map(async (category) => {
          try {
            // Fetch nominees for this specific category
            const { data: nominees } = await api.get<NomineeWithStatus[]>(
              `/categories/${category.id}/nominees`
            );

            // 3. Find the manual winner based on the boolean flag
            // Checks for 'Winner' (capitalized as in your data.json) or 'winner'
            const winnerNominee =
              nominees.find((n) => n.Winner === true || n.winner === true) ||
              null;

            return {
              category,
              winnerNominee,
            };
          } catch (err) {
            console.error(
              `Failed to load data for category: ${category.title}`,
              err
            );
            // Return a safe fallback so the whole page doesn't crash
            return { category, winnerNominee: null };
          }
        });

        // Wait for all requests to finish
        const results = await Promise.all(promisedResults);
        setWinnersData(results);
      } catch (error) {
        console.error("Critical error fetching winners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ----------------------------------------------------------------------
  // Render Helpers
  // ----------------------------------------------------------------------

  if (isLoading) {
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
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-white font-barlow uppercase tracking-tighter">
          And the <span className="text-orange-500">Winners</span> are...
        </h1>
        <p className="text-zinc-400 mt-4 font-barlow text-lg">
          Official results from The Game Awards 2025
        </p>
      </div>

      {/* Grid Layout */}
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
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>

                  {/* Winner Badge */}
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
              {/* Category Title (Eyebrow) */}
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-2 font-barlow">
                {item.category.title}
              </h3>

              {/* Winner Name */}
              <h2
                className={`text-2xl font-black uppercase leading-tight font-barlow italic ${
                  item.winnerNominee ? "text-white" : "text-zinc-700"
                }`}
              >
                {item.winnerNominee ? item.winnerNominee.name : "TBA"}
              </h2>

              {/* Description or Publisher */}
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
    </div>
  );
};

export default Winners;
