import { Link } from "react-router-dom";
import { useGetNotifications } from "../hooks/useNotifications";
import useNotificationStore from "../store/notificationStore";
import { useEffect, useMemo, useCallback, memo } from "react";
import SpinnerLoading from "./SpinnerLoading";
import { formatTime } from "../utils/timeUtils";
import propTypes from "prop-types";
import { getBackendImgURL } from "../utils/helper";

const DropdownNotification = memo(({ notifications, onClose }) => {
  const { markAsAllRead } = useNotificationStore();
  const { loading, loadMore, hasMore } = useGetNotifications();

  // ✅ Memoize constants
  const shopType = useMemo(
    () => ["new_shop_follower", "new_order", "accepted_order"],
    []
  );

  // ✅ useCallback for isShopNotification
  const isShopNotification = useCallback(
    (noti) => shopType.includes(noti.type),
    [shopType]
  );

  // ✅ useCallback for getLink
  const getLink = useCallback((noti) => {
    switch (noti.type) {
      case "react_post":
        return `/posts/${noti.data.postId}`;
      case "comment_post":
        return `/posts/${noti.data.postId}`;
      case "reply_comment":
        return `/posts/${noti.data.postId}`;
      case "new_post":
        return `/posts/${noti.data.postId}`;
      case "friend_request":
        return `/profile/${noti.actor.slug}`;
      case "accepted_request":
        return `/profile/${noti.actor.slug}`;
      case "new_shop_follower":
        return `/shop/${noti.data.shopSlug}`;
      case "new_order":
        return `/shop/${noti.data.shopSlug}/manage/orders/${noti.data.orderId}`;
      case "accepted_order":
        return `/order/${noti.data.orderId}`;
      case "shipping_order":
        return `/order/${noti.data.orderId}`;
      case "received_order":
        return `/order/${noti.data.orderId}`;
      case "shop_cancelled_order":
        return `/order/${noti.data.orderId}`;
      case "user_cancelled_order":
        return `/shop/${noti.data.shopSlug}/manage/orders/${noti.data.orderId}`;
      case "group_join_request":
        return `/group/${noti.data.groupSlug}/manage`;
      case "group_new_member":
        return `/group/${noti.data.groupSlug}`;
      case "accepted_join_request":
        return `/group/${noti.data.groupSlug}`;
      case "like_short":
        return `/shorts/${noti.data.shortId}`;
      case "comment_short":
        return `/shorts/${noti.data.shortId}`;
      case "reply_comment_short":
        return `/shorts/${noti.data.shortId}`;
      default:
        return "#";
    }
  }, []);

  useEffect(() => {
    markAsAllRead();
  }, [markAsAllRead]);

  return (
    <div className="absolute right-0 top-[110%] w-92 bg-white rounded-xl shadow-xl z-50 p-4 custom-scroll overflow-y-auto h-[42rem] min-h-0 dark:bg-[rgb(35,35,35)]">
      <div className="font-semibold text-lg text-blue-800 mb-3 dark:text-white">
        Notifications
      </div>

      {loading ? (
        <SpinnerLoading />
      ) : notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {notifications.map((noti) => (
            <NotificationItem
              key={noti._id}
              noti={noti}
              getLink={getLink}
              isShopNotification={isShopNotification}
              onClose={onClose}
            />
          ))}

          {hasMore && <LoadMoreButton onClick={loadMore} />}
        </>
      )}
    </div>
  );
});

DropdownNotification.displayName = "DropdownNotification";

DropdownNotification.propTypes = {
  notifications: propTypes.array.isRequired,
};

// ✅ Extract EmptyState component
const EmptyState = memo(() => (
  <div className="text-center text-gray-500 py-4 dark:text-white">
    No new notifications
  </div>
));

EmptyState.displayName = "EmptyState";

// ✅ Extract NotificationItem component
const NotificationItem = memo(({ noti, getLink, isShopNotification, onClose }) => {
  // ✅ Memoize computed values
  const link = useMemo(() => getLink(noti), [getLink, noti]);
  const isShop = useMemo(
    () => isShopNotification(noti),
    [isShopNotification, noti]
  );
  const actorAvatar = useMemo(
    () => getBackendImgURL(noti.actor?.avatar),
    [noti.actor?.avatar]
  );
  const shopAvatar = useMemo(
    () => (isShop ? getBackendImgURL(noti.data?.shopAvatar) : null),
    [isShop, noti.data?.shopAvatar]
  );
  const formattedTime = useMemo(
    () => formatTime(noti.createdAt),
    [noti.createdAt]
  );

  const actorDisplayName = useMemo(() => {
    switch (noti.type) {
      case "accepted_order":
      case "shipping_order":
      case "shop_cancelled_order":
        return `${noti.data.shopName}`;
      default:
        return noti.actor.fullName;
    }
  }, [noti]);

  return (
    <Link
      to={link}
      className="flex items-start gap-3 py-3 px-2 last:border-none rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-lg dark:hover:bg-[rgb(56,56,56)]"
      onClick={onClose}
    >
      <div className="rounded-full size-10 relative shadow-sm border border-blue-100">
        <img
          src={actorAvatar}
          alt="avatar"
          className="size-full rounded-full object-cover"
          loading="lazy"
        />
        {isShop && shopAvatar && (
          <img
            src={shopAvatar}
            alt="shop"
            className="absolute rounded-full -bottom-2 -right-2 size-7 object-cover border border-gray-300"
            loading="lazy"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="text-base leading-tight">
          <span className="dark:text-white font-medium">
            {actorDisplayName}{" "}
          </span>
          <span className="dark:text-gray-300 text-gray-800">
            {noti.content}
          </span>
        </p>
        <span className="text-xs text-gray-500 dark:text-white">
          {formattedTime}
        </span>
      </div>
    </Link>
  );
});

NotificationItem.displayName = "NotificationItem";

NotificationItem.propTypes = {
  noti: propTypes.object.isRequired,
  getLink: propTypes.func.isRequired,
  isShopNotification: propTypes.func.isRequired,
};

// ✅ Extract LoadMoreButton component
const LoadMoreButton = memo(({ onClick }) => (
  <div className="flex justify-center mt-3 w-full">
    <button
      onClick={onClick}
      className="w-full px-4 py-2 font-medium text-base bg-gray-200 text-black dark:text-white rounded-lg hover:bg-gray-300 cursor-pointer transition dark:bg-gray-600 dark:hover:bg-gray-500"
    >
      Load more notifications
    </button>
  </div>
));

LoadMoreButton.displayName = "LoadMoreButton";

LoadMoreButton.propTypes = {
  onClick: propTypes.func.isRequired,
};

export default DropdownNotification;
