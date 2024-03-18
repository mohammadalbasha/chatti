import { User } from "../../auth/models/user.model";
import {
  Conversation,
  PublicConversationDocument,
  PrivateConversationDocument,
  PrivateConversation,
} from "../../conversations/models/conversation.model";
import { Message } from "../models/message.model";
import { AddMessageInput, MessageFilter } from "./types";

export const MessagesResolver = async (_: any, args: MessageFilter) => {
  const messages = await Message.find(args);
  return messages;
};

export const AddMessageResolver = async (input: AddMessageInput) => {
  const message = new Message();
  const sender = await User.findById(input.sender);
  const conversation = (await PrivateConversation.findById(
    input.conversation
  )) as PublicConversationDocument | PrivateConversationDocument;
  message.sender = input.sender!;
  message.message = input.message;
  message.conversation = input.conversation!;
  await message.save();
  await message.populate("sender");
  return message;
};
