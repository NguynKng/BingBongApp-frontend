import { Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import useAuthStore from "../store/authStore";
import { formatDateTime } from "../utils/timeUtils";
import { productAPI } from "../services/api";
import { getBackendImgURL } from "../utils/helper";
import { Link } from "react-router-dom";

export default function RatingProduct({
  productId,
  ratingData = [],
  onRatingChange,
  totalRating = 0,
}) {
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in to submit a review.");
      return;
    }
    if (!selectedStars || !comment.trim()) {
      toast.error("Please select a star rating and write a comment.");
      return;
    }

    try {
      setLoading(true);
      const response = await productAPI.rateProduct(productId, {
        star: selectedStars,
        comment,
      });
      if (response.success) {
        onRatingChange(response.data);
        toast.success("Review submitted successfully!");
        setSelectedStars(0);
        setComment("");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#1b1f2b] rounded-xl shadow-lg dark:shadow-gray-900/50 mt-5 border border-gray-200 dark:border-gray-700">
      {/* Rating Overview */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-blue-50/40 dark:bg-blue-900/10 rounded-t-xl">
        <h1 className="font-semibold text-lg text-blue-900 dark:text-blue-400 mb-2">
          Product Reviews
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`size-6 ${
                  i <= Math.round(totalRating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "stroke-yellow-500 dark:stroke-yellow-400"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {ratingData.length} reviews
          </span>
          {totalRating > 0 && (
            <span className="ml-2 font-semibold text-blue-800 dark:text-blue-400">
              {totalRating} / 5
            </span>
          )}
        </div>
      </div>

      {/* Write a Review */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
          Write your review
        </h2>
        <div className="flex gap-1 mb-3 cursor-pointer">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              onClick={() => setSelectedStars(i)}
              onMouseEnter={() => setHoverStars(i)}
              onMouseLeave={() => setHoverStars(0)}
              className={`size-7 transition-all duration-200 ${
                i <= (hoverStars || selectedStars)
                  ? "fill-yellow-500 text-yellow-500 scale-110"
                  : "stroke-yellow-500 dark:stroke-yellow-400 hover:scale-105"
              }`}
            />
          ))}
        </div>
        <textarea
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a3142] text-gray-900 dark:text-white rounded-lg p-3 w-full h-28 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
          placeholder="Share your thoughts about the product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full text-sm transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="p-5 space-y-5">
        {ratingData.length > 0 ? (
          ratingData.map((review, idx) => (
            <div
              key={idx}
              className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 transition-colors hover:bg-blue-50/30 dark:hover:bg-blue-900/10 rounded-md p-2"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${review.postedBy.slug}`}>
                    <img
                      src={getBackendImgURL(review.postedBy?.avatar)}
                      alt={review.postedBy?.fullName}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 hover:opacity-70 transition-opacity"
                    />
                  </Link>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {review.postedBy?.fullName || "User"}
                  </h3>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i <= review.star
                            ? "fill-yellow-500 text-yellow-500"
                            : "stroke-yellow-500 dark:stroke-yellow-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDateTime(review.createdAt)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <Star className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-400 dark:text-gray-500 italic text-center">
              No reviews for this product yet.
            </p>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">
              Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

RatingProduct.propTypes = {
  productId: PropTypes.string,
  ratingData: PropTypes.arrayOf(
    PropTypes.shape({
      postedBy: PropTypes.shape({
        fullName: PropTypes.string,
        avatar: PropTypes.string,
        slug: PropTypes.string,
      }),
      star: PropTypes.number,
      comment: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ),
  onRatingChange: PropTypes.func,
  totalRating: PropTypes.number,
};