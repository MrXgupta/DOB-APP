const csv = require("csv-parser");
const fs = require("fs");
const Employee = require("../models/employee");

const uploadCSV = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    console.log(req.file)

    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
            // console.log(row);
            // process.exit();

            // If the row is completely empty, skip it
            if (Object.values(row).every((val) => val === "" || val === undefined || val === null)) {
                return;
            }

            // Optionally, also skip rows with no Employee Name or Code
            if (!row["Employee Name_correct"] && !row["CODE"]) {
                return;
            }

            // Helper functions
            const toNumberOrNull = (val) => {
                const num = parseFloat(val);
                return isNaN(num) ? null : num;
            };

            const toDateOrNull = (val) => {
                if (!val) return null;
                const parts = val.split("/");
                if (parts.length === 3) {
                    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                }
                const date = new Date(val);
                return isNaN(date.getTime()) ? null : date;
            };

            const genderVal = (val) => {
                const v = String(val).toUpperCase();
                return v === "M" || v === "F" ? v : undefined;
            };

            results.push({
                sNo: toNumberOrNull(row["S.NO"]),
                code: row["CODE"] || "",
                name: row["Employee Name_correct"] || "",
                gender: genderVal(row["M/F"]),
                doj: toDateOrNull(row["DOJ"]),
                designation: row["Designation"] || "",
                area: row["Area"] || "",
                hq: row["HQ"] || "",
                ctc: toNumberOrNull(row["CTC (Salary)"]),
                pfDeduction: toNumberOrNull(row["PF Deduction"]),
                esiDeduction: toNumberOrNull(row["ESI Deduction"]),
                dob: toDateOrNull(row["DOB (DD/MM/YYYY)"]),
                bloodGroup: row["BLOOD GROUP"] || "",
                aadhaarNo: row["AADHAAR NO"] || "",
                panCard: row["PAN CARD"] || "",
                mobileNo: row["MOBILE NO"] || "",
                communicationAddress: row["Communication Address"] || "",
                modeOfPayment: row["Mode of Pmt"] || "",
                bank: row["BANK"] || "",
                ifscCode: row["IFSC CODE"] || "",
                beneficiaryAccountNo: row["BENEFICARY ACCOUNT NO"] || "",
                beneficiaryName: row["BENEFICARY NAME"] || "",
                branchAddress: row["BRANCH ADDRESS"] || "",
                da: toNumberOrNull(row["D.A"]),
                ta: toNumberOrNull(row["T.A"]),
                nightAllowance: toNumberOrNull(row["NIGHT"]),
                officeMobile: row["MOBILE"] || "",
            });
        })
        .on("end", async () => {
            try {
                const inserted = await Employee.insertMany(results);
                fs.unlinkSync(req.file.path);
                res.json({ inserted: inserted.length, employees: inserted });
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        })
        .on("error", (err) => {
            res.status(500).json({ message: "CSV parsing error: " + err.message });
        });
};

module.exports = uploadCSV;