import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent";
import api from "../../lib/api";

const Home = () => {
  const [countdown, setCountdown] = useState("");
  const [showDays, setShowDays] = useState(false);
  const [voteLink, setVoteLink] = useState("/nominees");
  const [eventDate, setEventDate] = useState<Date | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setVoteLink(token ? "/nominees" : "/login");

    // Fetch event date from backend
    api.get<{ eventDate: string | null }>("/event")
      .then(res => {
        setEventDate(res.data.eventDate ? new Date(res.data.eventDate) : null);
      })
      .catch(() => {
        // Fall back to a hardcoded date if the API is unreachable
        setEventDate(new Date("2026-12-11T23:00:00.000Z"));
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
        setCountdown("The Game Awards are happening right now!");
        setShowDays(false);
      }
    };

    calculateCountdown();
    const countdownInterval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(countdownInterval);
  }, [eventDate]);

  return (
    <div className="bg-zinc-950 flex flex-col justify-center items-center w-screen h-screen overflow-hidden relative">

      {/* Subtle Background Accent - Steam Style */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 100%, rgba(234, 88, 12, 0.08) 0%, transparent 40%)"
        }}>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-16">

        {/* Main Title - Massive & Clean */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black font-barlow text-white tracking-tighter leading-none uppercase text-center select-none">
            Nomini
          </h1>
          <div className="w-24 h-1.5 bg-orange-600"></div>
        </div>

        {/* Countdown Section */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-black text-8xl sm:text-9xl md:text-[12rem] font-barlow text-white tracking-tighter leading-none select-none tabular-nums opacity-90">
            {eventDate === undefined ? "..." : countdown}
          </h2>

          <p className="text-zinc-500 text-lg sm:text-xl font-medium font-montserrat uppercase tracking-[0.4em]">
            {eventDate === undefined ? "" : showDays ? "Days Remaining" : eventDate === null ? "Date not set" : "Live Now"}
          </p>
        </div>

        <div className="mt-4 sm:mt-8">
          <Link to={voteLink}>
            <ButtonComponent text="Vote Now" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
