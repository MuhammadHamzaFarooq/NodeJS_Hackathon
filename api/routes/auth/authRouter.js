import { Router } from "express";
import authController from "../../../controllers/auth/authController.js";
import checkUserAuth from "../../../middleware/authMiddleware.js";

const AuthRouter = Router();

const path = "/auth";

// Route Level Middleware => Protected Routes
AuthRouter.use(`${path}/login`, checkUserAuth);

// Public Routes
AuthRouter.post(`${path}/signup`, authController.register);
AuthRouter.post(`${path}/login`, authController.login);

export { AuthRouter };
