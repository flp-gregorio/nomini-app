import { useState, useEffect } from "react";
import api from "../../lib/api";

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
        } catch (error: any) {
            console.error("Failed to set winner:", error);
            setMessage(error.response?.data?.message || "Failed to set winner");
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
        } catch (error: any) {
            console.error("Failed to set event date:", error);
            setEventMessage(error.response?.data?.message || "Failed to set event date");
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
        <div className="flex flex-col items-center w-full min-h-screen bg-neutral-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 font-cinzel text-yellow-500">
                Admin Panel
            </h1>

            {/* Winner feedback message */}
            {message && (
                <div className="mb-4 p-4 bg-blue-600 rounded text-white font-bold">
                    {message}
                </div>
            )}

            {/* ── Event Date Section ── */}
            <div className="w-full max-w-4xl mb-10">
                <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-yellow-600/30">
                    <h2 className="text-2xl font-bold mb-1 text-yellow-400">Event Settings</h2>
                    <p className="text-neutral-400 text-sm mb-5">
                        Current event date:{" "}
                        <span className="text-white font-semibold">
                            {formatEventDate(currentEventDate)}
                        </span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-2 text-neutral-300">
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

                    {eventMessage && (
                        <p className="mt-4 text-sm text-green-400 font-semibold">{eventMessage}</p>
                    )}
                </div>
            </div>

            {/* ── Winners Section ── */}
            <div className="w-full max-w-4xl grid gap-8">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                            {cat.title}
                        </h2>
                        <div className="grid gap-4">
                            {cat.nominees?.map((nominee) => (
                                <div
                                    key={nominee.id}
                                    className={`flex justify-between items-center p-3 rounded ${nominee.Winner
                                        ? "bg-green-900 border border-green-500"
                                        : "bg-neutral-700"
                                        }`}
                                >
                                    <span className="font-semibold">{nominee.name}</span>
                                    <div className="flex items-center gap-4">
                                        {nominee.Winner && (
                                            <span className="text-green-400 font-bold text-sm">
                                                WINNER
                                            </span>
                                        )}
                                        <button
                                            onClick={() =>
                                                handleSetWinner(cat.title, nominee.name)
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
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
        </div>
    );
};

export default Admin;
