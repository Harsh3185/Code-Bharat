import { User } from "../../../Models/User.mjs";

export const registerValidatingSchema = {
    userName: {
        notEmpty: {
            errorMessage: "User Name cannot be empty",
        },
        isString: {
            errorMessage: "User Name should be a string",
        },
        custom: {
            options: async (value) => {
                const exists = await User.findOne({ userName: value });
                if (exists) {
                    throw new Error("User Name already in use.");
                }
                return true;
            },
        },
    },

    email: {
        notEmpty: {
            errorMessage: "Email cannot be empty",
        },
        isEmail: {
            errorMessage: "Invalid Email",
        },
        custom: {
            options: async (value) => {
                const exists = await User.findOne({ email: value });
                if (exists) {
                    throw new Error("Email already registered");
                }
                return true;
            },
        },
    },

    password: {
        notEmpty: {
            errorMessage: "Password cannot be empty",
        },
        isLength: {
            options: {
                min: 8,
                max: 32,
            },
            errorMessage: "Password must be 8-32 characters long",
        },
        matches: {
            options: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/],
            errorMessage: "Password must include uppercase, lowercase, number, and special character",
        },
    },

    role: {
        optional: true,
        isIn: {
            options: [['admin', 'user']],
            errorMessage: "Role must be 'admin' or 'user'",
        },
    },

    adminSecret: {
        optional: true,
        custom: {
            options: (value, { req }) => {
                const role = req.body?.role?.toLowerCase();

                if (role !== "admin") return true;

                if (!value) {
                    throw new Error("Admin secret is required for admin registration");
                }

                if (value !== process.env.ADMIN_SECRET) {
                    throw new Error("Invalid admin secret");
                }

                return true;
            },
        },
    },
};
