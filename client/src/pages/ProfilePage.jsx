import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullname || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedImg) {
        await updateProfile({ fullname: name, bio });
        navigate("/");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullname: name, bio });
        navigate("/");
      };
    } finally {
      setLoading(false);
    }
  }

  const previewSrc = selectedImg
    ? URL.createObjectURL(selectedImg)
    : authUser?.profilePic || assets.avatar_icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 backdrop-blur-2xl">
      <div className="w-full max-w-2xl bg-white/8 backdrop-blur-md border border-gray-600/50 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/40 px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <img src={assets.arrow_icon} alt="Back" className="w-5 rotate-180" />
            </button>
            <h2 className="text-white font-semibold text-lg">Edit Profile</h2>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row-reverse items-center gap-6 p-6 sm:p-10">
          
          {/* Avatar section */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="relative group">
              <img
                src={previewSrc}
                alt="Profile"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-violet-500/50"
              />
              <label
                htmlFor="avatar"
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input
                onChange={(e) => setSelectedImg(e.target.files[0])}
                type="file"
                id="avatar"
                accept=".png,.jpg,.jpeg"
                hidden
              />
            </div>
            <p className="text-xs text-gray-400 text-center">
              Click photo to change
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Full Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                placeholder="Your name"
                className="p-3 bg-white/10 border border-gray-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Bio
              </label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                placeholder="Write a short bio about yourself"
                required
                className="p-3 bg-white/10 border border-gray-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-500 resize-none"
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/30 active:scale-[0.98]"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
