const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
    {
            sNo: { type: Number },
            name: { type: String },
            area: { type: String },
            hq: { type: String },
            dob: { type: Date },
            communicationAddress: { type: String },
    },
    {
            timestamps: true,
    }
);

module.exports = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
