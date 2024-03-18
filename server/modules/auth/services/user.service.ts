import { User } from "../models/user.model";
import { ObjectId } from "mongoose";

export default {
  findById(id: string) {
    return User.findById(id).populate({
      path: "conversations",
      populate: [{ path: "userA" }, { path: "userB" }],
    });
  },
};
