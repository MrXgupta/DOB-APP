const Employee = require("../models/Employee");
const addEmployee = async (req, res) => {
    try {
        const { code, name, dob, mobileNo } = req.body;
        if (!code || !name) {
            return res.status(400).json({ message: "Code and Name are required" });
        }

        const emp = new Employee({
            code,
            name,
            dob: dob ? new Date(dob) : null,
            mobileNo: mobileNo || "NA",
        });
        await emp.save();
        res.json({ employee: emp });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = addEmployee;