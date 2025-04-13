import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {

  const {messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages,unsubscribeFromMessages} = useChatStore();
  const messageEndRef = useRef(null);
  const { authUser } = useAuthStore();

  useEffect(()=> {
    getMessages(selectedUser._id)

    subscribeToMessages();

    return () => unsubscribeFromMessages()
  }, [getMessages,selectedUser._id,subscribeToMessages,unsubscribeFromMessages])

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col justify-between overflow-auto'>
      <ChatHeader />
      
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className={`flex flex-col gap-y-2 ${message.senderId === authUser._id ? "items-end" : "items-start "}`}>
              <div className="chat-header">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] max-w-sm w-auto h-48 rounded-md"
                  />
              )}
              {message.text && (
                <div className={`w-fit py-2.5 px-3.5 rounded-xl flex flex-col ${message.senderId === authUser._id ? "chat-bubble-primary rounded-br-none ml-3" : "chat-bubble-neutral rounded-bl-none mr-3"}`}>
                  {message.text && <p>{message.text}</p>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer
