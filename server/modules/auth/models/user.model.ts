import mongoose, { Schema } from "mongoose";
import { Password } from "../utils/password";
import {
  ConversationDocument,
  PrivateConversationDocument,
  PublicConversationDocument,
} from "../../conversations/models/conversation.model";

export interface UserDoc extends mongoose.Document {
  id: string;
  name: string;
  password: string;
  conversations?: ConversationDocument[];
}

interface UserAttrs {
  name: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        //delete ret._id;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
