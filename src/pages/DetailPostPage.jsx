import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { postAPI } from "../services/api";
import { useEffect, useState } from "react";
import SpinnerLoading from "../components/SpinnerLoading";

function DetailPostPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [detailPost, setDetailPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postAPI.getPostById(postId);
        if (response && response.post) {
          setDetailPost(response.post);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        setNotFound(true);
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinnerLoading />
      </div>
    );
  }

  if (notFound || !detailPost) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 min-h-[92vh]">
        <img src="/404-error.png" alt="Not Found" className="w-40 mb-2" />
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-white mb-2">
          Post not found
        </h1>
        <p className="text-gray-500 dark:text-gray-300 max-w-md">
          The post you are looking for may have been deleted or does not exist. Please
          check the link again or go back to the previous page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        >
            Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-8 px-4 md:px-0">
      <div className="w-full max-w-xl">
        <PostCard post={detailPost} showComment={true} />
      </div> 
    </div>
  );
}

export default DetailPostPage;
