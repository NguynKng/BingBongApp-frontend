import PropTypes from 'prop-types';
import Navbar from "./Navbar";
import Header from "./Header";
import Meta from "./Meta";
import Footer from "./Footer";
import ChatBox from "./ChatBox";
import { useState } from "react";
import ListFriend from './ListFriend';

function MainLayout({ Element }) {
    const [showChat, setShowChat] = useState(false);
    const [activeChatUser, setActiveChatUser] = useState();
    const handleToggleChat = (friend) => {
        setActiveChatUser(friend);
        setShowChat(true); // ensure ChatBox shows when a friend is clicked
      };
    
      const handleCloseChat = () => {
        setShowChat(false);
        setActiveChatUser(undefined);
      }; // giữ nguyên qua các route

    return (
        <>
            <Meta title={`BingBong`} />
            <Header onToggleChat={handleToggleChat} />
            <Navbar />
            <div className="relative pt-[64px] lg:ml-[24rem] flex bg-gradient-to-br from-[#f0f4ff] to-[#fff1f7] dark:from-[#1c1f2a] dark:to-[#2a2e3d]">
                <div className="lg:w-[60%] w-full px-2 md:px-8 min-h-[90vh]">
                    <Element />
                </div>
                <div className="md:w-[40%] md:block hidden">
                    <ListFriend onToggleChat={handleToggleChat} />
                </div>
                {showChat && (
                    <ChatBox userChat={activeChatUser} onClose={handleCloseChat} />
                )}
            </div>
        </>
    )
}

MainLayout.propTypes = {
    Element: PropTypes.elementType.isRequired,
};

export default MainLayout;