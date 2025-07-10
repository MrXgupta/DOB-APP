const csv = require("csv-parser");
const fs = require("fs");
const Employee = require("../models/employee");

const uploadCSV = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv({
            mapHeaders: ({ header }) => header.trim()
        }))
        .on("data", (row) => {
            if (Object.values(row).every((val) => !val || val === "")) {
                return;
            }

            if (!row["Employee Name_correct"]) {
                return;
            }

            const parseDOB = (val) => {
                if (!val) return null;

                if (typeof val === "number") {
                    // Excel date serial number
                    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
                    return new Date(excelEpoch.getTime() + val * 86400000);
                }

                const cleanVal = String(val).trim();

                // Check if numeric string (Excel serial)
                if (/^\d+$/.test(cleanVal)) {
                    const serial = parseInt(cleanVal, 10);
                    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
                    return new Date(excelEpoch.getTime() + serial * 86400000);
                }

                // DD/MM/YYYY or DD-MM-YYYY
                let parts = cleanVal.split(/[\/\-]/);
                if (parts.length === 3) {
                    if (isNaN(parts[1])) {
                        // DD-MMM-YY e.g., 04-Jun-85
                        const dateStr = parts.join("-");
                        const parsed = new Date(dateStr);
                        return isNaN(parsed.getTime()) ? null : parsed;
                    } else {
                        // Numeric parts
                        const day = parts[0].padStart(2, "0");
                        const month = parts[1].padStart(2, "0");
                        const year = parts[2].length === 2 ? "19" + parts[2] : parts[2];
                        const parsed = new Date(`${year}-${month}-${day}`);
                        return isNaN(parsed.getTime()) ? null : parsed;
                    }
                }

                // Try native parse (ISO or RFC)
                const parsed = new Date(cleanVal);
                return isNaN(parsed.getTime()) ? null : parsed;
            };




            results.push({
                sNo: row["S.NO"] ? parseInt(row["S.NO"]) : null,
                name: row["Employee Name_correct"].trim(),
                area: row["Area"] || "",
                hq: row["HQ"] || "",
                dob: (() => {
                    const parsed = parseDOB(row["DOB (DD/MM/YYYY)"]);
                    return parsed instanceof Date && !isNaN(parsed) ? parsed : null;
                })(),
                communicationAddress: row["Communication Address"] || "",
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