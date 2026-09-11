import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const Chat = () => {
  const { petId, userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "/profile",
          { withCredentials: true }
        );

        if (response.data.success) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `/messages/${petId}/${userId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [petId, userId]);

  useEffect(() => {
    const socket = io("http://localhost:7777", {
      withCredentials: true,
    });

    socket.on("newMessage", (newMessage) => {
      const senderId = newMessage.sender?._id?.toString();
      const receiverId = newMessage.receiver?._id?.toString();

      if (
        senderId === userId ||
        receiverId === userId
      ) {
        setMessages((prev) => {
          const exists = prev.some(
            (item) => item._id === newMessage._id
          );

          return exists ? prev : [...prev, newMessage];
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      const response = await axios.post(
        "/messages",
        {
          receiver: userId,
          pet: petId,
          message: message.trim(),
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.data]);
        setMessage("");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const getOtherUserName = () => {
    if (!messages.length || !currentUser) return "Chat";

    const firstMessage = messages[0];

    if (
      firstMessage.sender?._id?.toString() ===
      currentUser._id?.toString()
    ) {
      return firstMessage.receiver?.userName || "Chat";
    }

    return firstMessage.sender?.userName || "Chat";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-5">
        <h1 className="text-2xl font-bold mb-5">
          {getOtherUserName()}
        </h1>

        <div className="h-125 overflow-y-auto space-y-4 mb-5">
          {messages.map((item) => {
            const isSender =
              item.sender?._id?.toString() ===
              currentUser?._id?.toString();

            return (
              <div
                key={item._id}
                className={`flex ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-3 ${
                    isSender
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      isSender ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {item.sender?.userName}
                  </p>

                  <p className="wrap-break-word">
                    {item.message}
                  </p>

                  <p
                    className={`text-xs mt-2 ${
                      isSender
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;


