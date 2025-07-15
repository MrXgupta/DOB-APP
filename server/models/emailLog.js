const mongoose = require("mongoose");

const EmailRecipientSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    dob: { type: Date },
    area: { type: String },
    birthdayType: { type: String, enum: ["today", "tomorrow"], required: true },
    status: { type: String, enum: ["success", "failure"], required: true },
    errorMessage: { type: String, default: null }
});

const EmailLogSchema = new mongoose.Schema({
    sentAt: { type: Date, default: Date.now },
    subject: { type: String },
    recipients: [EmailRecipientSchema]
});

module.exports = mongoose.models.EmailLog || mongoose.model("EmailLog", EmailLogSchema);
