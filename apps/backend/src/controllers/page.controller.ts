// @ts-nocheck
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createPage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, slug, content, storeId } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        // Verify ownership
        // @ts-ignore
        const store = await prisma.store.findUnique({ where: { id: storeId } });
        if (!store || store.ownerId !== userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        // @ts-ignore
        const page = await prisma.page.create({
            data: {
                name,
                slug,
                content: content || {},
                storeId,
            },
        });

        res.status(201).json(page);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { storeId } = req.query;

        if (!storeId || typeof storeId !== 'string') {
            res.status(400).json({ message: 'Store ID required' });
            return;
        }

        // @ts-ignore
        const pages = await prisma.page.findMany({
            where: { storeId },
            orderBy: { updatedAt: 'desc' },
        });

        res.status(200).json(pages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // @ts-ignore
        const page = await prisma.page.findUnique({
            where: { id },
        });

        if (!page) {
            res.status(404).json({ message: 'Page not found' });
            return;
        }

        res.status(200).json(page);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { content, name, slug } = req.body;

        // @ts-ignore
        const page = await prisma.page.update({
            where: { id },
            data: {
                content,
                name,
                slug,
            },
        });

        res.status(200).json(page);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
