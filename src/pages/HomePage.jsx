import CreateStatus from "../components/CreateStatus";
import PostCard from "../components/PostCard";
import { useGetFeed } from "../hooks/usePosts";
import SpinnerLoading from "../components/SpinnerLoading";
import ListFriend from "../components/ListFriend";
import ListFriendBar from "../components/ListFriendBar";
import useAuthStore from "../store/authStore";
import LeftSidebar from "../components/LeftSideBar";

function HomePage({ onToggleChat }) {
    const { user } = useAuthStore();
    const { feed, setFeed, loading } = useGetFeed();

    const handleAddPost = (newPost) => {
        setFeed((prev) => [newPost, ...prev]);
    };

    const handleRemovePost = (postId) => {
        setFeed((prev) => prev.filter((post) => post._id !== postId));
    };

    return (
        <div className="min-h-screen">
            <div className="flex w-full max-w-[1920px] mx-auto justify-center lg:px-4 md:px-2 px-1 py-4 gap-4">
                
                {/* LEFT SIDEBAR: NEWS - Only visible on LG screens */}
                <aside className="hidden lg:block lg:w-[280px] xl:w-[320px] flex-shrink-0">
                    <div className="sticky top-20">
                        <LeftSidebar />
                    </div>
                </aside>

                {/* CENTER: MAIN FEED */}
                <main className="w-full max-w-[640px] flex-1 space-y-4">
                    <CreateStatus
                        onPostCreated={handleAddPost}
                        postedBy={{
                            _id: user._id,
                            name: user.fullName,
                            avatar: user.avatar,
                            slug: user.slug,
                        }}
                        postedByType="User"
                        postedById={user._id}
                    />

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <SpinnerLoading />
                        </div>
                    ) : feed?.length > 0 ? (
                        // Feed Posts
                        <div className="space-y-4">
                            {feed.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onDeletePost={handleRemovePost}
                                />
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="bg-white dark:bg-[#1b1f2b] rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-gray-400 dark:text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    No posts yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                    Be the first to share something with your friends!
                                </p>
                            </div>
                        </div>
                    )}
                </main>

                {/* RIGHT SIDEBAR: FRIEND LIST - Only visible on MD+ screens */}
                <aside className="hidden md:block md:w-[280px] lg:w-[320px] flex-shrink-0">
                    <div className="sticky top-20">
                        <ListFriend />
                    </div>
                </aside>
            </div>

            {/* MOBILE FRIEND BAR - Only visible on mobile */}
            <ListFriendBar onToggleChat={onToggleChat} />
        </div>
    );
}

export default HomePage;