import React from "react";

const UpcomingBirthdays = ({ birthdays, loading }) => {
    return (
        <div className="w-[90%] max-w-4xl h-[90%] bg-slate-800 rounded-lg p-4 shadow-lg flex flex-col">
            <h2 className="text-xl font-medium mb-2 text-cyan-300">
                Upcoming Birthdays This Month
            </h2>

            {!loading && (
                <p className="text-slate-400 mb-2">
                    Total Birthdays: {birthdays.length}
                </p>
            )}

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
                    <span>Loading birthdays...</span>
                </div>
            )}

            {!loading && birthdays.length === 0 && (
                <p className="text-slate-400">No upcoming birthdays this month.</p>
            )}

            {!loading && birthdays.length > 0 && (
                <ul className="grid grid-cols-1 gap-2 overflow-y-auto pr-2 flex-1 scrollbar-hide">
                    {birthdays
                        .slice()
                        .sort((a, b) => {
                            const dayA = new Date(a.dob).getDate();
                            const dayB = new Date(b.dob).getDate();
                            return dayA - dayB;
                        })
                        .map((emp) => (
                            <li
                                key={emp._id}
                                className="bg-slate-700 p-3 rounded flex flex-col md:flex-row md:items-center md:justify-between"
                            >
                                <div>
                                    <p className="text-cyan-200 font-medium">{emp.name}</p>
                                    <p className="text-slate-400 text-sm">
                                        DOB:{" "}
                                        {new Date(emp.dob).toLocaleDateString(undefined, {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                {emp.area && (
                                    <p className="text-slate-300 text-sm mt-1 md:mt-0">
                                        Area: {emp.area}
                                    </p>
                                )}
                            </li>
                        ))}

                </ul>
            )}
        </div>
    );
};

export default UpcomingBirthdays;
