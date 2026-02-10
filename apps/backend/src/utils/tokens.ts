import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';
const REFRESH_SECRET = process.env.REFRESH_SECRET || '';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    console.error('ERROR: JWT_SECRET must be at least 32 characters. Set in .env file.');
    process.exit(1);
}

if (!REFRESH_SECRET || REFRESH_SECRET.length < 32) {
    console.error('ERROR: REFRESH_SECRET must be at least 32 characters. Set in .env file.');
    process.exit(1);
}

export interface TokenPayload {
    userId: string;
    role: string;
}

export interface RefreshTokenPayload {
    userId: string;
}

/**
 * Generate a short-lived access token (15 minutes)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
    );
};

/**
 * Generate a long-lived refresh token (7 days)
 */
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' }
    );
};

/**
 * Verify and decode access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

/**
 * Verify and decode refresh token
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
    try {
        return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
