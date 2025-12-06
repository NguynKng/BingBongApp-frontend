import {
  Phone,
  Mail,
  Clock,
  CircleAlert,
  Facebook,
  Instagram,
  Youtube,
  Star,
  Globe,
  Pencil,
  Activity,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import CreateStatus from "../CreateStatus";
import { useState, useEffect, useRef } from "react";
import PostCard from "../PostCard";
import SpinnerLoading from "../SpinnerLoading";
import { useGetOwnerPosts } from "../../hooks/usePosts";
import EditShopInfoModal from "../EditShopInfoModal";
import { Link } from "react-router-dom";
import { getBackendImgURL } from "../../utils/helper";
import { shopAPI } from "../../services/api";
import ProductCard from "../ProductCard";

export default function PostTab({ shop }) {
  const { user } = useAuthStore();
  const {
    posts,
    setPosts,
    loading: postLoading,
  } = useGetOwnerPosts("Shop", shop._id);
  const isShopOwner = user && shop.owner._id === user._id;
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [productRatings, setProductRatings] = useState([]);
  const [shopStats, setShopStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(false);
  const [newProducts, setNewProducts] = useState([]);
  const productSliderRef = useRef(null);

  useEffect(() => {
    const fetchProductRatings = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          shopAPI.getShopProductRatings(shop._id),
          shopAPI.getShopNewProducts(shop._id),
        ]);

        const productRatingResult = results[0];
        const newProductResult = results[1];

        // Xử lý product ratings
        if (
          productRatingResult.status === "fulfilled" &&
          productRatingResult.value.success
        ) {
          setProductRatings(productRatingResult.value.data);
          setShopStats((prev) => ({
            ...prev,
            averageRating: productRatingResult.value.averageRating,
            totalReviews: productRatingResult.value.data.length,
          }));
        } else {
          console.error(
            "Failed to fetch product ratings:",
            productRatingResult.reason
          );
        }

        // Xử lý new products nếu cần
        if (
          newProductResult.status === "fulfilled" &&
          newProductResult.value.success
        ) {
          setNewProducts(newProductResult.value.data);
        } else {
          console.error(
            "Failed to fetch new products:",
            newProductResult.reason
          );
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (shop?._id) {
      fetchProductRatings();
    }
  }, [shop?._id]);

  const scrollLeft = (sliderRef) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (sliderRef) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const handleAddPost = (newPost) => setPosts((prev) => [newPost, ...prev]);
  const handleRemovePost = (postId) =>
    setPosts((prev) => prev.filter((post) => post._id !== postId));

  const statusColor = {
    open: "text-green-600 bg-green-100 dark:bg-green-800/40",
    closed: "text-red-600 bg-red-100 dark:bg-red-800/40",
    maintenance: "text-yellow-600 bg-yellow-100 dark:bg-yellow-800/40",
  };

  return (
    <div className="flex lg:flex-row flex-col gap-4">
      {/* --- About Column --- */}
      <div className="lg:w-[40%] w-full space-y-4 lg:sticky top-[8.5vh] h-fit">
        <div className="rounded-xl bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] p-5 shadow-sm relative">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold dark:text-white">About</h1>
            {isShopOwner && (
              <button
                onClick={() => setIsOpenEditModal(true)}
                className="flex items-center gap-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                <Pencil size={16} /> Edit
              </button>
            )}
          </div>

          {/* Shop status */}
          <div
            className={`inline-block text-sm px-3 py-1 rounded-full font-medium mb-3 ${
              statusColor[shop.status]
            }`}
          >
            {shop.status === "open"
              ? "Open"
              : shop.status === "closed"
              ? "Closed"
              : "Maintenance"}
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {shop.description.about || "No description available."}
          </p>

          <hr className="my-4 border-gray-200 dark:border-[#2b2b3d]" />

          {/* Basic Info */}
          <div className="space-y-3 text-gray-600 dark:text-gray-300 text-base">
            <InfoItem
              icon={
                <CircleAlert className="fill-gray-500 text-white dark:text-black" />
              }
              text={`Specializes in ${shop.mainCategory || "various fields"}`}
            />
            {shop.description.address && (
              <InfoItem
                icon={
                  <MapPin className="fill-gray-500 text-white dark:text-black" />
                }
                text={shop.description.address || "No address provided"}
              />
            )}
            {shop.description.phone && (
              <InfoItem
                icon={
                  <Phone className="fill-gray-500 text-white dark:text-black" />
                }
                text={shop.description.phone || "No phone number"}
              />
            )}
            {shop.description.email && (
              <InfoItem
                icon={
                  <Mail className="fill-gray-500 text-white dark:text-black" />
                }
                text={shop.description.email || "No email"}
              />
            )}
            {shop.description.website && (
              <InfoItem
                icon={
                  <Globe className="fill-gray-500 text-white dark:text-black" />
                }
                text={shop.description.website}
                type="link"
              />
            )}
            <InfoItem
              icon={
                <Clock className="fill-gray-500 text-white dark:text-black" />
              }
              text={`${shop.openTime || "?"} - ${shop.closeTime || "?"}`}
            />
          </div>

          {/* Social media */}
          {(shop.socials?.facebook ||
            shop.socials?.instagram ||
            shop.socials?.youtube ||
            shop.socials?.tiktok) && (
            <>
              <hr className="my-4 border-gray-200 dark:border-[#2b2b3d]" />
              <div className="flex flex-wrap gap-3">
                {shop.socials.facebook && (
                  <SocialLink
                    icon={<Facebook className="text-blue-600" />}
                    url={shop.socials.facebook}
                  />
                )}
                {shop.socials.instagram && (
                  <SocialLink
                    icon={<Instagram className="text-pink-500" />}
                    url={shop.socials.instagram}
                  />
                )}
                {shop.socials.youtube && (
                  <SocialLink
                    icon={<Youtube className="text-red-600" />}
                    url={shop.socials.youtube}
                  />
                )}
                {shop.socials.tiktok && (
                  <SocialLink
                    icon={<Activity className="text-black dark:text-white" />}
                    url={shop.socials.tiktok}
                  />
                )}
              </div>
            </>
          )}

          {/* Ratings & views */}
          <hr className="my-4 border-gray-200 dark:border-[#2b2b3d]" />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-500 fill-yellow-400" size={16} />
              <span>{shopStats.averageRating} / 5</span>
            </div>
            <span>{shopStats.totalReviews} reviews</span>
          </div>
        </div>
        <div className="rounded-md bg-white dark:bg-[#1e1e2f] border-2 border-gray-200 dark:border-[#2b2b3d] p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Photos
            </h1>
            <Link
              to={`/shop/${shop.slug}/photos`}
              className="text-blue-500 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#23233b]"
            >
              View All Photos
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
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
                      className="relative w-full lg:h-32 h-56 overflow-hidden rounded-md cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-gray-200"
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
        </div>
        <div className="rounded-lg bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] p-4 space-y-2 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Top Reviews
            </h1>
          </div>
          {loading ? (
            <SpinnerLoading />
          ) : (
            <>
              {productRatings.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  No reviews available.
                </p>
              ) : (
                <div className="flex flex-col divide-y divide-gray-200 dark:divide-[#2b2b3d]">
                  {productRatings.slice(0, 5).map((r, idx) => (
                    <Link
                      to={`/shop/${shop.slug}/product/detail/${r.productSlug}`}
                      key={idx}
                      className="flex gap-3 py-4 px-3 hover:bg-gray-50 dark:hover:bg-[#2a2a3c] transition rounded-md"
                    >
                      {/* Reviewer avatar */}
                      {r.postedBy && (
                        <img
                          src={getBackendImgURL(r.postedBy.avatar)}
                          alt={r.postedBy.fullName}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      )}

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        {/* Product Name + Stars */}
                        <div className="flex items-center justify-between mb-1">
                          <h2 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {r.productName}
                          </h2>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${
                                  i < r.star
                                    ? "text-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.285-3.955a1 1 0 00-.364-1.118L2.049 9.382c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.955z" />
                              </svg>
                            ))}
                          </div>
                        </div>

                        {/* Comment */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-1">
                          {r.comment || "No comment"}
                        </p>

                        {/* Reviewer Name */}
                        {r.postedBy && (
                          <span className="text-gray-800 dark:text-gray-200 text-xs font-medium">
                            {r.postedBy.fullName}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- Posts Column --- */}
      <div className="lg:w-[60%] w-full space-y-4">
        {isShopOwner && (
          <CreateStatus
            postedBy={{
              _id: shop._id,
              name: shop.name,
              avatar: shop.avatar,
              slug: shop.slug,
            }}
            onPostCreated={handleAddPost}
            postedByType="Shop"
            postedById={shop._id}
          />
        )}

        {/* New Products Section */}
        {newProducts.length > 0 && (
          <div className="p-4 bg-white dark:bg-[#1e1e2f] rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              {/* Badge NEW ở góc trên trái của section */}
              <div className="bg-red-500 text-white text-xs font-bold py-2 px-4 rounded-full z-10">
                NEW
              </div>
              <div className="flex">
                <ChevronLeft
                  className="hover:text-red-500 cursor-pointer"
                  onClick={() => scrollLeft(productSliderRef)}
                />
                <ChevronRight
                  className="hover:text-red-500 cursor-pointer"
                  onClick={() => scrollRight(productSliderRef)}
                />
              </div>
            </div>
            <div
              className="flex overflow-x-auto custom-scroll gap-4 items-start mt-4 w-full"
              ref={productSliderRef}
            >
              {newProducts.map((product) => (
                <ProductCard key={product._id} product={product} shop={shop} />
              ))}
            </div>
          </div>
        )}
        <div className="py-2 px-4 bg-white dark:bg-[#1e1e2f] rounded-lg">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Posts
          </h1>
        </div>

        {postLoading ? (
          <SpinnerLoading />
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDeletePost={handleRemovePost}
            />
          ))
        ) : (
          <p className="text-center text-2xl dark:text-white">
            No posts available
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {isOpenEditModal && (
        <EditShopInfoModal
          shop={shop}
          onClose={() => setIsOpenEditModal(false)}
          isShopOwner={isShopOwner}
        />
      )}
    </div>
  );
}

// 🔹 Info item
function InfoItem({ type, icon, text }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      {type === "link" ? (
        <Link
          to={text}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline text-blue-600 dark:text-blue-400"
        >
          {text}
        </Link>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}

// 🔹 Social link
function SocialLink({ icon, url }) {
  return (
    <Link
      to={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 hover:underline"
    >
      {icon}
    </Link>
  );
}
