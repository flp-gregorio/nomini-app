import { useState, useEffect } from "react";
import CardComponent from "../../components/CardComponent";
import NavigationComponent from "../../components/NavigationComponent";
import ButtonComponent from "../../components/ButtonComponent";
import api from "../../lib/api";
import { AxiosError } from "axios";

// TODO: Update this to the actual event start time
const EVENT_START_TIME = new Date("2025-12-12T21:30:00-03:00");

// Types
type JsonNominee = {
  Nominee?: string;
  Publisher?: string;
  Votes?: number;
  Genre?: string;
  Description?: string;
  Image?: string;
  name?: string;
  developer?: string;
  publisher?: string;
  image?: string;
  genre?: string;
  description?: string;
  id?: string | number;
};

type JsonCategory = {
  id?: number;
  title?: string;
  description?: string;
  nominees?: JsonNominee[];
};

type UserVote = {
  id: number;
  category: string;
  nominee: string;
};

const Nominees = () => {
  const [categories, setCategories] = useState<JsonCategory[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [activeNominees, setActiveNominees] = useState<
    Record<string, string | null>
  >({});
  const [voteIds, setVoteIds] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const categoriesRes = await api.get<JsonCategory[]>("/categories");
        const fetchedCategories = categoriesRes.data;

        const categoriesWithNominees = await Promise.all(fetchedCategories.map(async (cat) => {
          const nomineesRes = await api.get<JsonNominee[]>(`/categories/${cat.id}/nominees`);
          return { ...cat, nominees: nomineesRes.data };
        }));

        setCategories(categoriesWithNominees);

        const token = localStorage.getItem("jwt");
        if (token) {
          try {
            const votesRes = await api.get<UserVote[]>("/votes/user");
            const votes = votesRes.data;
            const votesMap: Record<string, string> = {};
            const idsMap: Record<string, number> = {};
            votes.forEach((vote) => {
              votesMap[vote.category] = vote.nominee;
              idsMap[vote.category] = vote.id;
            });
            setActiveNominees(votesMap);
            setVoteIds(idsMap);
          } catch (err) {
            console.error("Failed to fetch user votes", err);
          }
        }

      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNextCategory = () => {
    setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
    window.scrollTo(0, 0);
  };

  const handlePreviousCategory = () => {
    setCurrentCategoryIndex(
      (prevIndex) => (prevIndex - 1 + categories.length) % categories.length
    );
    window.scrollTo(0, 0);
  };

  const handleSetActiveCard = (nominee: string) => {
    if (!categories.length || isVotingClosed) return;
    const currentCategoryKey = categories[currentCategoryIndex].title || "";
    setActiveNominees((prev) => ({
      ...prev,
      [currentCategoryKey]:
        prev[currentCategoryKey] === nominee ? null : nominee,
    }));
  };

  const onSaveVote = async () => {
    if (isVotingClosed) {
      alert("Voting is closed!");
      return;
    }
    if (!categories.length) return;
    const currentCategoryKey = categories[currentCategoryIndex].title || "";
    const activeNominee = activeNominees[currentCategoryKey];

    if (!activeNominee) {
      alert("Please select a nominee first!");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Please login to vote.");
      return;
    }

    try {
      const existingVoteId = voteIds[currentCategoryKey];

      if (existingVoteId) {
        // Update existing vote (PUT)
        await api.put(`/votes/${existingVoteId}`, {
          nominee: activeNominee,
        });
      } else {
        // Create new vote (POST)
        const res = await api.post("/votes", {
          category: currentCategoryKey,
          nominee: activeNominee,
        });

        // Update voteIds with the new vote ID
        if (res.data.vote?.id) {
          setVoteIds(prev => ({
            ...prev,
            [currentCategoryKey]: res.data.vote.id
          }));
        }
      }

      handleNextCategory();
    } catch (error) {
      console.error("Failed to save vote:", error);
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        alert(errorData?.message || "An error occurred");
      }
    }
  };

  if (isLoading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (categories.length === 0) {
    return <div className="text-white text-center mt-20">No categories found.</div>;
  }

  const currentCategory = categories[currentCategoryIndex];
  const currentCategoryKey = currentCategory.title || "Unknown Category";

  const cardsData = currentCategory.nominees ?? [];
  const numCards = cardsData.length ? Math.min(cardsData.length, 6) : 0;

  const activeNominee = activeNominees[currentCategoryKey] || null;

  const isLastCategory = currentCategoryIndex === categories.length - 1;
  const isVotingClosed = new Date() >= EVENT_START_TIME;

  return (
    <div className="flex flex-col items-center w-full">
      <NavigationComponent
        onPrevious={handlePreviousCategory}
        onNext={handleNextCategory}
        headerText={currentCategoryKey}
      />
      <p className="my-4 text-neutral-50 font-barlow tracking-wider md:max-w-2xl text-center mx-2 min-h-[48px]">
        {currentCategory.description}
      </p>

      <div className="hidden md:flex flex-col">
        <div className="grid gap-6 grid-cols-3 grid-rows-1">
          {cardsData.slice(0, 3).map((nomineeData, index) => {
            const title =
              nomineeData.Nominee ?? nomineeData.name ?? "Unknown";
            const aux = nomineeData.Publisher ?? nomineeData.publisher ?? nomineeData.developer ?? "";
            const genre = nomineeData.Genre ?? nomineeData.genre ?? "";
            const background = nomineeData.Image ?? nomineeData.image ?? "";

            return (
              <CardComponent
                key={`${currentCategoryKey}-top-${index}`}
                nominee={title}
                aux={aux}
                genre={genre}
                background={background}
                active={title === activeNominee}
                setActiveCard={handleSetActiveCard}
              />
            );
          })}
        </div>

        <div className="col-span-3 flex justify-center mt-6 flex-row">
          <div
            className={`grid gap-6 ${numCards % 3 === 0 ? "grid-cols-3" : "grid-cols-2"
              } grid-rows-1`}
          >
            {cardsData.slice(3, numCards).map((nomineeData, index) => {
              const title =
                nomineeData.Nominee ?? nomineeData.name ?? "Unknown";
              const aux =
                nomineeData.Publisher ?? nomineeData.publisher ?? nomineeData.developer ?? "";
              const genre = nomineeData.Genre ?? nomineeData.genre ?? "";
              const background = nomineeData.Image ?? nomineeData.image ?? "";
              return (
                <CardComponent
                  key={`${currentCategoryKey}-bottom-${index}`}
                  nominee={title}
                  aux={aux}
                  genre={genre}
                  background={background}
                  active={title === activeNominee}
                  setActiveCard={handleSetActiveCard}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="md:hidden grid gap-6 grid-cols-1 pb-12">
        {cardsData.map((nomineeData, index) => {
          const title = nomineeData.Nominee ?? nomineeData.name ?? "Unknown";
          const aux = nomineeData.Publisher ?? nomineeData.publisher ?? nomineeData.developer ?? "";
          const genre = nomineeData.Genre ?? nomineeData.genre ?? "";
          const background = nomineeData.Image ?? nomineeData.image ?? "";
          return (
            <CardComponent
              key={`${currentCategoryKey}-mobile-${index}`}
              nominee={title}
              aux={aux}
              genre={genre}
              background={background}
              active={title === activeNominee}
              setActiveCard={handleSetActiveCard}
            />
          );
        })}
      </div>
      <div className={isLastCategory || isVotingClosed ? "hidden" : "pt-4"}>
        <ButtonComponent
          text={isVotingClosed ? "Voting Closed" : "Save Vote"}
          onClick={onSaveVote}
          disabled={isVotingClosed}
        />
      </div>
    </div>
  );
};

export default Nominees;