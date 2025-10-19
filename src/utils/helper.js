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
}

export const getBackendImgURL = (imgPath) => {
    return `${Config.BACKEND_URL}${imgPath}`;
}