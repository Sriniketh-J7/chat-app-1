import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import ChatContainer from "../components/ChatContainer";
import { ChatContext } from "../../context/ChatContext";

const Homepage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen flex items-center justify-center sm:px-[5%] md:px-[10%] lg:px-[15%] sm:py-[3%] md:py-[5%]">
      <div
        // FIX: was 'rouded-2xl' (typo) → 'rounded-2xl'
        className={`backdrop-blur-xl border border-gray-600/70 rounded-2xl overflow-hidden w-full h-full grid ${
          selectedUser
            ? "grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr_280px]"
            : "grid-cols-1 md:grid-cols-[300px_1fr]"
        }`}
      >
        <Sidebar />
        <ChatContainer />
        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
};

export default Homepage;
