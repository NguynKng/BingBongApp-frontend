import CreateStatus from "../components/CreateStatus";
import React from 'react';
import PostCard from "../components/PostCard";  // Import PostCard
import posts from "../data/posts";  // Import dữ liệu bài viết

function HomePage(){
    return (
        <div className="p-4 space-y-4">
            <CreateStatus />
            {/* Truyền dữ liệu bài viết vào PostCard */}
            {posts && posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
                <p>No posts available</p>
            )}
        </div>
        
    )
}

export default HomePage;    