import React, { useEffect, useRef } from 'react'
import {useChatStore} from "../store/useChatStore"
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from "../lib/utils";
const chatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore()
 
   const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(()=>{
    getMessages(selectedUser._id)
    subscribeToMessages();
    return ()=>{
      unsubscribeFromMessages();
    }
  },[selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);
   useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (isMessagesLoading)
    return (
      <div className="flex flex-col h-full">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message, index) => {
          const isOwn = message.senderId === authUser._id;
          const isLast = index === messages.length - 1;

          return (
            <div
              key={message._id}
              className={`chat ${isOwn ? "chat-end" : "chat-start"}`}
              ref={isLast ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-8 sm:size-10 rounded-full border overflow-hidden">
                  <img
                    src={
                      isOwn
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble flex flex-col max-w-full sm:max-w-[70%] break-words">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[320px] rounded-md mb-2 object-cover"
                  />
                )}
                {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
}

export default chatContainer
