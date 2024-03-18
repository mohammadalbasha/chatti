import { Request, Response, NextFunction } from "express";
import { JWT } from "../utils/jwt";
import UserService from "../../auth/services/user.service";
import { UserDoc } from "../models/user.model";

export interface UserPayload {
  id: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | UserDoc;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = JWT.verify(req.session.jwt) as UserPayload;
    const user = await UserService.findById(payload.id);
    req.currentUser = user!;
  } catch (err) {}

  next();
};
