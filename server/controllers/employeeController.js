const Employee = require("../models/employee");

const getUpcomingBirthdays = async (req, res) => {
    try {
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // 1-based
        const todayDate = now.getDate();

        const employees = await Employee.find({
            dob: { $ne: null }
        });

        const upcoming = employees.filter(emp => {
            const empDate = new Date(emp.dob);
            return empDate.getMonth() + 1 === currentMonth;
        });

        upcoming.sort((a, b) => {
            const dayA = new Date(a.dob).getDate();
            const dayB = new Date(b.dob).getDate();
            return dayA - dayB;
        });

        res.json({ birthdays: upcoming });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getUpcomingBirthdays,
};
