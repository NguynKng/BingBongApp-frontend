import React from 'react';
import CreateStatus from "../components/CreateStatus";
import PostCard from "../components/PostCard";
import { useGetFeed } from "../hooks/usePosts";
import SpinnerLoading from '../components/SpinnerLoading';

function HomePage() {
    const { feed, loading } = useGetFeed();

    return (
        <div className="p-4 space-y-4">
            <CreateStatus />

            {/* Spinner when loading */}
            {loading ? (
                <SpinnerLoading />
            ) : (
                <>
                    {feed && feed.length > 0 ? (
                        feed.map((post) => <PostCard key={post._id} post={post} />)
                    ) : (
                        <p className="text-center text-2xl">No feeds available</p>
                    )}
                </>
            )}
        </div>
    );
}

export default HomePage;
