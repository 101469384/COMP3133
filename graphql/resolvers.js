const bcrypt = require("bcrypt");
const User = require("../models/User");
const Employee = require("../models/Employee");
const cloudinary = require("../config/cloudinary");
const { signToken } = require("../utils/auth");
const { isEmail, requireFields } = require("../utils/validators");

async function uploadToCloudinary(photoString) {
    if (!photoString) return null;

    // if already a URL
    if (photoString.startsWith("http://") || photoString.startsWith("https://")) {
        return photoString;
    }

    // else treat as base64 data URL
    const res = await cloudinary.uploader.upload(photoString, {
        folder: "comp3133_employees",
    });
    return res.secure_url;
}

module.exports = {
    Query: {
        login: async (_, { input }) => {
            try {
                const err = requireFields(input, ["usernameOrEmail", "password"]);
                if (err) return { success: false, message: err };

                const { usernameOrEmail, password } = input;

                const user = isEmail(usernameOrEmail)
                    ? await User.findOne({ email: usernameOrEmail })
                    : await User.findOne({ username: usernameOrEmail });

                if (!user) return { success: false, message: "Invalid credentials" };

                const ok = await bcrypt.compare(password, user.password);
                if (!ok) return { success: false, message: "Invalid credentials" };

                const token = signToken(user);
                return { success: true, message: "Login success", token, user };
            } catch (e) {
                return { success: false, message: e.message };
            }
        },

        getAllEmployees: async (_, __, ctx) => {
            try {
                if (!ctx.user) return { success: false, message: "Unauthorized", employees: [] };
                const employees = await Employee.find().sort({ created_at: -1 });
                return { success: true, message: "Employees fetched", employees };
            } catch (e) {
                return { success: false, message: e.message, employees: [] };
            }
        },

        searchEmployeeByEid: async (_, { eid }, ctx) => {
            try {
                if (!ctx.user) return { success: false, message: "Unauthorized" };
                const employee = await Employee.findById(eid);
                if (!employee) return { success: false, message: "Employee not found" };
                return { success: true, message: "Employee found", employee };
            } catch (e) {
                return { success: false, message: e.message };
            }
        },

        searchEmployeesByDesignationOrDepartment: async (_, { designation, department }, ctx) => {
            try {
                if (!ctx.user) return { success: false, message: "Unauthorized", employees: [] };
                if (!designation && !department) {
                    return { success: false, message: "Provide designation or department", employees: [] };
                }

                const filter = {};
                if (designation) filter.designation = designation;
                if (department) filter.department = department;

                const employees = await Employee.find(filter);
                return { success: true, message: "Employees fetched", employees };
            } catch (e) {
                return { success: false, message: e.message, employees: [] };
            }
        },
    },

    Mutation: {
        signup: async (_, { input }) => {
            try {
                const err = requireFields(input, ["username", "email", "password"]);
                if (err) return { success: false, message: err };

                if (!isEmail(input.email)) return { success: false, message: "Invalid email format" };
                if (input.password.length < 6) {
                    return { success: false, message: "Password must be at least 6 characters" };
                }

                const existsUser = await User.findOne({ username: input.username });
                if (existsUser) return { success: false, message: "Username already exists" };

                const existsEmail = await User.findOne({ email: input.email });
                if (existsEmail) return { success: false, message: "Email already exists" };

                const hashed = await bcrypt.hash(input.password, 10);
                const user = await User.create({
                    username: input.username,
                    email: input.email,
                    password: hashed,
                });

                const token = signToken(user);
                return { success: true, message: "Signup success", token, user };
            } catch (e) {
                return { success: false, message: e.message };
            }
        },

        addEmployee: async (_, { input }, ctx) => {
            try {
                if (!ctx.user) return { success: false, message: "Unauthorized" };

                const err = requireFields(input, [
                    "first_name",
                    "last_name",
                    "email",
                    "gender",
                    "designation",
                    "salary",
                    "date_of_joining",
                    "department",
                ]);
                if (err) return { success: false, message: err };

                if (!isEmail(input.email)) return { success: false, message: "Invalid email format" };
                if (input.salary < 1000) return { success: false, message: "Salary must be >= 1000" };

                const photoUrl = await uploadToCloudinary(input.employee_photo);

                const employee = await Employee.create({
                    ...input,
                    employee_photo: photoUrl,
                    date_of_joining: new Date(input.date_of_joining),
                });

                return { success: true, message: "Employee created", employee };
            } catch (e) {
                if (e.code === 11000) return { success: false, message: "Employee email already exists" };
                return { success: false, message: e.message };
            }
        },

        updateEmployeeByEid: async (_, { eid, input }, ctx) => {
            try {
                if (!ctx.user) return { success: false, message: "Unauthorized" };

                const employee = await Employee.findById(eid);
                if (!employee) return { success: false, message: "Employee not found" };

                if (input.email && !isEmail(input.email)) {
                    return { success: false, message: "Invalid email format" };
                }
                if (input.salary !== undefined && input.salary < 1000) {
                    return { success: false, message: "Salary must be >= 1000" };
                }

                if (input.employee_photo) {
                    employee.employee_photo = await uploadToCloudinary(input.employee_photo);
                }

                const fields = ["first_name", "last_name", "email", "gender", "designation", "salary", "department"];
                for (const f of fields) {
                    if (input[f] !== undefined) employee[f] = input[f];
                }
                if (input.date_of_joining) employee.date_of_joining = new Date(input.date_of_joining);

                await employee.save();
                return { success: true, message: "Employee updated", employee };
            } catch (e) {
                if (e.code === 11000) return { success: false, message: "Employee email already exists" };
                return { success: false, message: e.message };
            }
        },

        deleteEmployeeByEid: async (_, { eid }, ctx) => {
            try {
                if (!ctx.user) return { success: false, message: "Unauthorized" };

                const employee = await Employee.findByIdAndDelete(eid);
                if (!employee) return { success: false, message: "Employee not found" };

                return { success: true, message: "Employee deleted", employee };
            } catch (e) {
                return { success: false, message: e.message };
            }
        },
    },
};
