import React, { useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { createSocketConnection } from "../../services/socket/socket-io.service";
import { useDispatch, useSelector } from "react-redux";
import { listMessages } from "../../store/redux/actions/message-action";
import { addMessage } from "../../store/redux/reducers/message-redurcer";
import { selectConversation } from "../../store/redux/reducers/conversation-reducer";
import AuthContext from "../../store/auth-context";

export function Chat() {
  const authCtx = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  const conversation = useSelector(
    (state) => state.conversations.selectedConversation
  );
  const messages = useSelector(
    (state) => state.messages.messages[conversation.id]
  );

  const conversations = useSelector(
    (state) => state.conversations.conversations
  );

  const currentUser = authCtx.profile?.id;
  const partnerUser =
    conversation?.userA?.id == currentUser
      ? conversation?.userB?.id
      : conversation?.userA?.id;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversation.id) dispatch(listMessages(conversation.id));
    };
    fetchMessages();
  }, [conversation, dispatch]);

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
        console.log(data);
        dispatch(addMessage({ ...data }));
      });
    }
  }, [socket]);

  const [messageInput, setMessageInput] = useState("");

  const messageChangeHandler = (e) => {
    setMessageInput(e.target.value);
  };
  const sendMessage = () => {
    const sender = currentUser;
    const reciever = partnerUser;

    socket.emit("PRIVATE_MESSAGE", {
      from: sender,
      to: reciever,
      message: messageInput,
      conversation: conversation.id,
    });

    dispatch(
      addMessage({
        sender,
        conversation: conversation.id,
        message: messageInput,
        createdAt: new Date().toString(),
      })
    );

    setMessageInput("");
  };

  const [displaySideDrawer, setDisplaySideDrawer] = useState(false);
  const toggleSideDrawer = (event) => {
    setDisplaySideDrawer((prev) => !prev);
  };

  // For Scrolling purposes
  const ref = useRef(null);

  useEffect(() => {
    if (messages?.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages?.length]);

  return (
    <div className="flex items-center justify-between   h-[calc(100%-6rem)] 	 ">
      <div
        className={` h-full w-4 hidden max-md:flex flex-col items-center justify-center  transition-all  hover:cursor-pointer bg-slate-600 ${
          displaySideDrawer && "max-md:translate-x-64 z-40   bg-inherit"
        }`}
        onClick={toggleSideDrawer}
      >
        {!displaySideDrawer ? ">" : "<"}
      </div>
      <div
        className={`flex flex-col justify-start items-start basis-1/3 bg-yellow-300 h-full overflow-y-auto overflow-x-hidden transition-all	p-10  relative  max-md:-translate-x-72  max-md:absolute  max-md:min-w-72 max-md:h-screen max-md:top-0 z-30 max-md:items-center   ${
          displaySideDrawer && "max-md:translate-x-0  "
        }`}
      >
        {conversations?.map((conversation) => {
          return (
            <div
              className={`h-12 m-6 p-4 rounded-xl  w-full max-w-80 bg-gray-100   flex justify-between items-center px-2    text-sky-900 border-b-2 border-gray-300   hover:cursor-pointer   after:border-b-2 after:border-teal-500 after:mt-24 after:content-['']  after:absolute  after:w-full    after:left-0`}
              onClick={() => dispatch(selectConversation({ conversation }))}
            >
              <span>
                {conversation?.userA?.id == currentUser
                  ? conversation?.userB?.name
                  : conversation?.userA?.name}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col   justify-start  items-start flex-grow   bg-gradient-to-t from-slate-600 to-slate-800 h-full relative  ">
        <div className=" self-end flex flex-col  w-full flex-grow    overflow-auto    scroll scroll-smooth">
          {messages?.map((message) => {
            return (
              <div
                className={`   m-3  rounded-xl      break-all w-full max-w-80 bg-gray-100   py-4 flex justify-between items-center px-5 text-sky-900 ${
                  message.sender == authCtx.profile.id
                    ? "self-start"
                    : "self-end"
                }`}
              >
                <span className=" basis-2/3">{message.message}</span>
                <span className="   ml-4  basis-1/3   whitespace-nowrap   top-2 text-xs opacity-50">
                  {new Date(message.createdAt).toDateString()}
                </span>
              </div>
            );
          })}
          <div ref={ref} />
        </div>

        <div className=" w-full p-4 bg-slate-500 flex justify-between">
          <input onChange={messageChangeHandler} value={messageInput} />
          <button onClick={() => sendMessage()}>send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
