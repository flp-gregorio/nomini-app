import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { NomineeArtwork } from "../@types/NomineeType";

type AdminNomineeItem = {
  name: string;
  publisher: string | null;
  genre: string | null;
  existingLocalImage: string | null;
  categories: string[];
  artwork: (NomineeArtwork & { updatedAt?: string }) | null;
};

type ArtworkCandidate = {
  provider: string;
  providerGameId: number;
  imageId: number | null;
  imageUrl: string;
  thumbUrl?: string;
  type: "grid" | "hero" | "logo" | "manual";
  width: number | null;
  height: number | null;
  style?: string | null;
  isPortrait?: boolean;
  gameName?: string;
};

type GameSuggestion = {
  id: number;
  name: string;
  releaseDate: number | null;
  verified: boolean;
  matchScore: number;
  matchConfidence: "exact" | "high" | "review" | "none";
};

type DiscoveryResult = {
  name: string;
  status: "matched" | "needs_review" | "not_found" | "error";
  error?: string;
  matchConfidence: "exact" | "high" | "review" | "none";
  matchedGame: GameSuggestion | null;
  suggestions: GameSuggestion[];
  candidates: {
    grids: ArtworkCandidate[];
    heroes: ArtworkCandidate[];
    logos: ArtworkCandidate[];
    igdb: ArtworkCandidate[];
  };
  recommendedCandidate: ArtworkCandidate | null;
};

type AssetTab = "grids" | "heroes" | "logos" | "igdb";
type FilterMode = "all" | "pending" | "approved" | "review";

const AdminArtworkManager = () => {
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [nominees, setNominees] = useState<AdminNomineeItem[]>([]);
  const [discoveryByTitle, setDiscoveryByTitle] = useState<
    Record<string, DiscoveryResult>
  >({});
  const [activeAssetTab, setActiveAssetTab] = useState<
    Record<string, AssetTab>
  >({});
  const [customQueries, setCustomQueries] = useState<Record<string, string>>(
    {}
  );
  const [manualUrls, setManualUrls] = useState<Record<string, string>>({});

  const [steamGridConfigured, setSteamGridConfigured] = useState<boolean | null>(
    null
  );
  const [igdbConfigured, setIgdbConfigured] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isDiscoveringAll, setIsDiscoveringAll] = useState(false);
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [busyItems, setBusyItems] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [searchText, setSearchText] = useState("");

  const loadNominees = useCallback(async (year?: number | null) => {
    setIsLoading(true);
    try {
      const url = year ? `/artwork/nominees?year=${year}` : "/artwork/nominees";
      const { data } = await api.get<{
        year: number;
        nominees: AdminNomineeItem[];
      }>(url);
      setNominees(data.nominees);
      if (!year) setSelectedYear(data.year);
    } catch (err) {
      console.error("Failed to load artwork nominees:", err);
      setStatusMessage({
        type: "error",
        text: "Failed to load nominees for artwork management.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const [statusRes, yearsRes] = await Promise.all([
          api.get<{ steamGridDbConfigured: boolean; igdbConfigured: boolean }>(
            "/artwork/status"
          ),
          api.get<number[]>("/categories/years"),
        ]);
        setSteamGridConfigured(statusRes.data.steamGridDbConfigured);
        setIgdbConfigured(statusRes.data.igdbConfigured);
        setYears(yearsRes.data);
        const latestYear = yearsRes.data[0] ?? null;
        setSelectedYear(latestYear);
        await loadNominees(latestYear);
      } catch (err) {
        console.error("Failed to initialize Artwork Manager:", err);
        setIsLoading(false);
      }
    };
    init();
  }, [loadNominees]);

  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
    setDiscoveryByTitle({});
    setStatusMessage(null);
    await loadNominees(year);
  };

  const setItemBusy = (name: string, value: boolean) => {
    setBusyItems((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscoverMissing = async (forceRefresh = false) => {
    setIsDiscoveringAll(true);
    setStatusMessage(null);
    try {
      const { data } = await api.post<{
        results: DiscoveryResult[];
        meta: {
          totalUnique: number;
          processed: number;
          skippedExisting: number;
          errors: number;
        };
      }>("/artwork/discover", {
        year: selectedYear,
        forceRefresh,
      });

      setDiscoveryByTitle((prev) => {
        const next = { ...prev };
        for (const item of data.results) {
          next[item.name] = item;
        }
        return next;
      });

      setStatusMessage({
        type: "success",
        text: `Discovered artwork for ${data.meta.processed} nominees (${data.meta.skippedExisting} already approved, ${data.meta.errors} errors).`,
      });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setStatusMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Artwork discovery failed. Check backend SteamGridDB configuration.",
      });
    } finally {
      setIsDiscoveringAll(false);
    }
  };

  const handleDiscoverSingle = async (name: string, queryOverride?: string) => {
    setItemBusy(name, true);
    setStatusMessage(null);
    try {
      const query = (queryOverride ?? customQueries[name] ?? name).trim();
      if (!query) return;

      const { data } = await api.get<DiscoveryResult>(
        `/artwork/search?query=${encodeURIComponent(query)}&forceRefresh=true`
      );

      setDiscoveryByTitle((prev) => ({
        ...prev,
        [name]: { ...data, name },
      }));
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || `Search failed for "${name}".`,
      });
    } finally {
      setItemBusy(name, false);
    }
  };

  const handleSwitchMatchedGame = async (
    nomineeName: string,
    suggestion: GameSuggestion
  ) => {
    setItemBusy(nomineeName, true);
    try {
      const { data } = await api.get<{
        gameId: number;
        candidates: DiscoveryResult["candidates"];
      }>(`/artwork/game/${suggestion.id}/assets`);

      setDiscoveryByTitle((prev) => {
        const current = prev[nomineeName];
        return {
          ...prev,
          [nomineeName]: {
            name: nomineeName,
            status: "matched",
            matchConfidence: suggestion.matchConfidence,
            matchedGame: suggestion,
            suggestions: current?.suggestions ?? [suggestion],
            candidates: {
              grids: data.candidates.grids ?? [],
              heroes: data.candidates.heroes ?? [],
              logos: data.candidates.logos ?? [],
              igdb: current?.candidates?.igdb ?? [],
            },
            recommendedCandidate: data.candidates.grids?.[0] ?? null,
          },
        };
      });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to load assets for game.",
      });
    } finally {
      setItemBusy(nomineeName, false);
    }
  };

  const handleSelectCandidate = async (
    nomineeName: string,
    candidate: {
      provider: string;
      providerGameId?: number | null;
      imageId?: number | null;
      imageUrl: string;
      type: string;
      width?: number | null;
      height?: number | null;
    }
  ) => {
    setItemBusy(nomineeName, true);
    try {
      const { data } = await api.put<{
        message: string;
        artwork: NomineeArtwork;
      }>("/artwork/select", {
        name: nomineeName,
        provider: candidate.provider,
        providerGameId: candidate.providerGameId ?? null,
        imageId: candidate.imageId ?? null,
        imageUrl: candidate.imageUrl,
        type: candidate.type,
        width: candidate.width ?? null,
        height: candidate.height ?? null,
      });

      setNominees((prev) =>
        prev.map((item) =>
          item.name === nomineeName ? { ...item, artwork: data.artwork } : item
        )
      );
      setStatusMessage({ type: "success", text: data.message });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to save artwork.",
      });
    } finally {
      setItemBusy(nomineeName, false);
    }
  };

  const handleClearArtwork = async (nomineeName: string) => {
    setItemBusy(nomineeName, true);
    try {
      await api.delete(`/artwork/${encodeURIComponent(nomineeName)}`);
      setNominees((prev) =>
        prev.map((item) =>
          item.name === nomineeName ? { ...item, artwork: null } : item
        )
      );
      setStatusMessage({
        type: "info",
        text: `Cleared saved artwork for ${nomineeName}.`,
      });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to clear artwork.",
      });
    } finally {
      setItemBusy(nomineeName, false);
    }
  };

  const exactApprovableItems = useMemo(() => {
    return nominees
      .filter((n) => !n.artwork?.imageUrl)
      .map((n) => {
        const disc = discoveryByTitle[n.name];
        if (
          disc &&
          disc.matchConfidence === "exact" &&
          disc.recommendedCandidate
        ) {
          return {
            name: n.name,
            ...disc.recommendedCandidate,
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [nominees, discoveryByTitle]);

  const handleBulkApproveExact = async () => {
    if (exactApprovableItems.length === 0) return;
    setIsBulkSaving(true);
    try {
      const { data } = await api.post<{
        message: string;
        artworks: Array<NomineeArtwork & { name: string }>;
      }>("/artwork/bulk-select", {
        items: exactApprovableItems,
      });

      const savedMap = new Map(data.artworks.map((a) => [a.name, a]));
      setNominees((prev) =>
        prev.map((n) => {
          const saved = savedMap.get(n.name);
          return saved ? { ...n, artwork: saved } : n;
        })
      );
      setStatusMessage({ type: "success", text: data.message });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Bulk approval failed.",
      });
    } finally {
      setIsBulkSaving(false);
    }
  };

  const filteredNominees = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return nominees.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      const disc = discoveryByTitle[item.name];
      if (filterMode === "approved") return Boolean(item.artwork?.imageUrl);
      if (filterMode === "pending") return !item.artwork?.imageUrl;
      if (filterMode === "review") {
        return (
          !item.artwork?.imageUrl &&
          disc &&
          (disc.status === "needs_review" || disc.status === "not_found")
        );
      }
      return true;
    });
  }, [nominees, searchText, filterMode, discoveryByTitle]);

  const approvedCount = nominees.filter((n) =>
    Boolean(n.artwork?.imageUrl)
  ).length;
  const pendingCount = nominees.length - approvedCount;

  return (
    <div className="space-y-6">
      {/* Provider Config Banner */}
      {steamGridConfigured === false && (
        <div className="p-4 rounded-md bg-amber-950/60 border border-amber-500/50 text-amber-200 text-sm">
          <p className="font-bold uppercase tracking-wider text-amber-400 mb-1">
            SteamGridDB API Key Required for Automated Discovery
          </p>
          <p>
            Add <code className="bg-black/40 px-1.5 py-0.5 rounded">STEAMGRIDDB_API_KEY</code> to{" "}
            <code className="bg-black/40 px-1.5 py-0.5 rounded">nomini-api/.env</code> and restart the API server. You can still assign manual fallback image URLs below.
          </p>
        </div>
      )}

      {/* Summary & Batch Controls */}
      <div className="bg-neutral-800/90 border border-neutral-700 rounded-lg p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-orange-400">
              Nominee Artwork Discovery &amp; Approval
            </h2>
            {steamGridConfigured && (
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold">
                SteamGridDB Connected
              </span>
            )}
            {igdbConfigured && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 border border-blue-500/40 text-blue-300 font-semibold">
                IGDB Fallback Ready
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-400">
            Unique titles: <strong className="text-white">{nominees.length}</strong>{" "}
            • Approved:{" "}
            <strong className="text-emerald-400">{approvedCount}</strong> •
            Pending: <strong className="text-amber-400">{pendingCount}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {years.length > 0 && (
            <select
              value={selectedYear ?? ""}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              aria-label="Filter by year"
              className="bg-neutral-900 border border-neutral-600 rounded px-3 py-2 text-sm text-white"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  TGA {y}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            disabled={isDiscoveringAll || steamGridConfigured === false}
            onClick={() => handleDiscoverMissing(false)}
            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded text-sm transition-colors"
          >
            {isDiscoveringAll
              ? "Discovering..."
              : "Discover Missing Artwork"}
          </button>

          {exactApprovableItems.length > 0 && (
            <button
              type="button"
              disabled={isBulkSaving}
              onClick={handleBulkApproveExact}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded text-sm transition-colors"
            >
              {isBulkSaving
                ? "Approving..."
                : `Approve ${exactApprovableItems.length} Exact Matches`}
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded border text-sm font-semibold ${
            statusMessage.type === "success"
              ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300"
              : statusMessage.type === "error"
              ? "bg-red-950/70 border-red-500/50 text-red-300"
              : "bg-neutral-800 border-neutral-600 text-neutral-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: `All (${nominees.length})` },
              { id: "pending", label: `Pending (${pendingCount})` },
              { id: "approved", label: `Approved (${approvedCount})` },
              { id: "review", label: "Needs Review" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                filterMode === tab.id
                  ? "bg-orange-600 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Filter nominees..."
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white placeholder-neutral-500 sm:w-64"
        />
      </div>

      {/* Nominee List */}
      {isLoading ? (
        <div className="py-16 text-center text-neutral-400 animate-pulse">
          Loading unique nominees...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNominees.map((item) => {
            const disc = discoveryByTitle[item.name];
            const isBusy = Boolean(busyItems[item.name]);
            const tab = activeAssetTab[item.name] ?? "grids";
            const currentCandidates = disc ? disc.candidates[tab] ?? [] : [];
            const activePreviewUrl =
              item.artwork?.imageUrl ?? item.existingLocalImage ?? null;

            return (
              <div
                key={item.name}
                className="bg-neutral-800/70 border border-neutral-700/80 rounded-lg p-4 sm:p-5 space-y-4"
              >
                <div className="flex flex-col lg:flex-row gap-5 justify-between">
                  {/* Left: Selected Artwork Preview + Nominee Info */}
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-24 shrink-0 rounded overflow-hidden bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                      {activePreviewUrl ? (
                        <img
                          src={activePreviewUrl}
                          alt={item.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-500 uppercase text-center px-1">
                          No Art
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-white">
                          {item.name}
                        </h3>
                        {item.artwork ? (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold uppercase">
                            {item.artwork.provider}
                            {item.artwork.width && item.artwork.height
                              ? ` • ${item.artwork.width}×${item.artwork.height}`
                              : ""}
                          </span>
                        ) : item.existingLocalImage ? (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-700 text-neutral-300">
                            Seeded Path
                          </span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-amber-900/40 border border-amber-500/30 text-amber-300">
                            Unassigned
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-400">
                        Categories ({item.categories.length}):{" "}
                        {item.categories.join(", ")}
                      </p>

                      {disc?.matchedGame && (
                        <p className="text-xs text-neutral-300">
                          Matched SteamGridDB:{" "}
                          <strong className="text-orange-400">
                            {disc.matchedGame.name}
                          </strong>{" "}
                          (ID {disc.matchedGame.id}) • Confidence:{" "}
                          <span className="uppercase font-semibold">
                            {disc.matchConfidence}
                          </span>
                        </p>
                      )}
                      {disc?.status === "not_found" && (
                        <p className="text-xs text-amber-400">
                          No confident SteamGridDB match found. Try a custom search or manual URL below.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Per-Nominee Search & Actions */}
                  <div className="flex flex-col gap-2 lg:items-end shrink-0">
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={customQueries[item.name] ?? item.name}
                        onChange={(e) =>
                          setCustomQueries((prev) => ({
                            ...prev,
                            [item.name]: e.target.value,
                          }))
                        }
                        aria-label={`Search SteamGridDB for ${item.name}`}
                        className="bg-neutral-900 border border-neutral-600 rounded px-2.5 py-1.5 text-xs text-white w-48"
                      />
                      <button
                        type="button"
                        disabled={isBusy || steamGridConfigured === false}
                        onClick={() => handleDiscoverSingle(item.name)}
                        className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors"
                      >
                        {isBusy ? "Searching..." : "Search SteamGridDB"}
                      </button>
                      {item.artwork && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleClearArtwork(item.name)}
                          className="bg-neutral-700 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Manual Fallback URL */}
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="url"
                        value={manualUrls[item.name] ?? ""}
                        onChange={(e) =>
                          setManualUrls((prev) => ({
                            ...prev,
                            [item.name]: e.target.value,
                          }))
                        }
                        placeholder="Manual fallback image URL (https://...)"
                        className="bg-neutral-900 border border-neutral-600 rounded px-2.5 py-1.5 text-xs text-white w-56"
                      />
                      <button
                        type="button"
                        disabled={isBusy || !(manualUrls[item.name] || "").trim()}
                        onClick={() =>
                          handleSelectCandidate(item.name, {
                            provider: "manual",
                            imageUrl: manualUrls[item.name].trim(),
                            type: "manual",
                          })
                        }
                        className="bg-neutral-700 hover:bg-neutral-600 disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors"
                      >
                        Set URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alternate Game Match Suggestions */}
                {disc && disc.suggestions.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-700/60">
                    <span className="text-xs text-neutral-400">
                      Other matches:
                    </span>
                    {disc.suggestions.map((sug) => (
                      <button
                        key={sug.id}
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleSwitchMatchedGame(item.name, sug)}
                        className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                          disc.matchedGame?.id === sug.id
                            ? "border-orange-500 bg-orange-500/20 text-orange-300"
                            : "border-neutral-600 bg-neutral-900 text-neutral-300 hover:border-neutral-400"
                        }`}
                      >
                        {sug.name} ({sug.matchScore}%)
                      </button>
                    ))}
                  </div>
                )}

                {/* Candidate Previews */}
                {disc && (
                  <div className="pt-2 border-t border-neutral-700/60 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          {
                            id: "grids",
                            label: `Grids (${disc.candidates.grids.length})`,
                          },
                          {
                            id: "heroes",
                            label: `Heroes (${disc.candidates.heroes.length})`,
                          },
                          {
                            id: "logos",
                            label: `Logos (${disc.candidates.logos.length})`,
                          },
                          ...(disc.candidates.igdb.length > 0
                            ? [
                                {
                                  id: "igdb" as const,
                                  label: `IGDB (${disc.candidates.igdb.length})`,
                                },
                              ]
                            : []),
                        ] as const
                      ).map((assetTab) => (
                        <button
                          key={assetTab.id}
                          type="button"
                          onClick={() =>
                            setActiveAssetTab((prev) => ({
                              ...prev,
                              [item.name]: assetTab.id,
                            }))
                          }
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                            tab === assetTab.id
                              ? "bg-orange-600 text-white"
                              : "bg-neutral-900 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {assetTab.label}
                        </button>
                      ))}
                    </div>

                    {currentCandidates.length === 0 ? (
                      <p className="text-xs text-neutral-500">
                        No {tab} candidates returned for this match.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {currentCandidates.map((cand, idx) => {
                          const isSelected =
                            item.artwork?.imageUrl === cand.imageUrl;
                          return (
                            <button
                              key={`${cand.provider}-${cand.imageId ?? idx}`}
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                handleSelectCandidate(item.name, cand)
                              }
                              className={`group relative rounded overflow-hidden border text-left bg-neutral-900 transition-all ${
                                isSelected
                                  ? "border-2 border-orange-500 ring-2 ring-orange-500/30"
                                  : "border-neutral-700 hover:border-orange-400"
                              }`}
                            >
                              <div className="aspect-[2/3] w-full bg-black overflow-hidden">
                                <img
                                  src={cand.thumbUrl || cand.imageUrl}
                                  alt={`${item.name} candidate ${idx + 1}`}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="px-2 py-1 text-[10px] text-neutral-300 flex justify-between items-center bg-neutral-950/90">
                                <span>
                                  {cand.width && cand.height
                                    ? `${cand.width}×${cand.height}`
                                    : cand.type}
                                </span>
                                {isSelected && (
                                  <span className="text-orange-400 font-bold">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminArtworkManager;
