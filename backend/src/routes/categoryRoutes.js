import router from 'express';
import { getAllCategories, getCategoryByStep, createCategory } from '../controllers/categoryController.js';
import upload from '../middleware/multerMiddleware.js'
const Router = router.Router();

Router.get('/', getAllCategories);
Router.get('/:step', getCategoryByStep);
Router.post('/create',upload.single('icon'), createCategory);

export default Router;