/**
 * Format a timestamp into a relative time string (e.g., "2m", "5h", "3d")
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted relative time
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return "";

  // Convert timestamp to Date object if it's not already
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();

  // Time difference in seconds
  const secondsAgo = Math.floor((now - date) / 1000);

  // Less than a minute
  if (secondsAgo < 60) {
    return "Just now";
  }

  // Less than an hour
  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} phút`;
  }

  // Less than a day
  if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} giờ`;
  }

  // Less than a week
  if (secondsAgo < 604800) {
    const days = Math.floor(secondsAgo / 86400);
    return `${days} ngày`;
  }

  // Less than a month
  if (secondsAgo < 2592000) {
    const weeks = Math.floor(secondsAgo / 604800);
    return `${weeks} tuần`;
  }

  // Less than a year
  if (secondsAgo < 31536000) {
    const months = Math.floor(secondsAgo / 2592000);
    return `${months} tháng`;
  }

  // More than a year
  const years = Math.floor(secondsAgo / 31536000);
  return `${years} năm`;
};

export const formatTimeToHourMinute = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const formatTimeToDateOrHour = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Get the start of the current week (Monday)
  const getStartOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  if (date >= startOfWeek && date <= endOfWeek) {
    return date.toLocaleDateString("en-US", { weekday: "long" }); // e.g., Monday
  }

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`; // e.g., 5-6-2025
};

export const formatTimeToDateAndHour = (date) => {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return `Hôm nay ${hours}:${minutes}`;
  } else if (isYesterday) {
    return `Hôm qua ${hours}:${minutes}`;
  } else {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
};
