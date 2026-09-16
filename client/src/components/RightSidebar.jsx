import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  if (!selectedUser) return null;

  return (
    // FIX: was using a string "{selecteduser ? ...}" instead of a proper className expression
    <div className="bg-[#8185B2]/10 text-white w-full flex flex-col overflow-hidden max-md:hidden">
      {/* User info */}
      <div className="flex flex-col items-center gap-2 pt-10 pb-4 px-4 border-b border-white/10">
        <div className="relative">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={selectedUser.fullname}
            className="w-20 h-20 rounded-full object-cover border-2 border-violet-500/40"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#1a1733]" />
          )}
        </div>
        <div className="text-center">
          <h2 className="font-semibold text-base flex items-center gap-2 justify-center">
            {selectedUser.fullname}
          </h2>
          <span className={`text-xs ${onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-gray-500'}`}>
            {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
          </span>
        </div>
        {selectedUser.bio && (
          <p className="text-xs text-gray-400 text-center px-4 leading-relaxed">{selectedUser.bio}</p>
        )}
      </div>

      {/* Media grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
          Shared Media ({msgImages.length})
        </p>
        {msgImages.length === 0 ? (
          <p className="text-xs text-gray-600 text-center mt-4">No media shared yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => setPreviewImg(url)}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-white/5"
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <button
          onClick={logout}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white text-sm font-medium rounded-full transition-all duration-200 active:scale-[0.98]"
        >
          Logout
        </button>
      </div>

      {/* Image preview modal */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            <img src={previewImg} alt="preview" className="w-full rounded-xl shadow-2xl" />
            <div className="flex justify-center mt-4">
              <a
                href={previewImg}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-violet-400 hover:text-violet-200 underline"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
