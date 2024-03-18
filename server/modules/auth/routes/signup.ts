import express, { Request, Response } from "express";

import jwt from "jsonwebtoken";

import { User } from "../models/user.model";
import { body } from "express-validator";
import { validateRequest } from "../../common/middlewares/validate-request";
import { JWT } from "../utils/jwt";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("name").isString().withMessage("name must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, password } = req.body;

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      throw new Error("Email in use");
    }

    const user = User.build({ name, password });
    await user.save();

    // Generate JWT
    const userJwt = JWT.sign({
      id: user.id,
      name: user.name,
    });

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
