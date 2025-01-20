import express from 'express'
import { allUsers, authUser, registerUser } from '../controllers/userControllers.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers)
router.route('/login').post(authUser)

export default router



// https://deuein9wj.api.cloudinary.com/v1_1/image/upload
