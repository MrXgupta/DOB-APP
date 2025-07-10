# DOB Reminder Application

---

This application helps HR manage employee birthdays efficiently. It allows uploading employee data through a CSV file or adding individual employees manually. The application stores employee information including name, date of birth, contact details, and other relevant fields.

The frontend is built with React and Tailwind CSS. The backend uses Node.js with Express and MongoDB. Nodemailer is used to send automated email reminders to HR.

### Features:

- Upload a CSV file with employee records
- Add single employees through the form
- View, delete, and paginate employee records
- Send email reminders automatically for employees whose - birthday is today or tomorrow
- Generate sample birthday messages for HR to share

### Environment variables used for email configuration:

- EMAIL_HOST
- EMAIL_PORT
- EMAIL_SECURE
- EMAIL_USER
- EMAIL_PASSWORD
- EMAIL_FROM_NAME
- EMAIL_TO_HR

### Deployment:

- Frontend can be deployed to Vercel
- Backend can be deployed to Render or any Node hosting
- A GitHub Actions workflow is configured to trigger the birthday reminder endpoint at specified times

### How to Run Locally:

1. Install dependencies in client and server directories
2. Set up a .env file in the server directory with your email configuration
3. Run the backend server
4. Run the frontend application
5. Access the app in your browser

### Notes:

1. Ensure MongoDB is running and accessible
2. Make sure your email credentials are correct and the sender email is allowed to use SMTP
3. GitHub Actions workflow requires a public API endpoint to trigger the reminders
