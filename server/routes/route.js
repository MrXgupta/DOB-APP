const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const addEmployee = require("../controllers/add-employee")
const uploadCSV = require("../controllers/upload-csv")
const getEmployee = require("../controllers/getEmployee")
const { deleteAllEmployees, deleteOneEmployee } = require("../controllers/deleteEmployees");
const { sendBirthdayEmails } = require("../controllers/birthdayReminderController");
const { getUpcomingBirthdays } = require("../controllers/employeeController");

router.post("/add-employee", addEmployee);
router.post("/upload-csv", upload.single("file"), uploadCSV);
router.get("/getEmployee", getEmployee)
router.delete("/delete-all", deleteAllEmployees);
router.delete("/delete-one", deleteOneEmployee);
router.post("/send-birthday-emails", sendBirthdayEmails);
router.get("/upcoming-birthdays", getUpcomingBirthdays);

module.exports = router;
