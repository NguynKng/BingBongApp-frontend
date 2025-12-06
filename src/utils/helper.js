// helper: create a black (blank) video track to replace camera when user "turns off" video
import Config from "../envVars";

export const createBlankVideoTrack = (width = 640, height = 480) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // captureStream returns a MediaStream; get video track
  const stream = canvas.captureStream(1); // 1 fps is fine for a static black frame
  const [track] = stream.getVideoTracks();
  // keep track disabled to indicate "no signal" (optional)
  track.enabled = false;
  return track;
};

export const getBackendImgURL = (imgPath) => {
  return `${Config.BACKEND_URL}${imgPath}`;
};

export const getProfileLink = (entity, type) => {
    if (!entity?.slug) return "#";
    switch (type) {
      case "User":
        return `/profile/${entity.slug}`;
      case "Shop":
        return `/shop/${entity.slug}`;
      case "Group":
        return `/group/${entity.slug}`;
      default:
        return "#";
    }
  };

export const getContrastColor = (hex) => {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);

  const brightness = r * 0.299 + g * 0.587 + b * 0.114;

  return brightness > 186 ? "#000000" : "#FFFFFF";
};

export const badgeTierToColor = (tier) => {
    switch (tier) {
        case "Bronze":
            return "#B87333";
        case "Silver":
            return "#C0C0C0";
        case "Gold":
            return "#FFD700";
        case "Platinum":
            return "#0fbf9c";
        case "Diamond":
            return "#1464F4";
        case "Master":
            return "#7B1FA2";
        case "Grandmaster":
            return "#D32F2F";
        case "Challenger":
            return "#FF8C00";
        default:
            return "#3B82F6"; // default accent color
    }
}

export const getEquippedBadge = (user) => {
    if (!user || !user.badgeInventory) return null;
    return user?.badgeInventory?.find(b => b.badgeId && b.isEquipped)?.badgeId ?? null;
}