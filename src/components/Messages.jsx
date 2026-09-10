import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("http://localhost:7777/messages", {
          withCredentials: true,
        });

        if (response.data.success) {
          setConversations(response.data.conversations || []);
        }
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-saira mb-6">Messages</h1>

        <div className="bg-white rounded-xl shadow-md p-5">
          {conversations.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No messages yet
            </p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={`${conversation.user._id}-${conversation.pet._id}`}
                className="flex items-center justify-between border-b last:border-0 py-4"
              >
                <div>
                  <h2 className="font-semibold text-lg">
                    {conversation.user.userName}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {conversation.pet.petName}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(conversation.lastMessageTime).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/chat/${conversation.pet._id}/${conversation.user._id}`
                    )
                  }
                  className="bg-black text-white px-4 py-2 rounded-lg"
                >
                  Show Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;




