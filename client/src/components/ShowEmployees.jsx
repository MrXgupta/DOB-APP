import Swal from "sweetalert2";

const ShowEmployees = ({
                           employees,
                           getEmployees,
                           loadingEmployees,
                           currentPage,
                           totalPages,
                       }) => {
    const fieldLabels = [
        { key: "sNo", label: "S.No" },
        { key: "name", label: "Name" },
        { key: "area", label: "Area" },
        { key: "hq", label: "HQ" },
        { key: "dob", label: "DOB" },
        { key: "communicationAddress", label: "Address" },
    ];

    const formatValue = (key, value) => {
        if (!value && value !== 0) return "NA";
        if (key === "dob") {
            return new Date(value).toLocaleDateString();
        }
        return value;
    };

    const handleDeleteAll = async () => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "This will delete ALL employees.",
            showCancelButton: true,
            confirmButtonText: "Yes, delete all",
        });
        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/delete-all`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: `${data.deletedCount} employees deleted.`,
            });
            getEmployees();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        }
    };

    const handleDeleteOne = async (id) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Delete this employee?",
            showCancelButton: true,
            confirmButtonText: "Delete",
        });
        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/delete-one`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: `Employee "${data.employee?.name || "record"}" deleted.`,
            });
            getEmployees();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        }
    };

    return (
        <section className="min-h-screen w-full flex flex-col items-center justify-start p-4 snap-start">
            <div className="w-full bg-slate-800 rounded-lg p-4 shadow-lg">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-medium text-cyan-300">Employee List</h2>
                    {employees.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="bg-red-500 hover:bg-red-600 text-slate-900 font-medium py-1 px-3 rounded transition text-sm"
                        >
                            Delete All
                        </button>
                    )}
                </div>

                {/* LOADING */}
                {loadingEmployees && (
                    <div className="flex items-center gap-2 text-cyan-400 mb-3">
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
                        <span>Loading employees...</span>
                    </div>
                )}

                {/* NO EMPLOYEES */}
                {!loadingEmployees && employees.length === 0 && (
                    <p className="text-slate-400">No employees found.</p>
                )}

                {/* EMPLOYEES */}
                {!loadingEmployees && employees.length > 0 && (
                    <>
                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm mb-4 table-fixed">
                                <thead>
                                <tr className="bg-slate-700 sticky top-0 z-10">
                                    {fieldLabels.map(({ label }) => (
                                        <th key={label} className="px-2 py-1 ">
                                            {label}
                                        </th>
                                    ))}
                                    <th className="px-2 py-1">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp._id} className="border-t border-slate-700">
                                        {fieldLabels.map(({ key }) => (
                                            <td key={key} className="px-2 py-1 text-center">
                                                {formatValue(key, emp[key])}
                                            </td>
                                        ))}
                                        <td className="px-2 py-1 text-center">
                                            <button
                                                onClick={() => handleDeleteOne(emp._id)}
                                                className="text-red-400 hover:text-red-500 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>


                        {/* PAGINATION */}
                        <div className="flex justify-center items-center gap-2 mt-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => getEmployees(currentPage - 1)}
                                className="px-3 py-1 text-sm rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => getEmployees(page)}
                                    className={`px-3 py-1 text-sm rounded ${
                                        page === currentPage
                                            ? "bg-cyan-500 text-slate-900 font-semibold"
                                            : "bg-slate-700 hover:bg-slate-600"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => getEmployees(currentPage + 1)}
                                className="px-3 py-1 text-sm rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default ShowEmployees;
