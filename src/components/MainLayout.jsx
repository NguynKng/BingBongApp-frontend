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
            <div className="relative pt-[64px] bg-gray-100 lg:ml-[24rem] flex">
                <div className="lg:w-[65%] w-full px-4 md:px-8 min-h-[90vh]">
                    <Element />
                </div>
                <div className="lg:w-[35%]">
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