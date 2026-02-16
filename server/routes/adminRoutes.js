const express = require("express");
const {
  registerEmployee,
  getEmployeeRolesAndPositions,
} = require("../controllers/admin/employeeController");
const jwtAuth = require("../middlewares/global/jwtAuth");
const requireRole = require("../middlewares/global/requireRole");

const adminRouter = express.Router();

// Protect all admin routes with jwtAuth and requireRole("admin")
adminRouter.use(jwtAuth, requireRole("admin"));

// Employee registration
adminRouter.post("/employee/register", registerEmployee);
// Get allowed roles and positions
adminRouter.get("/employee/roles-positions", getEmployeeRolesAndPositions);

module.exports = adminRouter;
