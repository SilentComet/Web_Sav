import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createStore = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, subdomain } = req.body;
        const userId = (req as AuthRequest).user?.userId;
        console.log(`Creating store: ${name}, ${subdomain}, User: ${userId}`);

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Check availability
        const existingStore = await prisma.store.findFirst({
            where: { slug: subdomain }
        });

        if (existingStore) {
            res.status(400).json({ message: 'Subdomain already taken' });
            return;
        }

        const store = await prisma.store.create({
            data: {
                name,
                slug: subdomain,
                ownerId: userId,
            },
        });
        console.log('Store created:', store);

        res.status(201).json(store);
    } catch (error) {
        console.error('Store creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getStores = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const stores = await prisma.store.findMany({
            where: { ownerId: userId },
        });

        res.status(200).json(stores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
