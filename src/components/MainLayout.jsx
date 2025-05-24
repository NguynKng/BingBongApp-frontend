import PropTypes from "prop-types";
import Header from "./Header";
import Meta from "./Meta";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useNotificationStore from "../store/notificationStore";
import NotificationPopup from "./NotificationPopup";

function MainLayout({ Element }) {
  const [popup, setPopup] = useState({
    isPopup: false,
    content: {
      title: "",
      author_name: "",
      author_img: "",
    },
  });
  const { addNotification } = useNotificationStore();
  const { sse } = useAuthStore();
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

  const handleClosePopup = () => {
    setPopup({
      isPopup: false,
      content: {
        title: "",
        author_name: "",
        author_img: "",
      },
    });
  };

  useEffect(() => {
    if (sse) {
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("[SSE NEW NOTIFICATION]", data);
        if (data.type) {
          addNotification(data.notification);
          setPopup({
            isPopup: true,
            content: {
              title: data.notification.content,
              author_img: data.notification.actor.avatar,
              author_name: data.notification.actor.fullName,
            },
          });
          // Auto close popup after 3 seconds
          setTimeout(() => {
            setPopup({
              isPopup: false,
              content: {
                title: "",
                author_img: "",
                author_name: "",
              },
            });
          }, 10000);
        }
      };
    }
  }, [sse, addNotification]);

  return (
    <>
      <Meta title={`BingBong`} />
      <Header onToggleChat={handleToggleChat} />
      <div className="relative mt-[64px] bg-gradient-to-br from-[#f0f4ff] to-[#fff1f7] dark:from-[#1c1f2a] dark:to-[#2a2e3d] min-h-[92vh]">
        <Element />
        {showChat && (
          <ChatBox userChat={activeChatUser} onClose={handleCloseChat} />
        )}
      </div>
      {popup.isPopup && (
        <NotificationPopup content={popup.content} onClose={handleClosePopup} />
      )}
    </>
  );
}

MainLayout.propTypes = {
  Element: PropTypes.elementType.isRequired,
};

export default MainLayout;
