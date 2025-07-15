const EmailLog = require("../models/emailLog");

exports.getEmailLogs = async (req, res) => {
    try {
        const { recent } = req.query;
        let query = {};

        if (recent === "true") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            query.sentAt = { $gte: sevenDaysAgo };
        }

        const logs = await EmailLog.find(query).sort({ sentAt: -1 });

        res.json({ logs });
    } catch (error) {
        console.error("Error fetching email logs:", error);
        res.status(500).json({ message: "Error fetching email logs." });
    }
};
