import { ObjectId } from "mongodb";
import { PrivateConversation } from "../../conversations/models/conversation.model";
import { UserPayload } from "../middlewares/current-user";
import { User, UserDoc } from "../models/user.model";
import { SigninInput, UserFilter } from "./types";
import { Pagination } from "../../common/types/pagination";

export const SigninResolver = async (input: SigninInput) => {};

export const ListUnAddedUsersResolver = async (
  currentUser: UserPayload,
  filter: UserFilter,
  pagination: Pagination
) => {
  const currentUserId = new ObjectId(currentUser.id);
  const { conversations } = (await User.findById(currentUserId).select(
    "conversations "
  )) as UserDoc;
  const usersWithoutConversations = await User.find({
    ...(filter?.name && { name: filter?.name }),
    _id: { $ne: currentUserId },
    conversations: { $nin: conversations },
  })
    .skip(pagination?.skip || 0)
    .limit(pagination?.limit || 10);

  // const usersWithoutConversations2 = await User.aggregate([
  //   // Match users who are not the current user
  //   { $match: { _id: { $ne: currentUserId } } },

  //   // Lookup conversations for each user
  //   {
  //     $lookup: {
  //       from: "conversations",
  //       let: { user_id: "$_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $and: [
  //                 {
  //                   $or: [
  //                     { $eq: ["$userA", "$$user_id"] },
  //                     { $eq: ["$userB", "$$user_id"] },
  //                   ],
  //                 },
  //                 {
  //                   $or: [
  //                     { $eq: ["$userA", currentUserId] },
  //                     { $eq: ["$userB", currentUserId] },
  //                   ],
  //                 },
  //               ],
  //             },
  //           },
  //         },
  //         { $project: { _id: 1 } },
  //       ],
  //       as: "conversations",
  //     },
  //   },

  //   // Filter users who have no conversations
  //   { $match: { conversations: [] } },
  // ]);

  // console.log(usersWithoutConversations2.length);

  return usersWithoutConversations;
};
