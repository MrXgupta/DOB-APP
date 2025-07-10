const Employee = require("../models/Employee");

// Delete ALL employees
const deleteAllEmployees = async (req, res) => {
    try {
        const result = await Employee.deleteMany({});
        res.json({
            message: "All employees deleted successfully.",
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        res.status(500).json({ message: "Error deleting employees: " + err.message });
    }
};

// Delete ONE employee by ID
const deleteOneEmployee = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Employee ID is required." });
    }

    try {
        const deleted = await Employee.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Employee not found." });
        }
        res.json({
            message: "Employee deleted successfully.",
            employee: deleted,
        });
    } catch (err) {
        res.status(500).json({ message: "Error deleting employee: " + err.message });
    }
};

module.exports = { deleteAllEmployees, deleteOneEmployee };
