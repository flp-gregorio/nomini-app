import { useEffect, useRef, useState } from "react";
import WhiteButtonComponent from "../../components/WhiteButtonComponent";
import api from "../../lib/api";
import { dataService } from "../../services/dataService";

type LeaderboardUser = {
  id: number;
  username: string;
  points: number;
};

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null); // null = global
  const tabCacheRef = useRef<Record<string, LeaderboardUser[]>>({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const maxPage = Math.max(1, Math.ceil(users.length / usersPerPage));

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1) {
      setCurrentPage(maxPage);
    } else if (pageNumber > maxPage) {
      setCurrentPage(1);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  // Fetch available years on mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const data = await dataService.getYears();
        setYears(data);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    fetchYears();
  }, []);

  // Fetch leaderboard when selectedYear changes (reuse cached tabs within this mount)
  useEffect(() => {
    const cacheKey = selectedYear ? String(selectedYear) : "global";
    const cached = tabCacheRef.current[cacheKey];
    if (cached) {
      setCurrentPage(1);
      setUsers(cached);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setCurrentPage(1);
        const url = selectedYear
          ? `/leaderboard?year=${selectedYear}`
          : "/leaderboard";
        const response = await api.get<LeaderboardUser[]>(url);

        if (!isMounted) return;
        const rows = Array.isArray(response.data) ? response.data : [];
        tabCacheRef.current[cacheKey] = rows;
        setUsers(rows);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  return (
    <div className="w-[94%] max-w-[1600px] mx-auto px-2 sm:px-4 pt-6 antialiased pb-12">
      {/* Header & Year/Global Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
        <div className="text-center lg:text-left">
          <h1 className="font-black text-white font-barlow uppercase text-4xl md:text-5xl tracking-tighter">
            Leaderboard
          </h1>
          <p className="text-zinc-400 font-barlow text-base md:text-lg mt-1">
            {selectedYear
              ? `The Game Awards ${selectedYear} Edition Rankings`
              : "All-Time Global Rankings Across All Editions"}
          </p>
        </div>

        <div className="flex justify-center lg:justify-end gap-3 flex-wrap">
          <button
            onClick={() => setSelectedYear(null)}
            className={`px-5 py-2 font-barlow font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
              selectedYear === null
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            Global
          </button>
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
              {year === 2026 ? "2026 (Current)" : year}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-white font-barlow animate-pulse text-center py-12">Calculating Scores...</div>
      ) : (
        <>
          <div className="w-full max-w-6xl mx-auto">
            <div className="hidden sm:flex items-center justify-between px-6 py-2 text-xs font-montserrat font-bold uppercase tracking-widest text-zinc-500">
              <div className="flex items-center gap-6">
                <span className="w-10 text-right">Rank</span>
                <span>Player</span>
              </div>
              <span>Score</span>
            </div>
            <ul className="font-montserrat uppercase w-full">
              {currentUsers.map((user, index) => {
                const rank = indexOfFirstUser + index + 1;

                let rankColor = "text-white";
                if (rank === 1) rankColor = "text-yellow-400";
                if (rank === 2) rankColor = "text-gray-300";
                if (rank === 3) rankColor = "text-orange-400";

                return (
                  <li
                    key={user.id}
                    className={`font-barlow font-bold uppercase tracking-wider flex items-center justify-between mb-2.5 py-3.5 px-6 shadow-md transition-transform hover:scale-[1.005] ${
                      rank % 2 === 0 ? "bg-zinc-800/90" : "bg-zinc-900/90"
                    }`}
                  >
                    <div className="flex items-center gap-6 min-w-0">
                      <span className={`text-2xl w-10 text-right shrink-0 ${rankColor}`}>
                        #{rank}
                      </span>
                      <span className="text-white text-lg truncate">
                        {user.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-orange-500 text-xl">{user.points}</span>
                      <span className="text-zinc-500 text-xs">PTS</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Pagination Controls */}
          {users.length > usersPerPage && (
            <div className="mt-6 flex flex-row justify-center gap-8">
              <WhiteButtonComponent
                text="Previous"
                type={true}
                click={() => handlePageChange(currentPage - 1)}
              />
              <span className="text-white self-center font-barlow">
                Page {currentPage} of {maxPage}
              </span>
              <WhiteButtonComponent
                text="Next"
                type={false}
                click={() => handlePageChange(currentPage + 1)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;