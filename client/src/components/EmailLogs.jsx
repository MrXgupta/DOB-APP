import { useEffect, useState } from "react";

const EmailLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRecent, setShowRecent] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [showRecent]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/email-logs?recent=${showRecent ? "true" : "false"}`
            );
            const data = await res.json();
            setLogs(data.logs);
        } catch (err) {
            console.error("Error fetching logs:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[90%] max-w-4xl h-[90%] bg-slate-800 rounded-lg p-4 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-cyan-300">
                    Email Logs {showRecent && "(Last 7 Days)"}
                </h2>
                <button
                    onClick={() => setShowRecent(!showRecent)}
                    className="text-sm bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded"
                >
                    {showRecent ? "Show All" : "Show Recent"}
                </button>
            </div>

            {loading && (
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                    </svg>
                    <span>Loading logs...</span>
                </div>
            )}

            {!loading && logs.length === 0 && (
                <p className="text-slate-400">No logs found.</p>
            )}

            {!loading && logs.length > 0 && (
                <ul className="grid grid-cols-1 gap-2 overflow-y-auto pr-2 flex-1 scrollbar-hide">
                    {logs.map((log) => (
                        <li
                            key={log._id}
                            className="bg-slate-700 p-3 rounded"
                        >
                            <p className="text-cyan-200 font-medium">
                                {new Date(log.sentAt).toLocaleString()}
                            </p>
                            <p className="text-slate-400 text-sm mb-2">
                                Subject: {log.subject}
                            </p>
                            <ul className="space-y-1">
                                {log.recipients.map((r, idx) => (
                                    <li
                                        key={idx}
                                        className={`text-sm ${
                                            r.status === "success"
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        🎂 {r.name} ({r.birthdayType}) — {r.status}
                                        {r.errorMessage && (
                                            <span className="block text-xs text-red-300">
                        Error: {r.errorMessage}
                      </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmailLogs;