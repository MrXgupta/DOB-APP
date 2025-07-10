const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
        sNo: { type: Number },
        code: { type: String },
        name: { type: String },
        gender: { type: String, enum: ["M", "F", "Other"] },
        doj: { type: Date },
        designation: { type: String },
        area: { type: String },
        hq: { type: String },
        ctc: { type: Number },
        pfDeduction: { type: Number },
        esiDeduction: { type: Number },
        dob: { type: Date },
        bloodGroup: { type: String },
        aadhaarNo: { type: String },
        panCard: { type: String },
        mobileNo: { type: String },
        communicationAddress: { type: String },
        modeOfPayment: { type: String },
        bank: { type: String },
        ifscCode: { type: String },
        beneficiaryAccountNo: { type: String },
        beneficiaryName: { type: String },
        branchAddress: { type: String },
        da: { type: Number },
        ta: { type: Number },
        nightAllowance: { type: Number },
        officeMobile: { type: String }
    },
    {
        timestamps: true
    });

module.exports = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);