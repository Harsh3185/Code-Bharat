import { matchedData, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "../Models/User.mjs";
import { createToken, verifyToken } from "../Utils/jwt.mjs";

export const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const data = matchedData(req, { includeOptionals: true });
        const { password, ...restData } = data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            ...restData,
            password: hashedPassword
        })

        res.status(201).json({ message: 'Registered successfully', user });
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

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 2,
            secure: false,
            sameSite: 'strict'
        });

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
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
};