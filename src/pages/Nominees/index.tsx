import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import CardComponent from "../../components/CardComponent";
import NavigationComponent from "../../components/NavigationComponent";
import ButtonComponent from "../../components/ButtonComponent";
import api from "../../lib/api";

import { NomineeArtwork } from "../../@types/NomineeType";

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
  artwork?: NomineeArtwork | null;
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

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

const Nominees = () => {
  const [categories, setCategories] = useState<JsonCategory[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventStartTime, setEventStartTime] = useState<Date | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const [activeNominees, setActiveNominees] = useState<
    Record<string, string | null>
  >({});
  const [savedNominees, setSavedNominees] = useState<Record<string, string>>(
    {}
  );
  const [voteIds, setVoteIds] = useState<Record<string, number>>({});

  const feedbackTimerRef = useRef<number | null>(null);

  const showFeedback = useCallback(
    (nextFeedback: FeedbackState, autoClearMs?: number) => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = null;
      }
      setFeedback(nextFeedback);
      if (nextFeedback && autoClearMs) {
        feedbackTimerRef.current = window.setTimeout(() => {
          setFeedback(null);
        }, autoClearMs);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const categoriesRes = await api.get<JsonCategory[]>("/categories");
        const fetchedCategories = categoriesRes.data;

        const categoriesWithNominees = await Promise.all(
          fetchedCategories.map(async (cat) => {
            const nomineesRes = await api.get<JsonNominee[]>(
              `/categories/${cat.id}/nominees`
            );
            return { ...cat, nominees: nomineesRes.data };
          })
        );

        setCategories(categoriesWithNominees);

        try {
          const eventRes = await api.get<{ eventDate: string | null }>(
            "/event"
          );
          if (eventRes.data.eventDate) {
            setEventStartTime(new Date(eventRes.data.eventDate));
          }
        } catch (err) {
          console.error("Failed to fetch event date", err);
        }

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
            setSavedNominees(votesMap);
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

  const handleNextCategory = useCallback(() => {
    if (!categories.length) return;
    setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
    window.scrollTo(0, 0);
  }, [categories.length]);

  const handlePreviousCategory = useCallback(() => {
    if (!categories.length) return;
    setCurrentCategoryIndex(
      (prevIndex) => (prevIndex - 1 + categories.length) % categories.length
    );
    window.scrollTo(0, 0);
  }, [categories.length]);

  // Keyboard navigation between categories (Left / Right Arrow keys)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePreviousCategory();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNextCategory();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextCategory, handlePreviousCategory]);

  const isVotingClosed = eventStartTime ? new Date() >= eventStartTime : false;
  const activeCategoryTitle = categories[currentCategoryIndex]?.title || "";

  const handleSetActiveCard = useCallback(
    (nominee: string) => {
      if (!activeCategoryTitle || isVotingClosed || isSubmitting) return;
      setActiveNominees((prev) => ({
        ...prev,
        [activeCategoryTitle]:
          prev[activeCategoryTitle] === nominee ? null : nominee,
      }));
      setFeedback((prev) => {
        if (prev?.type === "error") {
          if (feedbackTimerRef.current) {
            window.clearTimeout(feedbackTimerRef.current);
            feedbackTimerRef.current = null;
          }
          return null;
        }
        return prev;
      });
    },
    [activeCategoryTitle, isVotingClosed, isSubmitting]
  );

  const onSaveVote = async () => {
    if (isVotingClosed) {
      showFeedback({ type: "error", message: "Voting is closed." }, 4000);
      return;
    }
    if (isSubmitting || !categories.length) return;

    const currentCategoryKey = categories[currentCategoryIndex].title || "";
    const activeNominee = activeNominees[currentCategoryKey];

    if (!activeNominee) {
      showFeedback(
        { type: "error", message: "Please select a nominee first." },
        3500
      );
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      showFeedback({ type: "error", message: "Please login to vote." }, 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      const existingVoteId = voteIds[currentCategoryKey];

      if (existingVoteId) {
        await api.put(`/votes/${existingVoteId}`, {
          nominee: activeNominee,
        });
      } else {
        const res = await api.post("/votes", {
          category: currentCategoryKey,
          nominee: activeNominee,
        });

        if (res.data.vote?.id) {
          setVoteIds((prev) => ({
            ...prev,
            [currentCategoryKey]: res.data.vote.id,
          }));
        }
      }

      setSavedNominees((prev) => ({
        ...prev,
        [currentCategoryKey]: activeNominee,
      }));

      showFeedback(
        {
          type: "success",
          message: `Saved "${activeNominee}" for ${currentCategoryKey}`,
        },
        3200
      );

      if (currentCategoryIndex < categories.length - 1) {
        handleNextCategory();
      }
    } catch (error) {
      console.error("Failed to save vote:", error);
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as
          | { message?: string }
          | undefined;
        showFeedback(
          {
            type: "error",
            message: errorData?.message || "Failed to save vote.",
          },
          4500
        );
      } else {
        showFeedback(
          { type: "error", message: "Failed to save vote." },
          4500
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1760px] mx-auto px-[clamp(16px,3vw,48px)] py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#FF641A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-300 font-barlow font-bold uppercase tracking-[0.22em] text-sm">
          Loading 2026 Nominees...
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full max-w-[1760px] mx-auto px-[clamp(16px,3vw,48px)] py-20 text-center">
        <p className="text-zinc-400 font-barlow font-bold uppercase tracking-[0.22em]">
          No 2026 categories found.
        </p>
      </div>
    );
  }

  const currentCategory = categories[currentCategoryIndex];
  const currentCategoryKey = currentCategory.title || "Unknown Category";
  const cardsData = currentCategory.nominees ?? [];

  const activeNominee = activeNominees[currentCategoryKey] || null;
  const savedNominee = savedNominees[currentCategoryKey] || null;
  const hasExistingVote = Boolean(voteIds[currentCategoryKey]);
  const isAlreadySaved = Boolean(
    activeNominee && savedNominee === activeNominee
  );
  const isLastCategory = currentCategoryIndex === categories.length - 1;

  const buttonLabel = isVotingClosed
    ? "Voting Closed"
    : isSubmitting
    ? "Saving..."
    : isAlreadySaved
    ? "Vote Saved"
    : hasExistingVote && activeNominee
    ? "Update Vote"
    : "Save Vote";

  return (
    <div className="w-full max-w-[1760px] mx-auto px-[clamp(16px,3vw,48px)] pb-6 sm:pb-6">
      <NavigationComponent
        onPrevious={handlePreviousCategory}
        onNext={handleNextCategory}
        headerText={currentCategoryKey}
        description={currentCategory.description}
        currentIndex={currentCategoryIndex}
        totalCategories={categories.length}
      />

      {/* Centered Responsive Nominee Layout: 2 cols mobile, 3 cols tablet, 6 cols wide desktop */}
      <div
        key={currentCategoryKey}
        className="animate-category-enter w-full flex flex-wrap justify-center gap-3.5 sm:gap-5 2xl:gap-6 mt-2 sm:mt-3"
      >
        {cardsData.map((nomineeData, index) => {
          const title = nomineeData.Nominee ?? nomineeData.name ?? "Unknown";
          const aux =
            nomineeData.Publisher ??
            nomineeData.publisher ??
            nomineeData.developer ??
            "";
          const genre = nomineeData.Genre ?? nomineeData.genre ?? "";
          const background =
            nomineeData.artwork?.imageUrl ??
            nomineeData.Image ??
            nomineeData.image ??
            "";

          return (
            <CardComponent
              key={`${currentCategoryKey}-${nomineeData.id ?? title}-${index}`}
              nominee={title}
              aux={aux}
              genre={genre}
              background={background}
              loading={index < 6 ? "eager" : "lazy"}
              priority={index < 6}
              sizes="(min-width: 1280px) 16vw, (min-width: 640px) 31vw, 46vw"
              width={nomineeData.artwork?.width}
              height={nomineeData.artwork?.height}
              active={title === activeNominee}
              disabled={isVotingClosed || isSubmitting}
              className="!w-[calc((100%-14px)/2)] sm:!w-[calc((100%-40px)/3)] xl:!w-[calc((100%-100px)/6)] 2xl:!w-[calc((100%-120px)/6)]"
              setActiveCard={handleSetActiveCard}
            />
          );
        })}
      </div>

      {/* Connected Voting Action Bar (sticky on mobile below cards, static below grid on md+) */}
      <div className="sticky bottom-3 md:static z-20 mt-6 md:mt-5">
        <div className="bg-[#141416] border border-zinc-800/90 rounded-md px-4 sm:px-6 py-3 sm:py-3.5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <div className="min-w-0 flex flex-col gap-1">
            {feedback && (
              <div
                role="status"
                aria-live="polite"
                className={`text-xs font-montserrat font-bold uppercase tracking-wider flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                <span aria-hidden="true">
                  {feedback.type === "success" ? "✓" : "!"}
                </span>
                <span className="truncate">{feedback.message}</span>
              </div>
            )}

            {isVotingClosed ? (
              <p className="text-sm font-barlow text-zinc-400">
                Voting for The Game Awards 2026 has closed.
              </p>
            ) : activeNominee ? (
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 min-w-0">
                <span className="text-[11px] font-montserrat font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Selected
                </span>
                <span className="font-barlow font-bold text-base sm:text-lg text-[#F5F5F5] uppercase tracking-tight truncate">
                  {activeNominee}
                </span>
                {isAlreadySaved ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-montserrat font-bold uppercase tracking-wider">
                    Saved
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-[#FF641A]/15 border border-[#FF641A]/35 text-[#FF641A] text-[10px] font-montserrat font-bold uppercase tracking-wider">
                    {hasExistingVote ? "Modified" : "Ready"}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm font-barlow text-zinc-400">
                Select a nominee above to cast your vote in{" "}
                <span className="text-zinc-200 font-semibold">
                  {currentCategoryKey}
                </span>
                .
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 shrink-0">
            {isAlreadySaved && !isLastCategory && (
              <button
                type="button"
                onClick={handleNextCategory}
                className="px-4 py-2.5 rounded-sm border border-zinc-700 bg-[#1C1C20] hover:border-zinc-500 text-xs font-montserrat font-bold uppercase tracking-[0.15em] text-[#F5F5F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A]"
              >
                Next Category →
              </button>
            )}
            <ButtonComponent
              text={buttonLabel}
              onClick={onSaveVote}
              disabled={
                isVotingClosed ||
                isSubmitting ||
                !activeNominee ||
                isAlreadySaved
              }
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nominees;
