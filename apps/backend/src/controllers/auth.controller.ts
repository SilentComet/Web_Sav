import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokens';

const prisma = new PrismaClient();

// Cookie configuration
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'STORE_OWNER', // Default to Store Owner for self-signup
            },
        });

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            role: user.role
        });

        const refreshToken = generateRefreshToken(user.id);

        // Set refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        res.status(201).json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            role: user.role
        });

        const refreshToken = generateRefreshToken(user.id);

        // Set refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        res.status(200).json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Refresh access token using refresh token from cookie
 */
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            res.status(401).json({ message: 'No refresh token provided' });
            return;
        }

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId }
        });

        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken({
            userId: user.id,
            role: user.role
        });

        const newRefreshToken = generateRefreshToken(user.id);

        // Rotate refresh token for security
        res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

/**
 * Logout - clear refresh token cookie
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};
