const Employee = require("../models/employee");

const getEmployee = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 per page
        const skip = (page - 1) * limit;

        const [employees, totalCount] = await Promise.all([
            Employee.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Employee.countDocuments()
        ]);

        res.json({
            data: employees,
            totalCount
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = getEmployee;
