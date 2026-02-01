const {
  Employee,
  EMPLOYEE_ROLES,
  EMPLOYEE_POSITIONS,
} = require("../../models/Employee");
const bcrypt = require("bcryptjs");

// Get allowed roles and positions
exports.getEmployeeRolesAndPositions = (req, res) => {
  res.json({ roles: EMPLOYEE_ROLES, positions: EMPLOYEE_POSITIONS });
};

// Register a new employee
const { Authentication } = require("../../models/global/Authentication");
const sendToken = require("../../utils/jwtHelper");

exports.registerEmployee = async (req, res) => {
  try {
    const { name, email, phone, password, gender, dob, role, position } =
      req.body;
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !gender ||
      !dob ||
      !role ||
      !position
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Employee already exists." });
    }
    // Also check Authentication collection for duplicate email
    const existingAuth = await Authentication.findOne({ email });
    if (existingAuth) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Always set role to 'employee' for new employees
    const employee = new Employee({
      name,
      email,
      phone,
      password: hashedPassword,
      gender,
      dob,
      role: "employee",
      position,
    });
    await employee.save();
    // Save to Authentication collection with role 'employee' for dashboard access
    const authUser = new Authentication({
      name,
      email,
      phone,
      password: hashedPassword,
      gender,
      dob,
      role: "employee",
      position,
    });
    await authUser.save();
    // Optionally, send token for immediate login
    // sendToken(authUser, 201, res);
    res
      .status(201)
      .json({ success: true, message: "Employee registered successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
