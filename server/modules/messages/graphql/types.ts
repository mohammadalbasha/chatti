import { UserDoc } from "../../auth/models/user.model";
import { dateScalar } from "../../../graphql/scalars";

export type Message = {
  message: string;
  sender: string;
  conversation: string;
  createdAt: Date;
};

export type AddMessageInput = {
  message: string;
  sender: string;
  conversation: string;
};

export type MessageFilter = {
  conversation: string;
};
