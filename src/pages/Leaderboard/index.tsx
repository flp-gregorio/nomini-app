import { useEffect, useState } from "react";
import WhiteButtonComponent from "../../components/WhiteButtonComponent";
import api from "../../lib/api";

// Define the exact shape returned by our new backend route
type LeaderboardUser = {
  id: number;
  username: string;
  points: number;
};

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // Derived State for Pagination
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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<LeaderboardUser[]>("/leaderboard");
        
        // The backend returns a sorted array, so we just set it
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-20 pt-4 text-center antialiased pb-20">
      <h1 className="font-bold text-white mb-8 font-montserrat uppercase text-3xl">
        Leaderboard
      </h1>

      {isLoading ? (
        <div className="text-white font-barlow animate-pulse">Calculating Scores...</div>
      ) : (
        <>
          <ul className="font-montserrat uppercase w-full max-w-4xl mx-auto">
            {currentUsers.map((user, index) => {
              // Calculate actual rank based on pagination
              const rank = indexOfFirstUser + index + 1;
              
              // Highlight top 3
              let rankColor = "text-white";
              if (rank === 1) rankColor = "text-yellow-400";
              if (rank === 2) rankColor = "text-gray-300";
              if (rank === 3) rankColor = "text-orange-400";

              return (
                <li
                  key={user.id}
                  className={`font-barlow font-bold uppercase tracking-wider flex items-center justify-between mb-3 py-4 px-6 rounded-lg shadow-md transition-transform hover:scale-[1.01] ${
                    rank % 2 === 0 ? "bg-zinc-800" : "bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <span className={`text-2xl w-8 text-right ${rankColor}`}>
                      #{rank}
                    </span>
                    <span className="text-white text-lg truncate max-w-[150px] md:max-w-xs">
                      {user.username}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 text-xl">{user.points}</span>
                    <span className="text-zinc-500 text-xs">PTS</span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Pagination Controls */}
          {users.length > usersPerPage && (
            <div className="mt-8 flex flex-row justify-center gap-8">
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