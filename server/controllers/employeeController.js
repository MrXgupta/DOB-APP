const Employee = require("../models/employee");

const getUpcomingBirthdays = async (req, res) => {
    try {
        const now = new Date();
        const currentMonth = now.getMonth();
        const todayDate = now.getDate();

        const employees = await Employee.find({
            dob: { $ne: null }
        });

        const upcoming = employees
            .filter(emp => {
                const dob = new Date(emp.dob);
                return (
                    dob.getMonth() === currentMonth &&
                    dob.getDate() >= todayDate
                );
            })
            .sort((a, b) => {
                const dayA = new Date(a.dob).getDate();
                const dayB = new Date(b.dob).getDate();
                return dayA - dayB;
            })
            .slice(0, 20);

        res.json({ birthdays: upcoming });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getUpcomingBirthdays,
};