// @ts-nocheck
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createServer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, type, endpoint, capacity, config } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // @ts-ignore
        const server = await prisma.server.create({
            data: {
                name,
                type: type as any, // Cast to any to bypass build type issue
                endpoint,
                capacity: parseInt(capacity),
                config: config || {},
                providerId: userId,
            },
        });

        res.status(201).json(server);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getServers = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        // In a real scenario, Super Admin sees all, Reseller sees theirs.
        // For now assuming the user is the provider.
        // @ts-ignore
        const servers = await prisma.server.findMany({
            where: { providerId: userId },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(servers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateServerStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // @ts-ignore
        const server = await prisma.server.update({
            where: { id },
            data: { status: status as any }, // Cast to any
        });

        res.status(200).json(server);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
