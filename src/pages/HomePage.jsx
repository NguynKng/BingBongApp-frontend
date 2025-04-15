import CreateStatus from "../components/CreateStatus";
import React from 'react';
import PostCard from "../components/PostCard";  // Import PostCard
import { useGetFeed } from "../hooks/usePosts";  // Import hook để lấy dữ liệu bài viết

function HomePage(){
    const { feed } = useGetFeed(); 
    return (
        <div className="p-4 space-y-4">
            <CreateStatus />
            {/* Truyền dữ liệu bài viết vào PostCard */}
            {feed && feed.length > 0 ? (
                feed.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
                <p className="text-center text-2xl">No feeds available</p>
            )}
        </div>
    )
}

export default HomePage;    