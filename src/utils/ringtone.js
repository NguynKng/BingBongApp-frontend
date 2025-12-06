import { getBackendImgURL } from "./helper";

let audio = null;
let isFading = false;
let currentSrc = null;

const DEFAULT_RINGTONE = "/images/default-avatar/sound-1.mp3"; // nhạc chuông mặc định 

export const Ringtone = {
  play(src) {
    // nếu không có activeRingtone → dùng default
    const finalSrc = src || DEFAULT_RINGTONE;

    // nếu đổi ringtone → tạo audio mới
    if (!audio || currentSrc !== finalSrc) {
      currentSrc = finalSrc;
      audio = new Audio(getBackendImgURL(finalSrc));
      audio.loop = true;
      audio.volume = 0.8;
      audio.preload = "auto";
    }

    // nếu đang phát rồi → bỏ qua
    if (!audio.paused) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});
  },

  stop() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      isFading = false;
    }
  },

  isPlaying() {
    return audio && !audio.paused;
  },

  fadeOutAndStop(durationMs = 200) {
    if (!this.isPlaying() || isFading) return;
    isFading = true;

    const fadeSteps = 20;
    const stepTime = durationMs / fadeSteps;
    const initialVol = audio.volume;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (!audio) {
        clearInterval(fadeInterval);
        return;
      }

      currentStep++;
      audio.volume = initialVol * (1 - currentStep / fadeSteps);

      if (currentStep >= fadeSteps) {
        clearInterval(fadeInterval);
        this.stop();
        audio.volume = initialVol;
        isFading = false;
      }
    }, stepTime);
  },

  unload() {
    if (audio) {
      audio.pause();
      audio.src = "";
      audio.load();
      audio = null;
      currentSrc = null;
      isFading = false;
    }
  },
};
