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
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import CreateStatus from "../CreateStatus";
import { useState } from "react";
import PostCard from "../PostCard";
import SpinnerLoading from "../SpinnerLoading";
import { useGetOwnerPosts } from "../../hooks/usePosts";
import EditShopInfoModal from "../EditShopInfoModal";
import { Link } from "react-router-dom";

export default function PostTab({ shop }) {
  const { user } = useAuthStore();
  const { posts, setPosts, loading } = useGetOwnerPosts("Shop", shop._id);
  const isShopOwner = user && shop.owner._id === user._id;
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

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
      {/* --- Cột Giới thiệu --- */}
      <div className="lg:w-[40%] w-full space-y-4 lg:sticky top-[8.5vh] h-fit">
        <div className="rounded-xl bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] p-5 shadow-sm relative">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold dark:text-white">Giới thiệu</h1>
            {isShopOwner && (
              <button
                onClick={() => setIsOpenEditModal(true)}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                <Pencil size={16} /> Chỉnh sửa
              </button>
            )}
          </div>

          {/* Trạng thái hoạt động */}
          <div
            className={`inline-block text-sm px-3 py-1 rounded-full font-medium mb-3 ${
              statusColor[shop.status]
            }`}
          >
            {shop.status === "open"
              ? "Đang hoạt động"
              : shop.status === "closed"
              ? "Đang đóng cửa"
              : "Đang bảo trì"}
          </div>

          {/* Mô tả */}
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {shop.description.about || "Chưa có mô tả về cửa hàng."}
          </p>

          <hr className="my-4 border-gray-200 dark:border-[#2b2b3d]" />

          {/* Thông tin cơ bản */}
          <div className="space-y-3 text-gray-600 dark:text-gray-300 text-base">
            <InfoItem
              icon={<CircleAlert className="fill-gray-500 text-white dark:text-black" />}
              text={`Shop chuyên ${shop.mainCategory || "đa lĩnh vực"}`}
            />
            <InfoItem
              icon={<MapPin className="fill-gray-500 text-white dark:text-black" />}
              text={shop.description.address || "Chưa có địa chỉ"}
            />
            <InfoItem
              icon={<Phone className="fill-gray-500 text-white dark:text-black" />}
              text={shop.description.phone || "Chưa có số điện thoại"}
            />
            <InfoItem
              icon={<Mail className="fill-gray-500 text-white dark:text-black" />}
              text={shop.description.email || "Chưa có email"}
            />
            <InfoItem
              icon={<Globe className="fill-gray-500 text-white dark:text-black" />}
              text={shop.description.website}
              type="link"
            />
            <InfoItem
              icon={<Clock className="fill-gray-500 text-white dark:text-black" />}
              text={`${shop.openTime || "?"} - ${shop.closeTime || "?"}`}
            />
          </div>

          {/* Mạng xã hội */}
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

          {/* Đánh giá & lượt xem */}
          <hr className="my-4 border-gray-200 dark:border-[#2b2b3d]" />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-500 fill-yellow-400" size={16} />
              <span>{shop.stats.rating.toFixed(1)} / 5</span>
            </div>
            <span>{shop.stats.totalReviews} lượt đánh giá</span>
            <span>{shop.stats.views} lượt xem</span>
          </div>
        </div>
      </div>

      {/* --- Cột Bài viết --- */}
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

        <div className="py-2 px-4 bg-white dark:bg-[#1e1e2f] rounded-lg">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Bài viết
          </h1>
        </div>

        {loading ? (
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
            Không có bài viết nào
          </p>
        )}
      </div>

      {/* Modal chỉnh sửa */}
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

// 🔹 Item thông tin
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

// 🔹 Liên kết mạng xã hội
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
