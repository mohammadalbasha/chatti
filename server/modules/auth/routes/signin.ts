import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { Password } from "../utils/password";
import { User } from "../models/user.model";
import { body } from "express-validator";
import { validateRequest } from "../../common/middlewares/validate-request";
import { JWT } from "../utils/jwt";
import {
  Conversation,
  PrivateConversation,
} from "../../conversations/models/conversation.model";

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}

const router = express.Router();

router.post(
  "/api/users/signin",
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
    const existingUser = await User.findOne({ name }).populate({
      path: "conversations",
      populate: [{ path: "userA" }, { path: "userB" }],
    });
    if (!existingUser) {
      throw new Error("Invalid credentials");
    }

    // const t = await PrivateConversation.create({
    //   userA: existingUser.id,
    //   userB: existingUser.id,
    // });
    // await t.save();

    //existingUser.conversations = [t.id];
    await existingUser.save();
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new Error("Invalid Credentials");
    }

    // conservations
    //await existingUser.populate("conversations");

    // Generate JWT
    const userJwt = JWT.sign({
      id: existingUser.id,
      name: existingUser.name,
    });

    // Store it on session object
    req.session!!.jwt = userJwt;
    // req.session = {
    //   jwt: userJwt,
    // };

    //res.cookie("jwt", userJwt, { maxAge: 900000, httpOnly: true });
    //@ts-ignore
    //console.log(res.cookies);

    res.cookie("jwt", userJwt, {
      domain: "localhost",
      httpOnly: false,
    });

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
