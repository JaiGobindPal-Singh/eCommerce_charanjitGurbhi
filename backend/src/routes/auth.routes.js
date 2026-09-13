import router from 'express';
import { loginUser, registerUser, logoutUser, setUserAddress, isUserLoggedIn, forgotUser } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const Router = router.Router();
Router.post('/register', registerUser);
Router.post('/login', loginUser);
Router.post('/forget', forgotUser);
Router.post('/logout', logoutUser);
Router.get('/', isUserLoggedIn);
Router.patch('/set-address',authenticateUser, setUserAddress);
export default Router;