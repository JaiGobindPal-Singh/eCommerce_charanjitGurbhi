import router from 'express';
import { getAllCategories, getCategoryByStep, createCategory } from '../controllers/categoryController.js';
import upload from '../middleware/multerMiddleware.js'
import { authorizeAdmin } from '../middleware/authMiddleware.js';
const Router = router.Router();

Router.get('/', getAllCategories);
Router.post('/create',authorizeAdmin,upload.single('icon'), createCategory);
Router.get('/:step', getCategoryByStep);

export default Router;