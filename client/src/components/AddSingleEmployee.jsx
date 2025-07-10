const AddSingleEmployee = ({ handleAddEmployee }) => {
    return (
        <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-4 mt-6 shadow-lg">
            <h2 className="text-xl font-medium mb-3 text-cyan-300">Add Single Employee</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleAddEmployee}>
                <input
                    type="number"
                    name="sNo"
                    placeholder="S. No."
                    className="p-2 bg-slate-700 border border-slate-600 rounded"
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Employee Name"
                    className="p-2 bg-slate-700 border border-slate-600 rounded"
                    required
                />
                <input
                    type="text"
                    name="area"
                    placeholder="Area"
                    className="p-2 bg-slate-700 border border-slate-600 rounded"
                />
                <input
                    type="text"
                    name="hq"
                    placeholder="HQ"
                    className="p-2 bg-slate-700 border border-slate-600 rounded"
                />
                <input
                    type="date"
                    name="dob"
                    className="p-2 bg-slate-700 border border-slate-600 rounded"
                />
                <input
                    type="text"
                    name="communicationAddress"
                    placeholder="Communication Address"
                    className="p-2 bg-slate-700 border border-slate-600 rounded md:col-span-2"
                />
                <button
                    type="submit"
                    className="col-span-1 md:col-span-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium py-2 rounded transition"
                >
                    Add Employee
                </button>
            </form>
        </div>
    );
};

export default AddSingleEmployee;
