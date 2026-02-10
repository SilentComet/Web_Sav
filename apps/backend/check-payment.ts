import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    try {
        // @ts-ignore
        if (prisma.payment) {
            console.log('Payment model exists on PrismaClient');
        } else {
            console.error('Payment model DOES NOT exist on PrismaClient');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
