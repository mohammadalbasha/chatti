import { GraphQLError } from "graphql";
import {
  Conversation,
  PrivateConversation,
  PrivateConversationDocument,
} from "../models/conversation.model";
import { AddPrivateConversation } from "./types";
import mongoose from "mongoose";
import { User } from "../../auth/models/user.model";

export const AddPrivateConversationResolver: (
  input: AddPrivateConversation
) => Promise<PrivateConversationDocument | undefined> = async (
  input: AddPrivateConversation
) => {
  const conversation = await PrivateConversation.findOne({
    $or: [
      {
        userA: input.invitedUser,
        userB: input.inviterUser,
      },
      {
        userA: input.inviterUser,
        userB: input.invitedUser,
      },
    ],
  });
  if (conversation) {
    throw new GraphQLError("Conversation already exist");
  }

  try {
    let newConversation: PrivateConversationDocument;

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      newConversation = new PrivateConversation({
        userA: input.invitedUser,
        userB: input.inviterUser,
      });
      await newConversation.save();

      await User.findByIdAndUpdate(input.invitedUser, {
        $push: {
          conversations: newConversation.id,
        },
      });

      await User.findByIdAndUpdate(input.inviterUser, {
        $push: {
          conversations: newConversation.id,
        },
      });
    });
    session.endSession();

    return newConversation!;
  } catch (error) {
    console.log("error");
  }
};
