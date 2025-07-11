import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ShowEmployees from "./components/ShowEmployees";
import AddSingleEmployee from "./components/AddSingleEmployee.jsx";
import UploadCSV from "./components/UploadCSV.jsx";
import UpcomingBirthdays from "./components/UpcomingBirthdays.jsx";

export default function App() {
    const [employees, setEmployees] = useState([]);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const [loadingUpcoming, setLoadingUpcoming] = useState(false);

    const pageSize = 10;


    const getUpcomingBirthdays = async () => {
        setLoadingUpcoming(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/upcoming-birthdays`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch failed");
            setUpcomingBirthdays(data.birthdays || []);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        } finally {
            setLoadingUpcoming(false);
        }
    };


    const handleCSVUpload = async (file) => {
        if (!file) return;
        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            return Swal.fire({ icon: "error", title: "Invalid File", text: "Upload a valid CSV file." });
        }
        setLoadingUpload(true)
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/upload-csv`, { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Upload failed");
            Swal.fire({ icon: "success", title: "Uploaded", text: `${data.inserted} employees added.` });
            getEmployees();
        } catch (err) {
            Swal.fire({ icon: "error", title: "Upload Failed", text: err.message });
        } finally {
            setLoadingUpload(false);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        const form = e.target;
        const payload = {
            sNo: form.sNo.value.trim() ? Number(form.sNo.value.trim()) : null,
            name: form.name.value.trim(),
            area: form.area.value.trim(),
            hq: form.hq.value.trim(),
            dob: form.dob.value,
            communicationAddress: form.communicationAddress.value.trim(),
        };
        if (!payload.name) {
            return Swal.fire({ icon: "warning", title: "Missing Fields", text: "Name is required." });
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/add-employee`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Save failed");
            Swal.fire({ icon: "success", title: "Employee Added", text: `Employee ${data.employee.name} saved.` });
            form.reset();
            getEmployees();
        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: err.message });
        }
    };

    const getEmployees = async (page = 1) => {
        setLoadingEmployees(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/getEmployee?page=${page}&limit=${pageSize}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch failed");

            setEmployees(data.data || []);
            setTotalPages(Math.ceil((data.totalCount || 0) / pageSize));
            setCurrentPage(page);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        } finally {
            setLoadingEmployees(false);
        }
    };

    useEffect(() => {
        getEmployees();
        getUpcomingBirthdays();
    }, []);

    return (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-slate-900 text-slate-100">
            {/* Upload & Add */}
            <section className="min-h-screen w-full flex flex-col items-center justify-center p-4 snap-start">
                <UploadCSV
                    loadingUpload={loadingUpload}
                    handleCSVUpload={handleCSVUpload}
                />
                <AddSingleEmployee handleAddEmployee={handleAddEmployee} />
            </section>

            {/* Upcoming Birthdays */}
            <section className="h-screen w-full flex items-center justify-center p-4 snap-start">
                <UpcomingBirthdays birthdays={upcomingBirthdays} loading={loadingUpcoming} />
            </section>



            {/* Employee List */}
            <section className="min-h-screen w-full flex flex-col items-center justify-center p-4 snap-start">
                <ShowEmployees
                    employees={employees}
                    getEmployees={getEmployees}
                    loadingEmployees={loadingEmployees}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                />
            </section>
        </div>

    );
}