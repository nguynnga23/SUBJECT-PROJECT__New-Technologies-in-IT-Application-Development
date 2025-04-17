import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
    const { title, message, userId } = req.body;
    // Logic to handle push notifications
    res.status(200).json({ success: true, message: 'Push notification sent successfully' });
});

export default router;
