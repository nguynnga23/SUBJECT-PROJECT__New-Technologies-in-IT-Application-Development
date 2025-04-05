import { Router } from 'express';
import { GetAllCategory, AddCategory, DeleteCategory } from '../controllers/categoryController';
import { authenticate } from '../middleware/auth';

const chatRouter = Router();

// Middleware `authenticate` bây giờ đúng kiểu dữ liệu
chatRouter.get('/', authenticate, GetAllCategory);
chatRouter.post('/', authenticate, AddCategory);
chatRouter.delete('/:id', authenticate, DeleteCategory);

export default chatRouter;
