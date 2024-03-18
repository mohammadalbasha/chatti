import mongoose, { Document, Schema } from "mongoose";
import { MessageDoc } from "../../messages/models/message.model";
import { UserDoc } from "../../auth/models/user.model";

export interface ConversationDocument extends Document {
  id: string;
  messages: MessageDoc[];
  lastUpdate: Date;
}

interface ConversationModel extends mongoose.Model<ConversationDocument> {}

const conversationSchema = new Schema(
  {
    lastUpdate: { type: Date, default: Date.now },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    discriminatorKey: "type",
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export interface PrivateConversationDocument extends ConversationDocument {
  userA: UserDoc;
  userB: UserDoc;
}

const privateConversationSchema = new Schema({
  userA: { type: Schema.Types.ObjectId, ref: "User" },
  userB: { type: Schema.Types.ObjectId, ref: "User" },
});

export interface PublicConversationDocument extends ConversationDocument {
  users: UserDoc[];
}

const publicConversationSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const Conversation = mongoose.model<
  ConversationDocument,
  ConversationModel
>("Conversation", conversationSchema);
export const PrivateConversation =
  Conversation.discriminator<PrivateConversationDocument>(
    "Private",
    privateConversationSchema
  );
export const PublicConversation =
  Conversation.discriminator<PublicConversationDocument>(
    "Public",
    publicConversationSchema
  );
