import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config;

const JWT_SECRET = process.env.JWT_SECRET;

export const createToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '2h' }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token , JWT_SECRET);
};