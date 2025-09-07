import { Router } from 'express';
import { createOrder } from '../controllers/paymentsController';

const router = Router();

router.post('/workspace/:workspaceId/create-order', createOrder);

export default router;