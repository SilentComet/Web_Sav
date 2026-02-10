import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import storeRoutes from './routes/store.routes';
import productRoutes from './routes/product.routes';
import serverRoutes from './routes/server.routes';
import pageRoutes from './routes/page.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// Helmet sets CSP which might block images from local if not configured, 
// but for static serve it should be fine.  CROSS_ORIGIN_RESOURCE_POLICY needed?
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
