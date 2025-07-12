const Employee = require("../models/employee");
const nodemailer = require("nodemailer");
const path = require("path");
const logo = path.join(__dirname, "../assets/download.png");

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


const generateBirthdayTiles = (employee) => {
    const messages = [
        "🎉 Wishing you a wonderful birthday filled with joy, laughter, and prosperity.\n" +
        "Today we celebrate not just your special day, but also the positive energy you bring to our team.\n" +
        "Your dedication and passion inspire everyone around you to do their best.\n" +
        "May this year bring you growth in every aspect of life—personal and professional.\n" +
        "Thank you for being an important part of the Kuber Grains & Spices family.",
        "🎂 May your special day be surrounded by love and bring you success and happiness.\n" +
        "Your hard work and commitment have contributed immensely to our shared goals.\n" +
        "We deeply appreciate the bond you have built with your colleagues and customers alike.\n" +
        "May the year ahead reward you with exciting opportunities and well-deserved achievements.\n" +
        "Wishing you all the best today and always from the entire team",
        "🥳 Happy Birthday! May this year be your best one yet, with blessings in all you do.\n" +
        "Your kindness, perseverance, and positive spirit make a lasting impact on all of us.\n" +
        "We are grateful for your efforts and proud to have you as part of our journey.\n" +
        "May you continue to shine bright and reach even greater milestones.\n" +
        "Enjoy your day to the fullest—you have truly earned every celebration!"
    ];

    return messages
        .map(
            (msg) => `
<table cellspacing="0" cellpadding="0" border="0" width="540" style="border-radius:12px; overflow:hidden; background:url('https://5.imimg.com/data5/SELLER/Default/2024/8/443611750/WR/PQ/UP/215035880/dhoop-batti-fragrance-1000x1000.jpg') center center / cover no-repeat; margin:0 auto 24px auto;">
  <tr>
    <td style="background: rgba(0,0,0,0.6); padding:40px 20px; text-align:center;">
      <img src="https://scontent.fdel1-2.fna.fbcdn.net/v/t39.30808-6/217712499_124779689831072_8572648569165534497_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=sOlTWxoypcMQ7kNvwG8W-yE&_nc_oc=AdmhW1_e1n4C0WsH-7uxk3vt7Ij-PTk-YqO2T_nX3_-vS1lrUPS05S-3MfDLf_0lpXQ&_nc_zt=23&_nc_ht=scontent.fdel1-2.fna&_nc_gid=jUCPSPZgGK-sbRnT9NDKVQ&oh=00_AfSuky-9LE0iYuWLDLU7o5EyuqEqhVsT3RFMrzJPoNDUaQ&oe=68781403" width="80" height="80" style="border-radius:50%; border:2px solid #fff; margin-bottom:20px;">
      <h2 style="margin:0;font-size:24px;color:#fff;line-height:1.4;">${employee.name}</h2>
      <p style="font-size:18px;color:#fff;margin:20px 0;max-width:400px;line-height:1.5;margin-left:auto;margin-right:auto;">${msg}</p>
      <p style="font-size:14px;color:#fff;opacity:0.85;margin:0;">Kuber Grains & Spices Pvt. Ltd.</p>
    </td>
  </tr>
</table>
`
        )
        .join("");
};


// Email HTML content
const formatBirthdayMessage = (employee, when) => {
    const dobFormatted = employee.dob ? new Date(employee.dob).toLocaleDateString() : null;

    return `
  <p>Dear HR,</p>
  <p>This is a reminder that <strong>${employee.name}</strong> has a birthday ${when}.</p>
  <ul>
    ${formatRow("Serial No", employee.sNo)}
    ${formatRow("Name", employee.name)}
    ${formatRow("Area", employee.area)}
    ${formatRow("HQ", employee.hq)}
    ${formatRow("Date of Birth", dobFormatted)}
    ${formatRow("Communication Address", employee.communicationAddress)}
  </ul>
  <p><strong>Below are 3 pre-designed birthday wishes you can share:</strong></p>
  ${generateBirthdayTiles(employee)}
  <p>Simply use Snipping Tool to capture any of the cards you prefer.</p>
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

        // Tomorrow's birthdays
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
