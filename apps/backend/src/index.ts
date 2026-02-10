import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from './utils/logger';
import { validateEnv } from './utils/config';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth.routes';
import storeRoutes from './routes/store.routes';
import productRoutes from './routes/product.routes';
import serverRoutes from './routes/server.routes';
import pageRoutes from './routes/page.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

// Validate environment variables before starting
const config = validateEnv();

const app = express();
const PORT = config.PORT;

// CORS configuration to allow credentials (cookies)
app.use(cors({
    origin: [
        'http://localhost:3000', // Business Portal
        'http://localhost:5173', // Hosting Dashboard
        process.env.FRONTEND_URL || '',
        process.env.FRONTEND_DASHBOARD_URL || ''
    ].filter(Boolean),
    credentials: true // Allow cookies to be sent
}));

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body parsing
app.use(express.json());
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler (MUST be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
    });
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled Rejection', {
        reason: reason
    });
    process.exit(1);
});

