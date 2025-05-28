import PropTypes from "prop-types";
import Header from "./Header";
import Meta from "./Meta";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useNotificationStore from "../store/notificationStore";
import NotificationPopup from "./NotificationPopup";
import { useCallback } from "react";

function MainLayout({ Element }) {
  const { addNotification } = useNotificationStore();
  const { sse } = useAuthStore();
  const [showChat, setShowChat] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState();

  const [popup, setPopup] = useState({
    isPopup: false,
    content: {
      title: "",
      author_name: "",
      author_img: "",
    },
  });

  const handleGetNewMessage = useCallback(
    (sender) => {
      setShowChat(true);
      setActiveChatUser(sender);
    },
    [setShowChat, setActiveChatUser]
  );

  const handleGetNotificationsAndPopup = useCallback(
    (notification) => {
      addNotification(notification);
      setPopup({
        isPopup: true,
        content: {
          title: notification.content,
          author_img: notification.actor.avatar,
          author_name: notification.actor.fullName,
        },
      });
      const timer = setTimeout(() => {
        setPopup({
          isPopup: false,
          content: {
            title: "",
            author_img: "",
            author_name: "",
          },
        });
      }, 10000);

      return () => clearTimeout(timer);
    },
    [addNotification, setPopup]
  ); // include dependencies if needed
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
        if (data.type) {
          if (data.type === "new_message") {
            console.log("[SSE NEW MESSAGE]", data);
            handleGetNewMessage(data.sender);
          } else {
            console.log("[SSE NEW NOTIFICATION]", data);
            handleGetNotificationsAndPopup(data.notification);
          }
        }
      };
    }
  }, [sse, handleGetNotificationsAndPopup, handleGetNewMessage]);

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
