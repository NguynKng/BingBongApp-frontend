/**
 * Format a timestamp into a relative time string (e.g., "2m", "5h", "3d")
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted relative time
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  // Convert timestamp to Date object if it's not already
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  
  // Time difference in seconds
  const secondsAgo = Math.floor((now - date) / 1000);
  
  // Less than a minute
  if (secondsAgo < 60) {
    return 'Just now';
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

export const formatTimeToHourMinute = (
    timestamp
  ) => {
    if (!timestamp) return "";
  
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
  
    return `${hours}:${minutes}`;
  };
