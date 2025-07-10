const Employee = require("../models/employee");

const addEmployee = async (req, res) => {
    try {
        const { sNo, name, area, hq, dob, communicationAddress } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Employee name is required" });
        }

        let dobDate = null;
        if (dob) {
            if (dob.includes("/")) {
                const [day, month, year] = dob.split("/");
                dobDate = new Date(`${year}-${month}-${day}`);
            } else {
                dobDate = new Date(dob);
            }
        }

        const emp = new Employee({
            sNo: sNo || null,
            name,
            area: area || "",
            hq: hq || "",
            dob: dobDate,
            communicationAddress: communicationAddress || "",
        });

        await emp.save();
        res.json({ employee: emp });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = addEmployee;
