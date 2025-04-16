import PropTypes from 'prop-types';
import Navbar from "./Navbar";
import Header from "./Header";
import Meta from "./Meta";
import Footer from "./Footer";
import ChatBox from "./ChatBox";
import { useState } from "react";

function MainLayout({ Element }) {
    const [showChat, setShowChat] = useState(false); // giữ nguyên qua các route

    return (
        <>
            <Meta title={`BingBong`} />
            <Header onToggleChat={() => setShowChat(prev => !prev)} />
            <Navbar />

            <div className="relative pt-[10vh] min-h-screen bg-gray-100 lg:ml-[25%]">
                <div className="lg:w-[70%] w-full px-4 md:px-8 min-h-[90vh]">
                    <Element />
                    <Footer />
                </div>
                
                {showChat && (
                    <ChatBox onClose={() => setShowChat(false)} />
                )}
            </div>
        </>
    )
}

MainLayout.propTypes = {
    Element: PropTypes.elementType.isRequired,
};

export default MainLayout;