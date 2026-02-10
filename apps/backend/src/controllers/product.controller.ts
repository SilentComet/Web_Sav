// @ts-nocheck
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import redis from '../utils/redis';

const prisma = new PrismaClient();

const CACHE_TTL = 3600; // 1 hour

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, stock, categoryId, storeId, images } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        // Verify store ownership
        // @ts-ignore
        const store = await prisma.store.findUnique({ where: { id: storeId } });
        if (!store || store.ownerId !== userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        // @ts-ignore
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                categoryId,
                storeId,
                images: images || [],
            },
        });

        // Invalidate cache
        await redis.del(`products:${storeId}`);

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { storeId } = req.query;

        if (!storeId || typeof storeId !== 'string') {
            res.status(400).json({ message: 'Store ID required' });
            return;
        }

        // Check cache
        const cachedProducts = await redis.get(`products:${storeId}`);
        if (cachedProducts) {
            console.log(`Cache hit for products:${storeId}`);
            res.status(200).json(JSON.parse(cachedProducts));
            return;
        }

        // @ts-ignore
        const products = await prisma.product.findMany({
            where: { storeId },
        });

        // Set cache
        await redis.set(`products:${storeId}`, JSON.stringify(products), 'EX', CACHE_TTL);

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // @ts-ignore
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, images } = req.body;

        // @ts-ignore
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                stock,
                images
            },
        });

        // Invalidate cache
        await redis.del(`products:${product.storeId}`);

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Get product to know storeId for cache invalidation
        // @ts-ignore
        const product = await prisma.product.findUnique({ where: { id } });

        if (product) {
            // @ts-ignore
            await prisma.product.delete({
                where: { id },
            });
            await redis.del(`products:${product.storeId}`);
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
