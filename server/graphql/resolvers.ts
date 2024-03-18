// Resolvers define the technique for fetching the types defined in the

import { MessageDoc } from "../modules/messages/models/message.model";
import {
  AddMessageResolver,
  MessagesResolver,
} from "../modules/messages/graphql/message.resolver";
import { AddMessageInput } from "../modules/messages/graphql/types";
import { dateScalar } from "./scalars";
import {
  ListUnAddedUsers,
  SigninInput,
  SigninResponse,
} from "../modules/auth/graphql/types";
import { AddPrivateConversation } from "../modules/conversations/graphql/types";
import { MyContext } from ".";
import { ListUnAddedUsersResolver } from "../modules/auth/graphql/auth.resolver";
import { UserDoc } from "../modules/auth/models/user.model";
import { AddPrivateConversationResolver } from "../modules/conversations/graphql/conversation.resolver";
import { PrivateConversationDocument } from "../modules/conversations/models/conversation.model";

// schema. This resolver retrieves books from the "books" array above.
export const resolvers = {
  Date: dateScalar,
  Conversation: {
    __resolveType(obj: any, contextValue: any, info: any) {
      // Only Author has a name field

      if (obj.userA) {
        return "Private";
      }

      // Only Book has a title field
      else {
        return "Public";
      }

      //  return null; // GraphQLError is thrown
    },
  },
  Query: {
    messages: MessagesResolver,
    listUnAddedUsers: (
      _parent: any,
      { args, ...rest }: { args: ListUnAddedUsers },
      context: MyContext
    ) => {
      return ListUnAddedUsersResolver(
        context.user!,
        args.filter,
        args.pagination
      );
    },
  },

  Mutation: {
    addMessage: async (
      _parent: any,
      { input }: { input: AddMessageInput }
    ): Promise<MessageDoc> => {
      return await AddMessageResolver(input);
    },

    signin: async (
      _parent: any,
      { input }: { input: SigninInput }
    ): Promise<SigninResponse> => {
      return {
        accessToken: "",
        user: {
          name: "",
          password: "",
        } as UserDoc,
      };
    },

    addPrivateConversation: async (
      _parent: any,
      { input }: { input: AddPrivateConversation },
      context: MyContext
    ): Promise<PrivateConversationDocument | undefined> => {
      return AddPrivateConversationResolver({
        invitedUser: context.user?.id!,
        inviterUser: input.invitedUser,
      });
    },
  },
};
