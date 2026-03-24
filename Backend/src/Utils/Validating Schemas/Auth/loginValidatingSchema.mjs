import { User } from "../../../Models/User.mjs";
import bcrypt from 'bcryptjs';

export const loginValidatingSchema = {
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Email cannot be empty",
        },
        isEmail: {
            errorMessage: "Invalid Email",
        },
        custom: {
            options: async (value, { req }) => {
                const user = await User.findOne({ email: value });
                if (!user) {
                    throw new Error("Email not registered");
                }

                req._foundUser = user;
                return true;
            },
        },
    },

    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Password cannot be empty",
        },
        custom: {
            options: async (value , {req}) => {
                const user = req._foundUser;
                if (!user) return true;

                const isMatch = await bcrypt.compare(value, user.password);
                if (!isMatch) {
                    throw new Error("Incorrect password");
                }

                return true;
            },
        },
    },

    role: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['admin', 'user']],
            errorMessage: "Role must be 'admin' or 'user'",
        },
        custom: {
            options: (value, { req }) => {
                const user = req._foundUser;
                if (!value || !user) return true;

                if (user.role?.toLowerCase() !== value.toLowerCase()) {
                    throw new Error(`This account is not registered as ${value}`);
                }

                return true;
            },
        },
    },
};

export default loginValidatingSchema
