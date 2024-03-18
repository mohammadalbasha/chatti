import mongoose from "mongoose";
import { UserDoc } from "../../auth/models/user.model";
import {
  ConversationDocument,
  PrivateConversationDocument,
  PublicConversationDocument,
} from "../../conversations/models/conversation.model";

export interface MessageDoc extends mongoose.Document {
  message: string;
  sender: UserDoc | string;
  conversation:
    | PublicConversationDocument
    | PrivateConversationDocument
    | string;
  createdAt: string;
}

interface MessageModel extends mongoose.Model<MessageDoc> {}

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const Message = mongoose.model<MessageDoc, MessageModel>(
  "Message",
  messageSchema
);
