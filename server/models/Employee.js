const mongoose = require("mongoose");

const EMPLOYEE_ROLES = ["employee", "admin"];
const EMPLOYEE_POSITIONS = [
  "Junior",
  "Senior",
  "Lead",
  "Head",
  "Assistant",
  "Executive",
  "Clerk",
  "Supervisor",
  "Officer",
  "Specialist",
];

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },
    role: { type: String, enum: EMPLOYEE_ROLES, required: true },
    position: { type: String, required: true }, // allow any string for position
  },
  { timestamps: true },
);

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = {
  Employee,
  EMPLOYEE_ROLES,
  EMPLOYEE_POSITIONS,
};
