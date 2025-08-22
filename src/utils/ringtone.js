// src/utils/ringtone.js
import { Howl } from "howler";

let soundId = null;

const howl = new Howl({
  src: ["/call-ring-sound/sound-1.mp3"],
  loop: true,      // chuông lặp cho đến khi dừng
  volume: 0.8,
});

export const Ringtone = {
  play() {
    // nếu đã phát thì bỏ qua để tránh chồng nhiều phiên phát
    if (soundId && howl.playing(soundId)) return;
    // stop mọi phiên phát cũ (nếu có) rồi play mới
    this.stop();
    soundId = howl.play();
  },
  stop() {
    if (soundId !== null) {
      howl.stop(soundId);
      soundId = null;
    } else {
      // phòng hờ nếu bị phát không gán id (edge case)
      howl.stop();
    }
  },
  isPlaying() {
    return soundId !== null && howl.playing(soundId);
  },
  fadeOutAndStop(durationMs = 200) {
    if (!this.isPlaying()) return;
    howl.fade(howl.volume(), 0, durationMs, soundId);
    setTimeout(() => this.stop(), durationMs + 10);
  },
  unload() {
    this.stop();
    howl.unload();
  },
};