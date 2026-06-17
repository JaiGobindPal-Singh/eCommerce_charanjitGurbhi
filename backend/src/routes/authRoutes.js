import router from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/authController.js';

const Router = router.Router();
Router.post('/register', registerUser);
Router.post('/login', loginUser);
Router.post('/logout', logoutUser);

export default Router;