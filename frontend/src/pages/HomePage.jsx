import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/chatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Mobile layout: single screen at a time with smooth slide transition */}
            <div className="flex w-full h-full md:hidden relative overflow-hidden">
              {/* User list / sidebar screen */}
              <div
                className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${
                  selectedUser ? "-translate-x-full" : "translate-x-0"
                }`}
              >
                <Sidebar />
              </div>

              {/* Chat screen */}
              <div
                className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${
                  selectedUser ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {selectedUser && <ChatContainer />}
              </div>
            </div>

            {/* Desktop layout: sidebar + chat side-by-side */}
            <div className="hidden md:flex h-full w-full">
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;