import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { createSocketConnection } from "../../services/socket/socket-io.service";
import AuthContext from "../../store/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { listMessages } from "../../store/redux/actions/message-action";
import { gql, useApolloClient, useLazyQuery, useQuery } from "@apollo/client";
import instance from "../../services/api/api.service";

const user1 = "65ad20c77482d874ba2f79db";
const user2 = "65ae67080587e9a3544cc503";

export function Chat() {
  const authCtx = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [conversationId, setConversationId] = useState(
    "65bcd1904e77918516de4a94"
  );

  const apolloClient = useApolloClient();
  //const messages2 = useSelector((state) => state.messages[conversationId]);
  const dispatch = useDispatch();

  const GET_Messages = gql`
    query Messages($conversation: String) {
      messages(conversation: $conversation) {
        message
        conversation
      }
    }
  `;

  // const { loading, error, data } = useQuery(GET_Messages, {
  //   variables: {
  //     conversation: "65bcd1904e77918516de4a94",
  //   },
  // });
  // console.log(data);

  // const [loadMessages, { called, loading, data }] = useLazyQuery(
  //   GET_Messages,

  //   { variables: { conversation: conversationId } }
  // );

  useEffect(() => {
    const fetchMessages = async () => {
      const result = await apolloClient.query({
        query: GET_Messages,
        variables: {
          conversation: conversationId,
        },
      });
      console.log(result.data.messages);
      dispatch(listMessages(conversationId, result.data.message));
    };
    fetchMessages();
  }, [conversationId, dispatch]);

  useEffect(() => {
    // User authentication logic
    //const userToken = Cookies.get("jwt");
    const userToken = authCtx.tokens.accessToken;
    // Establish the Socket.io connection after user authentication
    const newSocket = createSocketConnection(userToken);
    setSocket(newSocket);
    // Clean up the socket connection when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // ...

  useEffect(() => {
    if (socket) {
      // Event handler for receiving messages
      socket.on("PRIVATE_MESSAGE", (data) => {
        console.log(socket.id);
        console.log("Received message:", data);
        // Handle the received message
        setMessages((messages) => [...messages, data]);
      });
    }
  }, [socket]);

  // ...
  // Other component logic

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  const messageChangeHandler = (e) => {
    setMessageInput(e.target.value);
  };
  const sendMessage = (user) => {
    if (user == "1") {
      socket.emit("PRIVATE_MESSAGE", {
        from: user1,
        to: user2,
        content: messageInput,
      });

      setMessages((messages) => [
        ...messages,
        {
          from: user1,
          to: user2,
          content: messageInput,
        },
      ]);
    } else {
      socket.emit("PRIVATE_MESSAGE", {
        from: user2,
        to: user1,
        content: messageInput,
      });
      setMessages((messages) => [
        ...messages,
        {
          from: user2,
          to: user1,
          content: messageInput,
        },
      ]);
    }
  };

  return (
    <div className="flex items-center justify-between gap-1 h-screen">
      <div className="flex flex-col justify-center items-start basis-1/3 bg-yellow-300 h-full">
        <div
          className={`h-12 m-3  b-12 rounded-xl  w-full max-w-80 bg-gray-100  flex justify-between items-center px-5 text-sky-900`}
        >
          <span>name</span>
          <span>icon</span>
        </div>
        React Component
        <input onChange={messageChangeHandler} />
        <button onClick={() => sendMessage(1)}>send1</button>
        <button onClick={() => sendMessage(2)}>send2</button>
      </div>
      <div className="flex flex-col justify-center items-start basis-2/3 bg-yellow-100 h-full">
        {messages.map((message) => {
          return (
            <div
              className={`h-12 m-3  b-12 rounded-xl  w-full max-w-80 bg-gray-100  flex justify-between items-center px-5 text-sky-900 ${
                message.from == "65ad20c77482d874ba2f79db"
                  ? "self-start"
                  : "self-end"
              }`}
            >
              <span>{message.content}</span>
              <span>icon</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Chat;
