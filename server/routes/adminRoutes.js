const express = require("express");
const {
  registerEmployee,
  getEmployeeRolesAndPositions,
} = require("../controllers/admin/employeeController");

const adminRouter = express.Router();

// Employee registration
adminRouter.post("/employee/register", registerEmployee);
// Get allowed roles and positions
adminRouter.get("/employee/roles-positions", getEmployeeRolesAndPositions);

module.exports = adminRouter;
