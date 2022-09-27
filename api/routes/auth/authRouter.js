import { Router } from "express";
import authController from "../../../controllers/auth/authController.js";
import checkUserAuth from "../../../middleware/authMiddleware.js";
import { check} from "express-validator"

const AuthRouter = Router();

const path = "/auth";

// Route Level Middleware => Protected Routes
AuthRouter.use(`${path}/login`, checkUserAuth);
AuthRouter.use(`${path}/getUser`, checkUserAuth);
AuthRouter.use(`${path}/updateUser`, checkUserAuth);
AuthRouter.use(`${path}/deleteUser`, checkUserAuth);

// Public Routes
AuthRouter.post(`${path}/signup`, [
    check("name").not().isEmpty().withMessage("Please enter name"),
    check("email", "This is not a valid email").isEmail(),
    check("password").not().isEmpty().withMessage("Please enter password"),
    check("confirmPassword").not().isEmpty().withMessage("Please enter password"),
], authController.register);

AuthRouter.post(`${path}/login`, [
    check("email", "This is not a valid email").isEmail(),
    check("password").not().isEmpty().withMessage("Please enter password"),
], authController.login);

AuthRouter.post(`${path}/getUser`, check("user_ud").not().isEmpty().withMessage("Please enter User Id"), authController.getUser);

AuthRouter.put(`${path}/updateUser`, [
    check("user_id").not().isEmpty().withMessage("Please enter User Id"),
    check("name").not().isEmpty().withMessage("Please enter name"),
    check("email", "This is not a valid email").isEmail(),
    check("password").not().isEmpty().withMessage("Please enter password"),
], authController.updateUser);

AuthRouter.delete(`${path}/deleteUser`, check("user_id").not().isEmpty().withMessage("Please enter User Id"), authController.deleteUser);

export { AuthRouter };
