const UploadCSV = ({loadingUpload, handleCSVUpload}) => {
    return (
        <>
            <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-4 shadow-lg">
                <h1 className="text-3xl font-semibold tracking-wide text-cyan-400 text-center">
                    Automated Birthday Reminder Tool
                </h1>
                <p className="text-slate-400 mt-2 text-center">
                    Upload employee data and manage birthday reminders effortlessly.
                </p>

                <h2 className="text-xl font-medium mb-3 mt-6 text-cyan-300">Upload CSV File</h2>
                {loadingUpload && (
                    <div className="flex items-center gap-2 text-cyan-400 mb-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                        </svg>
                        <span>Uploading CSV...</span>
                    </div>
                )}
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleCSVUpload(e.target.files[0])}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring focus:ring-cyan-500"
                />
                <p className="text-xs text-slate-400 mt-2">Please upload a CSV in the correct format.</p>
                <a
                    href="/example.csv"
                    download
                    className="inline-block mt-2 px-3 py-1 text-sm rounded bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium transition"
                >
                    Download Sample CSV
                </a>

            </div>
        </>
    )
}

export default UploadCSV;