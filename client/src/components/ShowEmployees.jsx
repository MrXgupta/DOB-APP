import Swal from "sweetalert2";
const ShowEmployees = ({employees, getEmployees, loadingEmployees, currentPage, totalPages}) => {

    const fieldLabels = [
        { key: "sNo", label: "S.No" },
        { key: "code", label: "Code" },
        { key: "name", label: "Name" },
        { key: "gender", label: "Gender" },
        { key: "doj", label: "DOJ" },
        { key: "designation", label: "Designation" },
        { key: "area", label: "Area" },
        { key: "hq", label: "HQ" },
        { key: "ctc", label: "CTC" },
        { key: "pfDeduction", label: "PF Deduction" },
        { key: "esiDeduction", label: "ESI Deduction" },
        { key: "dob", label: "DOB" },
        { key: "bloodGroup", label: "Blood Group" },
        { key: "aadhaarNo", label: "Aadhaar" },
        { key: "panCard", label: "PAN" },
        { key: "mobileNo", label: "Mobile No" },
        { key: "officeMobile", label: "Office Mobile" },
        { key: "communicationAddress", label: "Address" },
        { key: "modeOfPayment", label: "Mode of Payment" },
        { key: "bank", label: "Bank" },
        { key: "ifscCode", label: "IFSC" },
        { key: "beneficiaryAccountNo", label: "Account No" },
        { key: "beneficiaryName", label: "Beneficiary Name" },
        { key: "branchAddress", label: "Branch" },
        { key: "da", label: "DA" },
        { key: "ta", label: "TA" },
        { key: "nightAllowance", label: "Night Allowance" },
    ];

    const formatValue = (key, value) => {
        if (!value && value !== 0) return "NA";
        if (["dob", "doj"].includes(key)) {
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
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/delete-all`, { method: "DELETE" });
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

    return(
        <>
            <section className="min-h-screen w-full flex flex-col items-center justify-start p-4 snap-start">
                <div className="w-full bg-slate-800 rounded-lg p-4 shadow-lg">
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

                    {loadingEmployees && (
                        <div className="flex items-center gap-2 text-cyan-400 mb-3">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                            <span>Loading employees...</span>
                        </div>
                    )}

                    {!loadingEmployees && employees.length === 0 && (
                        <p className="text-slate-400">No employees found.</p>
                    )}

                    {!loadingEmployees && employees.length > 0 && (
                        <>
                            {/* TABLE */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm mb-4">
                                    <thead>
                                    <tr className="bg-slate-700 sticky top-0 z-10">
                                        <th className="px-2 py-1">Action</th>
                                        {fieldLabels.map(({ label }) => (
                                            <th key={label} className="px-2 py-1">{label}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {employees.map((emp) => (
                                        <tr key={emp._id || emp.code} className="border-t border-slate-700">
                                            <td className="px-2 py-1">
                                                <button
                                                    onClick={() => handleDeleteOne(emp._id)}
                                                    className="text-red-400 hover:text-red-500 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                            {fieldLabels.map(({ key }) => (
                                                <td key={key} className="px-2 py-1">{formatValue(key, emp[key])}</td>
                                            ))}
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
        </>
    )
}

export default ShowEmployees;