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
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 border border-blue-100">
      {/* Rating Overview */}
      <div className="p-5 border-b border-blue-100 bg-blue-50/40 rounded-t-xl">
        <h1 className="font-semibold text-lg text-blue-900 mb-2">
          Product Reviews
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`size-6 ${
                  i <= Math.round(totalRating)
                    ? "fill-blue-800 text-blue-800"
                    : "stroke-blue-800"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm">
            {ratingData.length} reviews
          </span>
          {totalRating > 0 && (
            <span className="ml-2 font-semibold text-blue-800">
              {totalRating} / 5
            </span>
          )}
        </div>
      </div>

      {/* Write a Review */}
      <div className="p-5 border-b border-blue-100">
        <h2 className="text-gray-600 font-medium mb-2">
          Write your review
        </h2>
        <div className="flex gap-1 mb-3 cursor-pointer">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              onClick={() => setSelectedStars(i)}
              onMouseEnter={() => setHoverStars(i)}
              onMouseLeave={() => setHoverStars(0)}
              className={`size-7 transition-transform ${
                i <= (hoverStars || selectedStars)
                  ? "fill-blue-800 text-blue-800 scale-110"
                  : "stroke-blue-800"
              }`}
            />
          ))}
        </div>
        <textarea
          className="border border-gray-300 rounded-lg p-3 w-full h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Share your thoughts about the product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-800 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full text-sm transition disabled:opacity-50"
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
              className="border-b pb-4 last:border-b-0 transition hover:bg-blue-50/30 rounded-md p-2"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${review.postedBy.slug}`}>
                    <img
                      src={getBackendImgURL(review.postedBy?.avatar)}
                      alt={review.postedBy?.fullName}
                      className="w-8 h-8 rounded-full object-cover hover:opacity-70"
                    />
                  </Link>
                  <h3 className="font-semibold text-blue-900">
                    {review.postedBy?.fullName || "User"}
                  </h3>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i <= review.star
                            ? "fill-blue-800 text-blue-800"
                            : "stroke-blue-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDateTime(review.createdAt)}
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-center">
            No reviews for this product yet.
          </p>
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
