import { useState, useEffect } from "react";
import api from "../../lib/api";
import AdminArtworkManager from "../../components/AdminArtworkManager";

type JsonNominee = {
    id: string;
    name: string;
    Winner: boolean;
};

type JsonCategory = {
    id: number;
    title: string;
    nominees: JsonNominee[];
};

const Admin = () => {
    const [categories, setCategories] = useState<JsonCategory[]>([]);
    const [activeTab, setActiveTab] = useState<"event" | "artwork">("event");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading

    // Event date state
    const [currentEventDate, setCurrentEventDate] = useState<string | null>(null);
    const [newEventDate, setNewEventDate] = useState("");
    const [eventMessage, setEventMessage] = useState("");
    const [isEventLoading, setIsEventLoading] = useState(false);

    useEffect(() => {
        checkAdmin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAdmin = async () => {
        try {
            const res = await api.get<{ username: string; email: string; admin: boolean }>("/auth/me");
            if (res.data.admin) {
                setIsAdmin(true);
                fetchData();
                fetchEventDate();
            } else {
                setIsAdmin(false);
            }
        } catch {
            setIsAdmin(false);
        }
    };

    const fetchEventDate = async () => {
        try {
            const res = await api.get<{ eventDate: string | null }>("/event");
            setCurrentEventDate(res.data.eventDate);
        } catch (error) {
            console.error("Failed to load event date:", error);
        }
    };

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
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetWinner = async (category: string, nominee: string) => {
        try {
            const res = await api.post("/categories/winner", {
                category,
                nominee,
            });
            setMessage(res.data.message);
            fetchData();
        } catch (error) {
            console.error("Failed to set winner:", error);
            const err = error as { response?: { data?: { message?: string } } };
            setMessage(err.response?.data?.message || "Failed to set winner");
        }
    };

    const handleSetEventDate = async (dateValue: string | null) => {
        setIsEventLoading(true);
        setEventMessage("");
        try {
            const res = await api.post("/event", {
                eventDate: dateValue,
            });
            setEventMessage(res.data.message);
            setCurrentEventDate(res.data.eventDate ?? null);
            setNewEventDate("");
        } catch (error) {
            console.error("Failed to set event date:", error);
            const err = error as { response?: { data?: { message?: string } } };
            setEventMessage(err.response?.data?.message || "Failed to set event date");
        } finally {
            setIsEventLoading(false);
        }
    };

    const formatEventDate = (isoDate: string | null) => {
        if (!isoDate) return "TBA";
        return new Date(isoDate).toLocaleString(undefined, {
            dateStyle: "long",
            timeStyle: "short",
        });
    };

    // Loading state
    if (isAdmin === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neutral-900">
                <div className="text-white text-xl font-barlow animate-pulse">Checking access...</div>
            </div>
        );
    }

    // Not admin
    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 gap-4">
                <h1 className="text-4xl font-bold text-red-500 font-barlow">Access Denied</h1>
                <p className="text-zinc-400 font-barlow">You do not have admin privileges.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neutral-900">
                <div className="text-white text-xl font-barlow animate-pulse">Loading admin data...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-neutral-900 text-white px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-[94%] max-w-[1800px] mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-yellow-500">
                            Admin Panel
                        </h1>
                        <p className="text-neutral-400 font-barlow uppercase tracking-widest text-sm mt-1">
                            The Game Awards 2026 • December 10, 2026 • Peacock Theater, Los Angeles
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("event")}
                            className={`px-4 py-2 rounded font-barlow font-bold text-sm uppercase tracking-wider transition-colors ${
                                activeTab === "event"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-neutral-800 text-neutral-400 hover:text-white"
                            }`}
                        >
                            Event &amp; Winners
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("artwork")}
                            className={`px-4 py-2 rounded font-barlow font-bold text-sm uppercase tracking-wider transition-colors ${
                                activeTab === "artwork"
                                    ? "bg-orange-600 text-white"
                                    : "bg-neutral-800 text-neutral-400 hover:text-white"
                            }`}
                        >
                            Artwork Manager
                        </button>
                    </div>
                </div>

                {activeTab === "artwork" ? (
                    <AdminArtworkManager />
                ) : (
                <>

                {/* Winner feedback message */}
                {message && (
                    <div className="mb-6 p-4 bg-blue-600 rounded text-white font-bold">
                        {message}
                    </div>
                )}

                {/* ── Event Date Section ── */}
                <div className="w-full mb-8">
                    <div className="bg-neutral-800 p-5 sm:p-6 rounded-lg shadow-lg border border-yellow-600/30 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-1 text-yellow-400">Event Settings (TGA 2026)</h2>
                            <p className="text-neutral-400 text-sm">
                                Current event date:{" "}
                                <span className="text-white font-semibold">
                                    {formatEventDate(currentEventDate)}
                                </span>
                            </p>
                            {eventMessage && (
                                <p className="mt-2 text-sm text-green-400 font-semibold">{eventMessage}</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end lg:w-1/2">
                            <div className="flex-1">
                                <label className="block text-sm font-bold mb-1.5 text-neutral-300">
                                    New Event Date &amp; Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                    className="w-full py-2 px-3 rounded bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:border-yellow-500"
                                />
                            </div>
                            <button
                                onClick={() => handleSetEventDate(newEventDate || null)}
                                disabled={isEventLoading || !newEventDate}
                                className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-5 rounded transition-colors"
                            >
                                {isEventLoading ? "Saving..." : "Set Date"}
                            </button>
                            <button
                                onClick={() => handleSetEventDate(null)}
                                disabled={isEventLoading}
                                className="bg-neutral-600 hover:bg-neutral-500 disabled:opacity-50 text-white font-bold py-2 px-5 rounded transition-colors"
                            >
                                Set as TBA
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Winners Section ── */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-neutral-800 p-5 rounded-lg shadow-lg flex flex-col">
                            <h2 className="text-xl font-bold mb-4 text-yellow-400 border-b border-neutral-700 pb-2">
                                {cat.title}
                            </h2>
                            <div className="grid gap-2.5">
                                {cat.nominees?.map((nominee) => (
                                    <div
                                        key={nominee.id}
                                        className={`flex justify-between items-center gap-3 p-3 rounded ${nominee.Winner
                                            ? "bg-green-900 border border-green-500"
                                            : "bg-neutral-700"
                                            }`}
                                    >
                                        <span className="font-semibold text-sm truncate">{nominee.name}</span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {nominee.Winner && (
                                                <span className="text-green-400 font-bold text-xs">
                                                    WINNER
                                                </span>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleSetWinner(cat.title, nominee.name)
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                                            >
                                                Set Winner
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                </>
                )}
            </div>
        </div>
    );
};

export default Admin;
