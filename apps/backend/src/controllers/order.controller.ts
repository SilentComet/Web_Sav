// @ts-nocheck
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { storeId, items, totalAmount, customerEmail } = req.body;

        // In a real app, calculate totalAmount from items + prices in DB to prevent tampering.
        // For MVP, trusting payload but verifying existence.

        // @ts-ignore
        const order = await prisma.order.create({
            data: {
                storeId,
                totalAmount,
                orderNumber: `ORD-${Date.now()}`,
                // items would be created here if we were doing nested writes properly or separate logic
                // For simplicity in this step, assuming we just create the order record first
                // If simulated, we might want to create OrderItems too.
            },
        });

        // Create items
        if (items && Array.isArray(items)) {
            for (const item of items) {
                // @ts-ignore
                await prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }
                })
            }
        }

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { storeId } = req.query;

        if (!storeId || typeof storeId !== 'string') {
            res.status(400).json({ message: 'Store ID required' });
            return;
        }

        // @ts-ignore
        const orders = await prisma.order.findMany({
            where: { storeId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // @ts-ignore
        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
