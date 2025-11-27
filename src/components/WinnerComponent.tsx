import { Nominee } from "../@types/NomineeType";

type WinnerComponentProps = {
  category: string;
  data: Nominee[];
};

const WinnerComponent = (props: WinnerComponentProps) => {
  const getMaxVotes = () => {
    // Check if 'votes' exists and is a number, defaulting to 0
    return Math.max(
      ...props.data.map((nominee) => nominee.votes || 0) 
    );
  };

  const renderProgressBar = (
    nominee: Nominee,
    maxVotes: number,
    isWinner: boolean
  ) => {
    const voteCount = nominee.votes || 0; // Use number, default to 0
    // Avoid division by zero if maxVotes is 0
    const now = maxVotes > 0 ? (voteCount / maxVotes) * 100 : 0; 
    
    const labelName = isWinner
      ? `${nominee.name.toUpperCase()} • winner`
      : nominee.name.toUpperCase();
    const labelVotes = `${voteCount}`;
    const progressBarBg = isWinner ? "bg-red-600" : "bg-orange-600";

    return (
      <div key={nominee.id} className="flex mb-3 md:h-10 h-fit">
        <div className="w-full font-barlow">
          <div className="w-full bg-zinc-900 pb-2 md:pb-0">
            <div
              className={`min-h-10 ${progressBarBg} flex text-white font-bold transition-all duration-500`}
              style={{ width: `${now}%` }}
            >
              <div className="flex justify-between w-full px-4 items-center">
                <div className="flex-grow md:text-nowrap text-white font-bold uppercase tracking-wider antialiased md:overflow-clip">
                  {labelName}
                </div>
                <div className={`${voteCount === 0 ? "hidden" : "shown"}`}>
                  {labelVotes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const maxVotes = getMaxVotes();
  
  // Logic to find winner:
  // 1. Must have votes > 0
  // 2. Must match maxVotes
  // 3. (Optional) Could check nominee.Winner (boolean) if you prefer manual override
  const winnerIndex = props.data.findIndex(
    (nominee) => (nominee.votes || 0) === maxVotes && maxVotes > 0
  );

  // If you want to use the manual boolean instead, uncomment this:
  // const winnerIndex = props.data.findIndex(n => n.Winner === true);

  if (winnerIndex === -1 && maxVotes === 0) {
     // Optional: Show something else if no votes yet
  }

  return (
    <div className="bg-transparent md:px-10 flex flex-col w-3/4 mx-auto">
      <div className="flex justify-end my-4 ">
        <h1 className="text-white uppercase font-barlow text-2xl font-bold">
          {props.category} - {props.data[winnerIndex]?.description || "Voting in progress..."}
        </h1>
      </div>
      {props.data.map((nominee, index) =>
        renderProgressBar(nominee, maxVotes, index === winnerIndex)
      )}
    </div>
  );
};

export default WinnerComponent;