// @ts-nocheck
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Mock Stripe API
const mockStripe = {
    paymentIntents: {
        create: async (data: any) => ({
            id: `pi_${Date.now()}`,
            client_secret: `secret_${Date.now()}`,
            amount: data.amount,
            currency: data.currency,
            status: 'requires_payment_method',
        }),
    },
};

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.body;

        // @ts-ignore
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        const paymentIntent = await mockStripe.paymentIntents.create({
            amount: Math.round(Number(order.totalAmount) * 100), // cents
            currency: 'usd', // simplified
        });

        // Create Payment record
        // @ts-ignore
        const payment = await prisma.payment.create({
            data: {
                amount: order.totalAmount,
                currency: 'USD',
                status: 'PENDING',
                provider: 'Stripe',
                transactionId: paymentIntent.id,
                orderId: order.id,
            },
        });

        res.status(201).json({ clientSecret: paymentIntent.client_secret, paymentId: payment.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
    // Simulate webhook
    try {
        const { type, data } = req.body;

        if (type === 'payment_intent.succeeded') {
            const transactionId = data.object.id;

            // @ts-ignore
            await prisma.payment.updateMany({
                where: { transactionId },
                data: { status: 'COMPLETED' }
            });

            // Find payment to update order
            // @ts-ignore
            const payment = await prisma.payment.findFirst({ where: { transactionId } });
            if (payment) {
                // @ts-ignore
                await prisma.order.update({
                    where: { id: payment.orderId },
                    data: { status: 'SHIPPED' } // Auto-move to processing/shipped
                });
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error(error);
        res.status(400).send('Webhook Error');
    }
};

export const getPayments = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        // Assuming store owner.
        // @ts-ignore
        const store = await prisma.store.findFirst({ where: { ownerId: userId } });
        if (!store) {
            res.json([]);
            return;
        }

        // @ts-ignore
        const payments = await prisma.payment.findMany({
            where: {
                order: {
                    storeId: store.id
                }
            },
            include: { order: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
