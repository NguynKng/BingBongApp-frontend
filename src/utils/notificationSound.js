let audio = null;

export const NotificationSound = {
  play() {
    // nếu audio chưa được tạo → tạo mới
    if (!audio) {
      audio = new Audio("/call-ring-sound/notification-sound.wav");
      audio.preload = "auto";
      audio.volume = 0.5;
    }

    // nếu đang phát rồi thì không phát lại (tránh chồng)
    if (!audio.paused) return;

    audio.currentTime = 0; // reset để phát từ đầu
    audio.play().catch(() => {});
  },

  stop() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  },

  isPlaying() {
    return audio && !audio.paused;
  },
};
