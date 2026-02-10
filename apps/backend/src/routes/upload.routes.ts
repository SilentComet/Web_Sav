import { Router, Request, Response } from 'express';
import upload from '../middleware/upload.middleware';

const router = Router();

router.post('/', upload.single('file'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        // Construct public URL
        const protocol = req.protocol;
        const host = req.get('host');
        const url = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.status(201).json({ url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

export default router;
