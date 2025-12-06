import SpinnerLoading from "../SpinnerLoading";
import { useGetOwnerPosts } from "../../hooks/usePosts";
import { getBackendImgURL } from "../../utils/helper";
import { Link } from "react-router-dom";

export default function PhotoTab({ shop }) {
  const { posts, loading } = useGetOwnerPosts("Shop", shop._id);

  return (
    <div className="bg-white dark:bg-[#1e1e2f] rounded-xl min-h-screen shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Photos
      </h2>
      {loading ? (
        <SpinnerLoading />
      ) : posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No photos available.</p>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {(() => {
            let count = 0; // đếm số ảnh hiển thị tối đa
            const maxImages = 9;

            return posts.map((post) => {
              if (!post.media || post.media.length === 0) return null;

              return post.media.map((img, idx) => {
                if (count >= maxImages) return null; // dừng khi đạt 9 ảnh
                count++;

                return (
                  <Link
                    key={`${post._id}-${idx}`}
                    to={`/posts/${post._id}`} // link đến post tương ứng
                    className="relative w-full lg:h-56 h-80 overflow-hidden rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-gray-200"
                  >
                    <img
                      src={getBackendImgURL(img)}
                      alt="Post"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </Link>
                );
              });
            });
          })()}
        </div>
      )}
    </div>
  );
}
