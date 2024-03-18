import jwt from "jsonwebtoken";
import { UserPayload } from "../middlewares/current-user";

// interface JWTPayload {
//     id: string,
//     name: string
// }
export class JWT {
  static sign(payload: UserPayload): string {
    const userJwt = jwt.sign(payload, process.env.JWT_KEY!);
    return userJwt;
  }

  static verify(jwtToken: string): UserPayload {
    const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as UserPayload;
    return payload;
  }
}
