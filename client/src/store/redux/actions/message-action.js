import { gql } from "@apollo/client";
import { fetchMessages } from "../reducers/message-redurcer";
import apolloClient from "../../../services/graphql/graphql-client";

export const listMessages = (conversationId) => {
  return async (dispatch) => {
    const GET_Messages = gql`
      query Messages($conversation: String) {
        messages(conversation: $conversation) {
          message
          conversation
          sender
          createdAt
        }
      }
    `;

    try {
      const result = await apolloClient.query({
        query: GET_Messages,
        variables: {
          conversation: conversationId,
        },
      });

      dispatch(
        fetchMessages({ conversationId, messages: result.data.messages })
      );
    } catch (err) {
      console.log(err);
    }
  };
};
