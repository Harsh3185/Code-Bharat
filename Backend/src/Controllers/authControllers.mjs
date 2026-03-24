import { matchedData, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "../Models/User.mjs";
import { createToken } from "../Utils/jwt.mjs";

const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
    };
};

const getClearCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
    };
};

export const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const data = matchedData(req, { includeOptionals: true });
        let { password, role, adminSecret, ...restData } = data;

        role = role ? role.toLowerCase() : "user";

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            ...restData,
            role,
            password: hashedPassword
        });

        const { password: _password, ...publicUser } = user.toObject();

        res.status(201).json({ message: 'Registered successfully', user: publicUser });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = req._foundUser;
        const token = createToken(user);

        res.cookie('token', token, getCookieOptions());

        res.status(201).json({ message: 'Login successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

export const me = async (req, res) => {
    const { password, ...publicUser } = req.user.toObject();
    res.status(200).json({ user: publicUser });
};

export const logout = async (req, res) => {
    res.clearCookie('token', getClearCookieOptions());
    res.status(200).json({ message: "Logged out successfully" });
};
