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
                min: 4,
                max: 16,
            },
            errorMessage: "Password must be 4-16 characters long",
        },
    },

    role: {
        optional: true,
        isIn: {
            options: [['admin', 'user']],
            errorMessage: "Role must be 'admin' or 'user'",
        },
    }
};