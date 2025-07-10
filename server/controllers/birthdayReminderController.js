const Employee = require("../models/employee");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const formatBirthdayMessage = (employee, when) => {
    return `
  <p>Dear HR,</p>
  <p>This is a reminder that <strong>${employee.name}</strong> (${employee.designation}) has a birthday ${when}.</p>
  <ul>
    <li><strong>Name:</strong> ${employee.name}</li>
    <li><strong>Date of Birth:</strong> ${new Date(employee.dob).toLocaleDateString()}</li>
    <li><strong>Mobile:</strong> ${employee.mobileNo || "N/A"}</li>
    <li><strong>Area:</strong> ${employee.area || "N/A"}</li>
  </ul>
  <p>🎂 Happy Birthday wishes from the team!</p>
  `;
};

// Main controller
const sendBirthdayEmails = async (req, res) => {
    try {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        // Function to check if a date is the same month and day
        const isSameMonthDay = (date1, date2) =>
            date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();

        const employees = await Employee.find({ dob: { $ne: null } });

        const todayBirthdays = employees.filter((emp) => isSameMonthDay(new Date(emp.dob), today));
        const tomorrowBirthdays = employees.filter((emp) => isSameMonthDay(new Date(emp.dob), tomorrow));

        if (todayBirthdays.length === 0 && tomorrowBirthdays.length === 0) {
            return res.json({ message: "No birthdays today or tomorrow." });
        }

        // Send separate emails for today and tomorrow
        for (const emp of todayBirthdays) {
            await transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_TO_HR,
                subject: `🎂 Birthday Today: ${emp.name}`,
                html: formatBirthdayMessage(emp, "today"),
            });
        }

        for (const emp of tomorrowBirthdays) {
            await transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_TO_HR,
                subject: `🎂 Birthday Tomorrow: ${emp.name}`,
                html: formatBirthdayMessage(emp, "tomorrow"),
            });
        }

        res.json({
            message: "Emails sent.",
            today: todayBirthdays.map((e) => e.name),
            tomorrow: tomorrowBirthdays.map((e) => e.name),
        });
    } catch (err) {
        console.error("Error sending birthday emails:", err);
        res.status(500).json({ message: "Error sending birthday emails.", error: err.message });
    }
};

module.exports = { sendBirthdayEmails };