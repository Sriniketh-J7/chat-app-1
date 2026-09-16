import React, { useContext, useState, useEffect, useRef } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast'; // FIX: was missing import

const ChatContainer = () => {
  const { authUser, onlineUsers } = useContext(AuthContext);
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const scrollEnd = useRef(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || sending) return;
    setSending(true);
    try {
      await sendMessage({ text: input.trim() });
      setInput('');
    } finally {
      setSending(false);
    }
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      e.target.value = '';
      return;
    }
    setSending(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await sendMessage({ image: reader.result });
      } finally {
        setSending(false);
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center gap-3 text-gray-500 bg-white/5">
        <img src={assets.logo_icon} className="w-16 opacity-60" alt="logo" />
        <p className="text-lg font-medium text-white/80">Chat anytime, anywhere</p>
        <p className="text-sm text-gray-500">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden backdrop-blur-lg bg-white/5">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/5 flex-shrink-0">
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <img src={assets.arrow_icon} alt="back" className="w-5 rotate-180" />
        </button>
        <div className="relative">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt={selectedUser.fullname}
            className="w-9 h-9 rounded-full object-cover"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1733]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{selectedUser.fullname}</p>
          <p className={`text-xs ${onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-gray-500'}`}>
            {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
          </p>
        </div>
        <img src={assets.help_icon} alt="help" className="w-5 h-5 opacity-60 hidden md:block" />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map((msg, index) => {
          const isMine = msg.senderId === authUser._id;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <img
                src={
                  isMine
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser.profilePic || assets.avatar_icon
                }
                alt=""
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-5"
              />
              {/* Bubble */}
              <div className={`flex flex-col gap-1 max-w-[65%] ${isMine ? 'items-end' : 'items-start'}`}>
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="shared"
                    className="max-w-[220px] rounded-2xl border border-white/10 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(msg.image, '_blank')}
                  />
                ) : (
                  <p
                    className={`px-3 py-2 rounded-2xl text-sm text-white break-words leading-relaxed ${
                      isMine
                        ? 'bg-violet-600 rounded-br-md'
                        : 'bg-white/15 rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <span className="text-[10px] text-gray-500 px-1">
                  {formatMessageTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white/10 rounded-full px-4 py-2 gap-2">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? handleSendMessage(e) : null}
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 min-w-0"
              disabled={sending}
            />
            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/png,image/jpeg,image/gif,image/webp"
              hidden
              disabled={sending}
            />
            <label
              htmlFor="image"
              className={`cursor-pointer flex-shrink-0 ${sending ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'} transition-opacity`}
            >
              <img src={assets.gallery_icon} alt="attach image" className="w-5 h-5" />
            </label>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={sending || input.trim() === ''}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <img src={assets.send_button} alt="send" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
