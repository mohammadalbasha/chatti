import { gql } from "@apollo/client";
import { fetchMessages } from "../reducers/message-redurcer";
import apolloClient from "../../../services/graphql/graphql-client";
import { addConversation } from "../reducers/conversation-reducer";

export const addPrivateConversation = (data) => {
  return async (dispatch) => {
    const ADD_PRIVATE_CONVERSATION = gql`
      mutation AddPrivateConversation($input: AddPrivateConversationInput!) {
        addPrivateConversation(input: $input) {
          lastUpdate
          userA
          userB
          id
          _id
        }
      }
    `;

    try {
      const result = await apolloClient.mutate({
        mutation: ADD_PRIVATE_CONVERSATION,
        variables: {
          input: {
            inviterUser: data.inviterId,
            invitedUser: data.invitedId,
          },
        },
      });

      dispatch(
        addConversation({ conversation: result.data.addPrivateConversation })
      );
    } catch (err) {
      console.log(err);
    }
  };
};
