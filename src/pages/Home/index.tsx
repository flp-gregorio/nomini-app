import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent";
import { dataService } from "../../services/dataService";

const Home = () => {
  const [countdown, setCountdown] = useState("");
  const [showDays, setShowDays] = useState(false);
  const [voteLink, setVoteLink] = useState("/nominees");
  const [eventDate, setEventDate] = useState<Date | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setVoteLink(token ? "/nominees" : "/login");

    // Fetch event date from backend (shared cache with Nominees/Admin)
    dataService.getEvent()
      .then(data => {
        setEventDate(data.eventDate ? new Date(data.eventDate) : null);
      })
      .catch(() => {
        // Fall back to the confirmed 2026 event date if the API is unreachable
        setEventDate(new Date("2026-12-10T23:00:00.000Z"));
      });
  }, []);

  useEffect(() => {
    // Don't start the countdown until we know the event date
    if (eventDate === undefined) return;

    const calculateCountdown = () => {
      if (!eventDate) {
        setCountdown("TBA");
        setShowDays(false);
        return;
      }

      const now = new Date();
      const timeDifference = eventDate.getTime() - now.getTime();

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        setCountdown(days.toString());
        setShowDays(true);
      } else {
        setCountdown("The Game Awards 2026 are happening right now!");
        setShowDays(false);
      }
    };

    calculateCountdown();
    const countdownInterval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(countdownInterval);
  }, [eventDate]);

  return (
    <main className="bg-zinc-950 flex flex-col justify-center items-center w-full min-h-screen overflow-x-hidden relative px-4 sm:px-8 py-8">

      {/* Subtle Background Accent - Steam Style */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 100%, rgba(234, 88, 12, 0.08) 0%, transparent 40%)"
        }}>
      </div>

      <div className="relative z-10 w-[94%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">

        {/* Left Hero Column - Brand, Event & CTA */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-5">
          <span className="text-orange-500 text-xs sm:text-sm font-bold font-montserrat uppercase tracking-[0.35em]">
            The Game Awards 2026
          </span>
          <h1 className="text-6xl sm:text-8xl lg:text-9xl xl:text-[10.5rem] font-black font-barlow text-white tracking-tighter leading-none uppercase select-none">
            Nomini
          </h1>
          <div className="w-24 h-1.5 bg-orange-600"></div>
          <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-medium font-barlow uppercase tracking-[0.25em] mt-1">
            December 10, 2026 • Peacock Theater, Los Angeles, CA
          </p>
          <div className="mt-4 sm:mt-6">
            <Link to={voteLink}>
              <ButtonComponent text="Vote Now" />
            </Link>
          </div>
        </div>

        {/* Right Hero Column - Countdown Display */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center lg:border-l lg:border-zinc-800/80 lg:pl-12 py-4">
          <h2
            className={`font-black font-barlow text-white tracking-tighter leading-none select-none tabular-nums opacity-90 text-center ${
              showDays || eventDate === undefined || eventDate === null
                ? "text-8xl sm:text-9xl lg:text-[11rem] xl:text-[13.5rem]"
                : "text-3xl sm:text-5xl lg:text-5xl uppercase max-w-xl"
            }`}
          >
            {eventDate === undefined ? "..." : countdown}
          </h2>

          <p className="text-zinc-500 text-base sm:text-lg xl:text-xl font-medium font-montserrat uppercase tracking-[0.4em] text-center mt-4">
            {eventDate === undefined ? "" : showDays ? "Days Until TGA 2026" : eventDate === null ? "Date not set" : "Live Now"}
          </p>
        </div>

      </div>
    </main>
  );
};

export default Home;
