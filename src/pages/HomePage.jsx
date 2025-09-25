import CreateStatus from "../components/CreateStatus";
import PostCard from "../components/PostCard";
import { useGetFeed } from "../hooks/usePosts";
import SpinnerLoading from "../components/SpinnerLoading";
import { useState } from "react";
import ListFriend from "../components/ListFriend";
import ChatBox from "../components/ChatBox";
import ListFriendBar from "../components/ListFriendBar";

function HomePage() {
  const { feed, setFeed, loading } = useGetFeed();
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

  const handleAddPost = (newPost) => {
    setFeed((prev) => [newPost, ...prev]);
  };

  const handleRemovePost = (postId) => {
    setFeed((prev) => prev.filter((post) => post._id !== postId));
  };

  return (
    <>
      <div className="flex lg:p-4 md:p-2 p-1 lg:ml-[20rem] lg:mr-0">
        <div className="md:w-[60%] w-full px-2 md:px-8 space-y-4">
          <CreateStatus onPostCreated={handleAddPost} />
          {/* Spinner when loading */}
          {loading ? (
            <SpinnerLoading />
          ) : (
            <>
              {feed && feed.length > 0 ? (
                feed.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onDeletePost={handleRemovePost}
                  />
                ))
              ) : (
                <p className="text-center text-2xl">No feeds available</p>
              )}
            </>
          )}
        </div>
        <div className="md:w-[40%] md:block hidden">
          <ListFriend onToggleChat={handleToggleChat} />
        </div>
        <ListFriendBar onToggleChat={handleToggleChat} />
      </div>
      {showChat && (
        <ChatBox userChat={activeChatUser} onClose={handleCloseChat} />
      )}
    </>
  );
}

export default HomePage;
