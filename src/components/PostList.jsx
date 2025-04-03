import posts from "../data/posts";
import PostCard from "./PostCard";

export default function PostList() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
