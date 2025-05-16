import CreateStatus from "../components/CreateStatus";
import PostCard from "../components/PostCard";
import { useGetFeed } from "../hooks/usePosts";
import SpinnerLoading from "../components/SpinnerLoading";

function HomePage() {
  const { feed, setFeed, loading } = useGetFeed();

  const handleAddPost = (newPost) => {
    setFeed((prev) => [newPost, ...prev]);
  };

  const handleRemovePost = (postId) => {
    setFeed((prev) => prev.filter((post) => post._id !== postId));
  }
  
  return (
    <div className="p-4 space-y-4">
      <CreateStatus onPostCreated={handleAddPost} />

      {/* Spinner when loading */}
      {loading ? (
        <SpinnerLoading />
      ) : (
        <>
          {feed && feed.length > 0 ? (
            feed.map((post) => <PostCard key={post._id} post={post} onDeletePost={handleRemovePost} />)
          ) : (
            <p className="text-center text-2xl">No feeds available</p>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
