import router from 'express';
import { loginUser, registerUser, logoutUser, setUserAddress } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const Router = router.Router();
Router.post('/register', registerUser);
Router.post('/login', loginUser);
Router.post('/logout', logoutUser);
Router.patch('/set-address',authenticateUser, setUserAddress);
export default Router;