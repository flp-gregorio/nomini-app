import { useState, useEffect } from "react";
import api from "../../lib/api";


type JsonNominee = {
    id: string; // The backend returns 'id' which is the nominee name
    name: string; // The backend returns 'name'
    Winner: boolean;
};

type JsonCategory = {
    id: number;
    title: string;
    nominees: JsonNominee[];
};

const Admin = () => {
    const [categories, setCategories] = useState<JsonCategory[]>([]);
    const [adminKey, setAdminKey] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

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
        if (!adminKey) {
            alert("Please enter the Admin Key");
            return;
        }

        try {
            const res = await api.post("/categories/winner", {
                category,
                nominee,
                adminKey,
            });
            setMessage(res.data.message);
            // Refresh data to show updated winner status
            fetchData();
        } catch (error: any) {
            console.error("Failed to set winner:", error);
            setMessage(error.response?.data?.message || "Failed to set winner");
        }
    };

    if (isLoading) {
        return <div className="text-white text-center mt-20">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-neutral-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 font-cinzel text-yellow-500">
                Admin Panel
            </h1>

            <div className="mb-8 w-full max-w-md">
                <label className="block text-sm font-bold mb-2">Admin Key</label>
                <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter Admin Key"
                />
            </div>

            {message && (
                <div className="mb-4 p-4 bg-blue-600 rounded text-white font-bold">
                    {message}
                </div>
            )}

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
