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


const formatRow = (label, value) => {
    if (!value) return "";
    return `<li><strong>${label}:</strong> ${value}</li>`;
};

const generateBirthdayMessages = (employee) => {
    const name = employee.name || "the employee";
    return [
        `🎉 Happy Birthday, ${name}! On behalf of everyone at Kuber Grains & Spices Pvt. Ltd., we wish you a fantastic year ahead filled with success, health, and happiness. May all your dreams come true and your efforts continue to bring you well-deserved recognition and growth. Have a truly wonderful celebration!`,

        `🎂 Dear ${name}, many happy returns of the day! May this birthday bring you immense joy, beautiful memories, and renewed energy for all your endeavors. Your dedication and hard work are truly valued by the entire team at Kuber Grains & Spices Pvt. Ltd. Wishing you all the best today and always. Happy Birthday!`,

        `🥳 Wishing you a very Happy Birthday, ${name}! May this special day be filled with love, laughter, and cherished moments with your loved ones. Thank you for your remarkable contributions and commitment. We at Kuber Grains & Spices Pvt. Ltd. appreciate you greatly and wish you a prosperous, fulfilling year ahead. Enjoy your day to the fullest!`
    ];
};


const formatBirthdayMessage = (employee, when) => {
    const dojFormatted = employee.doj ? new Date(employee.doj).toLocaleDateString() : null;
    const dobFormatted = employee.dob ? new Date(employee.dob).toLocaleDateString() : null;
    const messages = generateBirthdayMessages(employee);

    return `
  <p>Dear HR,</p>
  <p>This is a reminder that <strong>${employee.name}</strong> has a birthday ${when}.</p>
  <ul>
    ${formatRow("Name", employee.name)}
    ${formatRow("Gender", employee.gender)}
    ${formatRow("Date of Joining", dojFormatted)}
    ${formatRow("Designation", employee.designation)}
    ${formatRow("Area", employee.area)}
    ${formatRow("Date of Birth", dobFormatted)}
    ${formatRow("Mobile", employee.mobileNo)}
    ${formatRow("Office Mobile", employee.officeMobile)}
    ${formatRow("Communication Address", employee.communicationAddress)}
  </ul>
  <p><strong>Suggested Birthday Messages:</strong></p>
  <ol>
    ${messages.map(msg => `<li>${msg}</li>`).join("")}
  </ol>
  `;
};

const sendBirthdayEmails = async (req, res) => {
    try {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const isSameMonthDay = (date1, date2) =>
            date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();

        const employees = await Employee.find({ dob: { $ne: null } });

        const todayBirthdays = employees.filter((emp) => isSameMonthDay(new Date(emp.dob), today));
        const tomorrowBirthdays = employees.filter((emp) => isSameMonthDay(new Date(emp.dob), tomorrow));

        if (todayBirthdays.length === 0 && tomorrowBirthdays.length === 0) {
            return res.json({ message: "No birthdays today or tomorrow." });
        }

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