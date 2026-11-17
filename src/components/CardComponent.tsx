import React, { useEffect, useState } from "react";

interface CardComponentProps {
  nominee: string;
  aux?: string;
  genre?: string;
  background?: string;
  loading?: "eager" | "lazy";
  active: boolean;
  disabled?: boolean;
  setActiveCard: (nominee: string) => void;
}

const CardComponent: React.FC<CardComponentProps> = ({
  nominee,
  aux = "",
  genre = "",
  background,
  loading = "lazy",
  active,
  disabled = false,
  setActiveCard,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [background]);

  const hasArtwork = Boolean(background && !imageFailed);

  const handleCardClick = () => {
    if (disabled) return;
    setActiveCard(nominee);
  };

  return (
    <button
      type="button"
      onClick={handleCardClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={`${nominee}${aux ? `, ${aux}` : ""}${active ? " (Selected)" : ""}`}
      className={`group relative w-full aspect-[4/5] rounded-md overflow-hidden text-left bg-[#141416] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] ${
        disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"
      } ${
        active
          ? "border-2 border-[#FF641A] shadow-[0_0_24px_rgba(255,100,26,0.22)]"
          : "border border-zinc-800/90 hover:border-zinc-500/80"
      }`}
    >
      {/* Full-bleed Artwork or Restrained Editorial Fallback */}
      {hasArtwork ? (
        <img
          src={background}
          alt={nominee}
          loading={loading}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 ease-out ${
            !disabled ? "group-hover:scale-105 group-hover:brightness-110" : ""
          } ${active ? "scale-[1.02]" : ""}`}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#141416] flex flex-col items-center justify-center"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 35%, rgba(255, 100, 26, 0.08) 0%, transparent 68%)",
          }}
        >
          <svg
            className="w-12 h-12 text-zinc-700/60 mb-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="m16.585 21.058 1.83 4.15s-.57 4.072 0 8.145c.54 3.863 1.68 6.89 2.782 9.815.235.624.468 1.244.693 1.865 4.208 6.224 6.952 8.607 6.952 8.607l2.378 9.912 3.841 4.457v1.383h-1.83v1.537H31.22V77h17.56v-6.07h-2.012v-1.538h-1.83V68.01l3.842-4.457 2.378-9.912s2.744-2.383 6.952-8.607c.225-.622.458-1.241.693-1.865 1.101-2.924 2.241-5.952 2.782-9.815.57-4.073 0-8.145 0-8.145l1.83-4.15-8.781-2.766-3.476 2.305 1.28-4.226L40 3 27.56 16.37l1.28 4.227-3.475-2.305-8.78 2.766Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Readability Gradient Overlay */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-200 ${
          active
            ? "bg-gradient-to-t from-[#09090B] via-[#09090B]/55 to-[#FF641A]/10"
            : "bg-gradient-to-t from-[#09090B] via-[#09090B]/50 to-transparent"
        }`}
      />

      {/* Top-Right Selection Indicator */}
      <div
        aria-hidden="true"
        className={`absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all duration-200 ${
          active
            ? "bg-[#FF641A] text-white opacity-100 scale-100 shadow-lg"
            : "bg-[#09090B]/70 text-zinc-400 border border-zinc-700/70 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
        }`}
      >
        <svg
          className="w-3 h-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
        {active && <span>Selected</span>}
      </div>

      {/* Bottom Title & Metadata */}
      <div className="relative z-10 h-full w-full p-3.5 sm:p-4 flex flex-col justify-end">
        {genre && (
          <span className="text-[10px] font-montserrat font-semibold uppercase tracking-[0.16em] text-zinc-400 mb-1 truncate">
            {genre}
          </span>
        )}
        <h2 className="font-barlow font-bold uppercase tracking-tight text-[#F5F5F5] text-base sm:text-lg leading-tight line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {nominee}
        </h2>
        {aux && aux !== "NULL" && (
          <p className="mt-1 font-barlow text-xs font-medium text-zinc-400 truncate">
            {aux}
          </p>
        )}
      </div>

      {/* Bottom Orange Accent Line when Selected */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] bg-[#FF641A] z-20"
        />
      )}
    </button>
  );
};

export default CardComponent;
