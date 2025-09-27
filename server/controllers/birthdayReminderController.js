const Employee = require("../models/employee");
const nodemailer = require("nodemailer");
const path = require("path");
const EmailLog = require("../models/emailLog");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 20000
});

const generateBirthdayTiles = (employee) => {
    const templates = [
        {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            icon: "🎉",
            title: "Happy Birthday!",
            message: `🎉 Wishing you a wonderful birthday filled with joy, laughter, and prosperity.\nToday we celebrate not just your special day, but also the positive energy you bring to our team.\nYour dedication and passion inspire everyone around you to do their best.\nMay this year bring you growth in every aspect of life—personal and professional.\nThank you for being an important part of the Kuber Grains & Spices family.`,
            accent: "#ffd700"
        },
        {
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            icon: "🎂",
            title: "Special Day!",
            message: `🎂 May your special day be surrounded by love and bring you success and happiness.\nYour hard work and commitment have contributed immensely to our shared goals.\nWe deeply appreciate the bond you have built with your colleagues and customers alike.\nMay the year ahead reward you with exciting opportunities and well-deserved achievements.\nWishing you all the best today and always from the entire team`,
            accent: "#ffffff"
        },
        {
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            icon: "🌟",
            title: "Celebrate You!",
            message: `🥳 Happy Birthday! May this year be your best one yet, with blessings in all you do.\nYour kindness, perseverance, and positive spirit make a lasting impact on all of us.\nWe are grateful for your efforts and proud to have you as part of our journey.\nMay you continue to shine bright and reach even greater milestones.\nEnjoy your day to the fullest—you have truly earned every celebration!`,
            accent: "#fef9e7"
        }
    ];

    return templates
        .map((template) => `
<table cellspacing="0" cellpadding="0" border="0" style="width: 340px; min-height: 160px; border-radius: 16px; overflow: hidden; background: url('https://5.imimg.com/data5/SELLER/Default/2024/8/443611750/WR/PQ/UP/215035880/dhoop-batti-fragrance-1000x1000.jpg') center center / cover no-repeat; margin: 0 auto 20px auto; box-shadow: 0 12px 40px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.1);">
  <tr>
    <td style="background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%); backdrop-filter: blur(2px); padding:10px; text-align:center; vertical-align: middle; position: relative; min-height: 160px;">

      <div style="position: absolute; top: 12px; left: 15px; width: 25px; height: 25px; background: rgba(255,255,255,0.1); border-radius: 50%; backdrop-filter: blur(10px);"></div>
      <div style="position: absolute; top: 18px; right: 20px; width: 35px; height: 35px; background: rgba(255,255,255,0.05); border-radius: 50%; backdrop-filter: blur(15px);"></div>
      <div style="position: absolute; bottom: 15px; left: 25px; width: 20px; height: 20px; background: rgba(255,255,255,0.08); border-radius: 50%; backdrop-filter: blur(8px);"></div>

      <div style="position: relative; z-index: 2;">
        <div style="display: inline-block; padding: 4px; background: rgba(255,255,255,0.15); border-radius: 50%; backdrop-filter: blur(10px); margin-bottom: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
          <img src="https://i.ibb.co/FLb0bwVf/images.png" width="40" height="40" style="border-radius:50%; border:2px solid rgba(255,255,255,0.8);">
        </div>

        <h2 style="margin:0; font-size:14px; color:#fff; line-height:1.2; text-shadow: 0 0 20px rgba(255,255,255,0.5), 0 2px 10px rgba(0,0,0,0.8); font-weight: bold; letter-spacing: 0.5px;">${employee.name}</h2>

        <div style="width: 50px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); margin: 4px auto 6px auto; border-radius: 1px;"></div>

        <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); border-radius: 8px; padding: 8px; margin: 0 10px; border: 1px solid rgba(255,255,255,0.2); box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);">
          <p style="font-size:9px; color:#fff; margin:0; max-width:300px; line-height:1.3; text-shadow: 0 1px 3px rgba(0,0,0,0.8); font-weight: 400;">${template.message}</p>
        </div>

        <div style="margin-top: 6px; padding: 4px 8px; background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); border-radius: 12px; display: inline-block; border: 1px solid rgba(255,255,255,0.15);">
          <p style="font-size:9px; color:#fff; opacity:0.9; margin:0; font-weight: 500; letter-spacing: 0.3px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">Kuber Grains & Spices Pvt. Ltd.</p>
        </div>
      </div>

      <div style="position: absolute; top: 0; left: 0; width: 50px; height: 50px; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 0 0 50px 0;"></div>
      <div style="position: absolute; bottom: 0; right: 0; width: 45px; height: 45px; background: linear-gradient(315deg, rgba(255,255,255,0.08) 0%, transparent 70%); border-radius: 45px 0 0 0;"></div>
    </td>
  </tr>
</table>
        `).join('');
};

const formatBirthdayMessage = (employee, when) => {
    const dobFormatted = employee.dob ? new Date(employee.dob).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : null;

    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; background: #f5f5f5; padding: 20px;">

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🎂 Birthday Alert!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Employee Birthday Notification</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Dear HR Team,</p>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 5px solid #2196f3; margin: 20px 0;">
                <p style="font-size: 16px; margin: 0; color: #1565c0;">
                    <strong>🎉 ${employee.name}</strong> has a birthday <strong>${when}</strong>!
                </p>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px;">👤 Employee Details</h3>
                <div style="display: grid; gap: 10px;">
                    ${employee.sNo ? `<div style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong style="color: #555; width: 200px; display: inline-block;">Serial No:</strong> ${employee.sNo}</div>` : ''}
                    <div style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong style="color: #555; width: 200px; display: inline-block;">Name:</strong> ${employee.name}</div>
                    ${employee.area ? `<div style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong style="color: #555; width: 200px; display: inline-block;">Area:</strong> ${employee.area}</div>` : ''}
                    ${employee.hq ? `<div style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong style="color: #555; width: 200px; display: inline-block;">HQ:</strong> ${employee.hq}</div>` : ''}
                    ${dobFormatted ? `<div style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong style="color: #555; width: 200px; display: inline-block;">Date of Birth:</strong> ${dobFormatted}</div>` : ''}
                    ${employee.communicationAddress ? `<div style="padding: 8px 0;"><strong style="color: #555; width: 200px; display: inline-block;">Address:</strong> ${employee.communicationAddress}</div>` : ''}
                </div>
            </div>

            <div style="background: linear-gradient(135deg, #4caf50, #45a049); padding: 20px; border-radius: 10px; margin: 25px 0;">
                <h3 style="color: white; margin: 0 0 10px 0; font-size: 18px;">📱 How to Use Birthday Cards</h3>
                <p style="color: white; margin: 0; font-size: 14px; opacity: 0.9;">Below are 3 professionally designed birthday cards. Simply right-click on any card you prefer and save the image, or use your device's screenshot feature to capture and share!</p>
            </div>

            <div style="margin: 30px 0;">
                <h3 style="color: #333; text-align: center; margin-bottom: 30px; font-size: 22px;">🎨 Ready-to-Share Birthday Cards</h3>
                ${generateBirthdayTiles(employee)}
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-top: 30px;">
                <p style="margin: 0; font-size: 14px; color: #856404;">
                    <strong>💡 Pro Tip:</strong> These cards are optimized for sharing on WhatsApp, email, or company portals. Feel free to add personal touches or company-specific messages before sharing!
                </p>
            </div>
        </div>
    </div>
    `;
};

const sendBirthdayEmails = async (req, res) => {
    const logRecipients = [];
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
            try {
                await transporter.sendMail({
                    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
                    to: process.env.EMAIL_TO_HR,
                    subject: `🎂 Birthday Today: ${emp.name} - Ready-to-Share Cards Inside!`,
                    html: formatBirthdayMessage(emp, "today"),
                });

                logRecipients.push({
                    name: emp.name,
                    email: process.env.EMAIL_TO_HR,
                    dob: emp.dob,
                    area: emp.area,
                    birthdayType: "today",
                    status: "success"
                });
            } catch (error) {
                console.error(`Error sending email for ${emp.name}:`, error);
                logRecipients.push({
                    name: emp.name,
                    email: process.env.EMAIL_TO_HR,
                    dob: emp.dob,
                    area: emp.area,
                    birthdayType: "today",
                    status: "failure",
                    errorMessage: error.message
                });
            }
        }

        for (const emp of tomorrowBirthdays) {
            try {
                await transporter.sendMail({
                    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
                    to: process.env.EMAIL_TO_HR,
                    subject: `🎂 Birthday Tomorrow: ${emp.name} - Prepare Birthday Cards!`,
                    html: formatBirthdayMessage(emp, "tomorrow"),
                });

                logRecipients.push({
                    name: emp.name,
                    email: process.env.EMAIL_TO_HR,
                    dob: emp.dob,
                    area: emp.area,
                    birthdayType: "tomorrow",
                    status: "success"
                });
            } catch (error) {
                console.error(`Error sending email for ${emp.name}:`, error);
                logRecipients.push({
                    name: emp.name,
                    email: process.env.EMAIL_TO_HR,
                    dob: emp.dob,
                    area: emp.area,
                    birthdayType: "tomorrow",
                    status: "failure",
                    errorMessage: error.message
                });
            }
        }

        await EmailLog.create({
            subject: "Daily Birthday Reminder Emails",
            recipients: logRecipients
        });

        res.json({
            message: "Enhanced birthday emails sent successfully.",
            today: todayBirthdays.map((e) => e.name),
            tomorrow: tomorrowBirthdays.map((e) => e.name),
        });
    } catch (err) {
        console.error("Error sending birthday emails:", err);
        res.status(500).json({ message: "Error sending birthday emails.", error: err.message });
    }
};
module.exports = { sendBirthdayEmails };
