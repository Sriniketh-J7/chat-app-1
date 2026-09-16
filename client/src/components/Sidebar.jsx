import { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers } = useContext(AuthContext);
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const [input, setInput] = useState('');

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullname.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-4 overflow-y-auto text-white flex flex-col ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <div className="flex justify-between items-center mb-4">
          <img src={assets.logo} alt="logo" className="h-8 w-auto" />
          <div className="relative group">
            <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <img src={assets.menu_icon} alt="menu" className="h-5 w-5" />
            </button>
            <div className="absolute top-full right-0 z-20 w-36 mt-1 py-2 rounded-xl bg-[#1e1b3a] border border-gray-600/50 shadow-xl hidden group-hover:block">
              <button
                onClick={() => navigate('/profile')}
                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors"
              >
                Edit Profile
              </button>
              <hr className="my-1 border-gray-600/50" />
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/10 rounded-full flex items-center gap-2 px-3 py-2">
          <img src={assets.search_icon} alt="Search" className="w-3.5 h-3.5 opacity-60" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 flex-1 min-w-0"
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* User list */}
      <div className="flex flex-col mt-2 overflow-y-auto flex-1">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-8">No users found</p>
        ) : (
          filteredUsers.map((user, index) => (
            <div
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-white/10 ${
                selectedUser?._id === user._id ? 'bg-white/15' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={user.fullname}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1733]" />
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user.fullname}</p>
                <span className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-gray-500'}`}>
                  {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </span>
              </div>
              {unseenMessages[user._id] > 0 && (
                <span className="flex-shrink-0 text-xs h-5 w-5 flex items-center justify-center rounded-full bg-violet-500 font-medium">
                  {unseenMessages[user._id] > 99 ? '99+' : unseenMessages[user._id]}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
