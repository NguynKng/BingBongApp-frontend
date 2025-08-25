// components/CallWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { CaptionsProvider } from "./Caption/CaptionContext";
import CaptionToggle from "./Caption/CaptionToggle";
import RemoteCaption from "./Caption/RemoteCaption";
import LocalCaption from "./Caption/LocalCaption";
import SimplePeer from "simple-peer";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MonitorUp,
  MessageSquare,
  X,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import Config from "../envVars";
import { createBlankVideoTrack } from "../utils/helper";
import toast from "react-hot-toast";

export default function CallWindow({
  userCall,
  onClose,
  isInitiator = false, // caller = true, callee = false
  callId,
}) {
  const socket = useAuthStore((s) => s.socket);
  const currentUser = useAuthStore((s) => s.user);
  const requestTurnViaSocket = useAuthStore((s) => s.requestTurnViaSocket);
  const getIceServers = () =>
    useAuthStore.getState().iceServers || [
      { urls: "stun:stun.l.google.com:19302" },
    ];

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerRef = useRef(null);

  // keep audio/cam streams separately
  const micStreamRef = useRef(null);
  const camStreamRef = useRef(null);
  const localCombinedStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const [status, setStatus] = useState("waiting");

  // IMPORTANT: default states -> both OFF
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // track whether remote stream exists (for showing avatar fallback)
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  // track whether remote muted
  const [hasRemoteMuted, setHasRemoteMuted] = useState(true);

  useEffect(() => {
    let poll = null;
    function checkRemote() {
      try {
        const vid = remoteVideoRef.current;
        const stream = vid?.srcObject;
        if (!stream) {
          setHasRemoteVideo(false);
          return;
        }
        const videoTracks = stream.getVideoTracks?.() || [];
        const hasValid = videoTracks.some(
          (tr) => tr && tr.readyState !== "ended" && tr.enabled !== false
        );
        setHasRemoteVideo(Boolean(hasValid));
        // chỉ clear nếu không còn video track nào (stream thực sự hết)
        const noVideoTracks = videoTracks.length === 0;
        if (noVideoTracks && vid) {
          try {
            vid.srcObject = null;
          } catch (e) {}
        }
      } catch (e) {
        // ignore
      }
    }
    poll = setInterval(checkRemote, 500); // 500ms is fine
    // also run immediately once
    checkRemote();
    return () => {
      if (poll) clearInterval(poll);
    };
  }, []);

  // ----- Join room & signaling handlers -----
  useEffect(() => {
    if (!socket || !currentUser || !userCall || !callId) return;
    // best-effort lấy TURN trước
    requestTurnViaSocket({ ttl: 600, timeoutMs: 5000 }).catch(() => {});

    // listeners
    const onRoomInfo = ({ count }) => {
      maybeCreatePeer();
    };

    const onPeerJoined = ({ socketId, userId }) => {
      // Peer vào sau -> initiator tạo offer
      maybeCreatePeer();
    };

    const onSignal = ({ data, from }) => {
      // Nhận signal từ peer -> chuyển cho simple-peer
      try {
        if (peerRef.current) {
          peerRef.current.signal(data);
        }
      } catch (e) {
        console.warn("peer.signal error", e);
      }
    };

    const onPeerVideoToggle = ({ userId, videoOn }) => {
      if (userId === userCall?._id) {
        setHasRemoteVideo(Boolean(videoOn));
        if (
          videoOn &&
          remoteVideoRef.current &&
          remoteVideoRef.current.srcObject
        ) {
          remoteVideoRef.current.play?.().catch(() => {});
        }
      }
    };

    const onPeerAudioToggle = ({ userId, audioOn }) => {
      if (userId !== userCall?._id) return;
      setHasRemoteMuted(!Boolean(audioOn));
      // nếu muốn: khi audioOn true, đảm bảo audio element đang play
      if (
        audioOn &&
        remoteAudioRef.current &&
        remoteAudioRef.current.srcObject
      ) {
        remoteAudioRef.current.play?.().catch(() => {});
      }
    };

    const onEndCall = () => {
      endCall();
    };

    socket.on("room-info", onRoomInfo);
    socket.on("peer-joined", onPeerJoined);
    socket.on("signal", onSignal);
    socket.on("peer-video-toggle", onPeerVideoToggle);
    socket.on("peer-audio-toggle", onPeerAudioToggle);
    socket.on("end-call", onEndCall);

    // join room
    socket.emit("join-room", callId);

    return () => {
      socket.off("room-info", onRoomInfo);
      socket.off("peer-joined", onPeerJoined);
      socket.off("signal", onSignal);
      socket.off("peer-video-toggle", onPeerVideoToggle);
      socket.off("peer-audio-toggle", onPeerAudioToggle);
      socket.off("end-call", onEndCall);
      // leave handled in cleanup()
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, currentUser?._id, userCall?._id, callId]);

  // helper: ensure combined stream exists
  function ensureCombinedStream() {
    if (!localCombinedStreamRef.current) {
      localCombinedStreamRef.current = new MediaStream();
    }
    return localCombinedStreamRef.current;
  }

  // ----- Create peer (no media yet) -----
  function maybeCreatePeer() {
    if (peerRef.current) return;
    const p = new SimplePeer({
      initiator: !!isInitiator,
      trickle: true,
      config: { iceServers: getIceServers() },
      // stream not passed; we'll add tracks later when user enables mic/cam
    });

    p.on("signal", (data) => {
      try {
        socket.emit("signal", {
          roomId: callId,
          data,
          fromUserId: currentUser?._id,
        });
      } catch (e) {
        console.warn("emit signal failed", e);
      }
    });

    p.on("stream", (remoteStream) => {
      try {
        // nếu stream falsy -> clear
        if (!remoteStream) {
          setHasRemoteVideo(false);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
          return;
        }

        const vTracks = remoteStream.getVideoTracks
          ? remoteStream.getVideoTracks()
          : [];
        const aTracks = remoteStream.getAudioTracks
          ? remoteStream.getAudioTracks()
          : [];

        // video exists if there is at least one non-ended track
        const hasVideo =
          vTracks.length > 0 &&
          vTracks.some((t) => t && t.readyState !== "ended");
        const hasAudio =
          aTracks.length > 0 &&
          aTracks.some((t) => t && t.readyState !== "ended");

        // update flag (used to show avatar fallback)
        setHasRemoteVideo(Boolean(hasVideo));

        if (hasVideo) {
          // attach whole stream to video element
          if (remoteVideoRef.current) {
            // only reassign srcObject if changed to avoid interrupting playback
            if (remoteVideoRef.current.srcObject !== remoteStream) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            remoteVideoRef.current.play?.().catch(() => {});
          }
          // ensure audio element not used in video case
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
        } else if (hasAudio) {
          // audio-only: attach stream to hidden audio element
          if (remoteAudioRef.current) {
            if (remoteAudioRef.current.srcObject !== remoteStream) {
              remoteAudioRef.current.srcObject = remoteStream;
            }
            remoteAudioRef.current.play?.().catch(() => {});
          }
          // clear video
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        } else {
          // no tracks -> clear both
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
        }

        // --- Attach track-level handlers so we react to mute/unmute/ended immediately ---
        try {
          (remoteStream.getTracks?.() || []).forEach((track) => {
            // onunmute: browser indicates track now producing frames/sound
            track.onunmute = () => {
              // if it's a video track, show video
              if (track.kind === "video") {
                setHasRemoteVideo(true);
                if (
                  remoteVideoRef.current &&
                  remoteVideoRef.current.srcObject !== remoteStream
                ) {
                  remoteVideoRef.current.srcObject = remoteStream;
                  remoteVideoRef.current.play?.().catch(() => {});
                }
              }
              // if audio track, ensure audio element plays
              if (track.kind === "audio" && remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = remoteStream;
                remoteAudioRef.current.play?.().catch(() => {});
              }
            };

            // onmute: track became muted (may still exist but not producing)
            track.onmute = () => {
              // small delay to let state settle (some browsers toggle quickly)
              setTimeout(() => {
                const stillHasVideo = (
                  remoteStream.getVideoTracks?.() || []
                ).some(
                  (tr) =>
                    tr && tr.readyState !== "ended" && tr.enabled !== false
                );
                setHasRemoteVideo(Boolean(stillHasVideo));
                if (!stillHasVideo && remoteVideoRef.current) {
                  try {
                    remoteVideoRef.current.srcObject = null;
                  } catch (e) {}
                }
              }, 120);
            };

            // onended: track removed/stopped -> recalc
            track.onended = () => {
              setTimeout(() => {
                const stillHasVideo = (
                  remoteStream.getVideoTracks?.() || []
                ).some((tr) => tr && tr.readyState !== "ended");
                setHasRemoteVideo(Boolean(stillHasVideo));
                if (!stillHasVideo && remoteVideoRef.current) {
                  try {
                    remoteVideoRef.current.srcObject = null;
                  } catch (e) {}
                }
              }, 120);
            };
          });
        } catch (e) {
          // ignore any errors attaching track handlers
        }
      } catch (e) {
        console.warn("on stream handler error", e);
      }
    });

    p.on("connect", () => {
      setStatus("connected");
    });

    p.on("close", () => {
      cleanup();
      onClose?.();
    });

    p.on("error", (e) => {
      console.error("peer error", e);
      toast.error(String(e));
      setStatus("error");
    });

    peerRef.current = p;
    setStatus("negotiating");
  }

  // helper: get RTCPeerConnection sender for kind (audio/video)
  function getSender(kind) {
    try {
      const pc = peerRef.current?._pc;
      if (!pc) return null;
      return (
        pc.getSenders().find((s) => s.track && s.track.kind === kind) || null
      );
    } catch (e) {
      return null;
    }
  }

  // -------- mic controls --------
  async function enableMic() {
    if (micOn) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Trình duyệt không hỗ trợ getUserMedia");
      return;
    }

    try {
      // reuse existing track nếu còn sống
      let aTrack = micStreamRef.current?.getAudioTracks?.()?.[0];
      if (aTrack && aTrack.readyState !== "ended") {
        // nếu chỉ bị disabled thì bật lại
        try {
          aTrack.enabled = true;
        } catch (e) {}
      } else {
        // cần xin permission / tạo mới
        const s = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        micStreamRef.current = s;
        aTrack = s.getAudioTracks()[0];

        // khi track end -> cleanup ref để lần bật sau recreate
        aTrack.onended = () => {
          try {
            micStreamRef.current = null;
          } catch (e) {}
        };
      }

      if (!aTrack) throw new Error("No audio track obtained");

      // ensure combined stream contains track OR else keep track separate when adding to peer
      const combined = ensureCombinedStream();

      // remove any audio tracks in combined that are stopped/ended (optional cleanup)
      combined.getAudioTracks().forEach((t) => {
        if (t.readyState === "ended") {
          try {
            combined.removeTrack(t);
          } catch (e) {}
        }
      });

      // if track not already in combined, add it (guard by id)
      const alreadyInCombined = combined
        .getAudioTracks()
        .some((t) => t.id === aTrack.id);
      if (!alreadyInCombined) {
        try {
          combined.addTrack(aTrack);
        } catch (e) {
          // some browsers may throw if track already in some stream — ignore
          console.warn("combined.addTrack failed (ignored)", e);
        }
      }

      const sender = getSender("audio");

      if (sender && sender.replaceTrack) {
        try {
          await sender.replaceTrack(aTrack);
        } catch (e) {
          console.warn(
            "sender.replaceTrack(aTrack) failed, fallback to addTrack",
            e
          );
          if (!peerRef.current) maybeCreatePeer();
          // fallback: add with a new MediaStream to avoid duplicate-in-stream errors
          const streamForAdd = new MediaStream([aTrack]);
          try {
            peerRef.current.addTrack(aTrack, streamForAdd);
          } catch (err) {
            console.warn("fallback addTrack failed", err);
          }
        }
      } else {
        if (!peerRef.current) maybeCreatePeer();
        const streamForAdd = new MediaStream([aTrack]);
        try {
          peerRef.current.addTrack(aTrack, streamForAdd);
        } catch (err) {
          console.warn("peer.addTrack fallback failed", err);
        }
      }

      setMicOn(true);
      try {
        socket.emit("audio-toggle", {
          roomId: callId,
          userId: currentUser._id,
          audioOn: true,
        });
      } catch (e) {}
    } catch (err) {
      console.error("enableMic error", err);
      toast.error("Không thể bật mic (permission/error).");
    }
  }

  async function disableMic() {
    if (!micOn) return;

    const sender = getSender("audio");

    try {
      if (sender && sender.replaceTrack) {
        try {
          await sender.replaceTrack(null); // stop sending audio
        } catch (e) {
          console.warn("replaceTrack(null) failed", e);
        }
      }
    } catch (e) {
      console.warn("error while trying replaceTrack(null)", e);
    }

    // prefer muting local track (fast) so we can reuse it when enabling again
    try {
      const aTrack = micStreamRef.current?.getAudioTracks?.()?.[0];
      if (aTrack) {
        try {
          aTrack.enabled = false;
        } catch (e) {
          // nếu không set được thì stop
          try {
            aTrack.stop();
          } catch (_) {}
        }
      }
    } catch (e) {}

    // optional: remove ended audio tracks from combined
    try {
      const combined = localCombinedStreamRef.current;
      if (combined) {
        combined.getAudioTracks().forEach((t) => {
          if (t.readyState === "ended") {
            try {
              combined.removeTrack(t);
            } catch (e) {}
          }
        });
      }
    } catch (e) {}

    setMicOn(false);
    try {
      socket?.emit("audio-toggle", {
        roomId: callId,
        userId: currentUser._id,
        audioOn: false,
      });
    } catch (e) {}
  }

  function toggleMic() {
    if (!micOn) enableMic();
    else disableMic();
  }

  async function enableCam() {
    if (videoOn) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Trình duyệt không hỗ trợ getUserMedia");
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      camStreamRef.current = s;
      if (localVideoRef.current) localVideoRef.current.srcObject = s;

      const vTrack = s.getVideoTracks()[0];

      // combine into same stream as audio (if any)
      const combined = ensureCombinedStream();
      combined.getVideoTracks().forEach((t) => combined.removeTrack(t));
      combined.addTrack(vTrack);

      const sender = getSender("video");
      if (sender && sender.replaceTrack) {
        await sender.replaceTrack(vTrack);
      } else {
        if (!peerRef.current) maybeCreatePeer();
        peerRef.current.addTrack(vTrack, combined);
      }

      setVideoOn(true);
      try {
        socket.emit("video-toggle", {
          roomId: callId,
          userId: currentUser._id,
          videoOn: true,
        });
      } catch (e) {}
    } catch (e) {
      console.error("enableCam error", e);
      toast.error("Không thể bật camera (permission/error).");
    }
  }

  async function disableCam() {
    const sender = getSender("video");
    try {
      if (sender && sender.replaceTrack) {
        // replace with a blank track (or null if replaceTrack(null) supported)
        const blank = createBlankVideoTrack();
        try {
          await sender.replaceTrack(blank);
        } catch (e) {
          try {
            await sender.replaceTrack(null);
          } catch (_) {}
        }
      }
    } catch (e) {}

    try {
      camStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch (e) {}
    camStreamRef.current = null;

    // remove video track from combined stream (so local preview uses avatar)
    try {
      const combined = localCombinedStreamRef.current;
      if (combined) {
        combined.getVideoTracks().forEach((t) => combined.removeTrack(t));
      }
    } catch (e) {}

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setVideoOn(false);
    try {
      socket.emit("video-toggle", {
        roomId: callId,
        userId: currentUser._id,
        videoOn: false,
      });
    } catch (e) {}
  }

  function toggleVideo() {
    if (!videoOn) enableCam();
    else disableCam();
  }

  // -------- screen sharing --------
  async function shareScreen() {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      toast.error("Trình duyệt không hỗ trợ chia sẻ màn hình");
      return;
    }
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = s;
      const screenTrack = s.getVideoTracks()[0];

      const sender = getSender("video");
      if (sender && sender.replaceTrack) {
        await sender.replaceTrack(screenTrack);
      } else {
        if (!peerRef.current) maybeCreatePeer();
        peerRef.current.addTrack(screenTrack, new MediaStream([screenTrack]));
      }
      setIsSharing(true);

      screenTrack.onended = async () => {
        const camTrack = camStreamRef.current?.getVideoTracks()?.[0] || null;
        const sdr = getSender("video");
        try {
          if (sdr?.replaceTrack) await sdr.replaceTrack(camTrack);
        } catch (e) {}
        setIsSharing(false);
      };
    } catch (e) {
      console.warn("shareScreen error", e);
    }
  }

  function sendMessage() {
    const txt = prompt("Nhập tin (demo DataChannel):");
    if (!peerRef.current?.connected) return alert("DataChannel chưa sẵn sàng");
    try {
      peerRef.current.send(JSON.stringify({ type: "chat", text: txt }));
    } catch (e) {
      console.warn(e);
    }
  }

  function endCall() {
    try {
      socket.emit("end-call", { roomId: callId, from: currentUser?._id });
    } catch {}
    cleanup();
    onClose?.();
  }

  function cleanup() {
    try {
      socket.emit("leave", { roomId: callId });
    } catch {}
    try {
      peerRef.current?.destroy();
    } catch {}
    peerRef.current = null;

    try {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    try {
      camStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    try {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}

    micStreamRef.current = null;
    camStreamRef.current = null;
    screenStreamRef.current = null;

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setMicOn(false);
    setVideoOn(false);
    setIsSharing(false);
    setStatus("waiting");
    setHasRemoteVideo(false);
  }

  useEffect(() => {
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <div className="absolute top-4 left-4 flex items-center gap-2 text-white text-lg font-semibold">
        <img
          src={`${Config.BACKEND_URL}${userCall.avatar}`}
          alt={userCall.fullName}
          className="w-8 h-8 rounded-full"
        />
        <span>{userCall.fullName}</span>
        {hasRemoteMuted ? (
          <MicOff className="text-red-400" size={20} />
        ) : (
          <Mic className="text-green-400" size={20} />
        )}
        <span className="ml-3 text-xs text-gray-300">{status}</span>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer text-white"
      >
        <X size={28} />
      </button>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-3/4 h-3/4 bg-black rounded-2xl relative overflow-hidden flex items-center justify-center">
          {/* REMOTE AREA: keep fixed box so layout never jumps */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Video always present, but toggle visibility via opacity -> prevents layout change */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                // use opacity to hide/show video rather than remove it
                opacity: hasRemoteVideo ? 1 : 0,
                transition: "opacity 200ms ease",
              }}
            />
            {/* Avatar fallback shown on top when no remote video */}
            {!hasRemoteVideo && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img
                  src={
                    userCall?.avatar
                      ? `${Config.BACKEND_URL}${userCall.avatar}`
                      : "/user.png"
                  }
                  alt={userCall?.fullName}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white"
                />
                <div className="mt-3 text-white text-sm">
                  {userCall?.fullName}
                </div>
              </div>
            )}
            {/* Hidden audio element for audio-only streams */}
            <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />
          </div>

          {/* LOCAL PREVIEW in corner; keep box size stable */}
          <div className="absolute bottom-4 right-4 w-36 h-24 overflow-hidden rounded-lg border-2 border-white bg-black">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ display: videoOn ? "block" : "none" }}
            />
            {!videoOn && (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <img
                  src={
                    currentUser?.avatar
                      ? `${Config.BACKEND_URL}${currentUser.avatar}`
                      : "/user.png"
                  }
                  alt={currentUser?.fullName}
                  className="w-20 h-16 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <CaptionsProvider callId={callId} peerUserId={userCall._id}>
        <LocalCaption />
        <RemoteCaption />
        {/* Controls always visible */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={toggleMic}
            className="p-4 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600"
            title={micOn ? "Tắt mic" : "Bật mic"}
          >
            {micOn ? (
              <Mic className="text-white" />
            ) : (
              <MicOff className="text-red-400" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className="p-4 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600"
            title={videoOn ? "Tắt camera" : "Bật camera"}
          >
            {videoOn ? (
              <Video className="text-white" />
            ) : (
              <VideoOff className="text-red-400" />
            )}
          </button>
          <CaptionToggle />
          <button
            onClick={shareScreen}
            className="p-4 bg-gray-700 rounded-full hover:bg-gray-600"
            title="Chia sẻ màn hình"
          >
            <MonitorUp className="text-white" />
          </button>

          <button
            onClick={sendMessage}
            className="p-4 bg-gray-700 rounded-full hover:bg-gray-600"
            title="Gửi tin nhanh (datachannel)"
          >
            <MessageSquare className="text-white" />
          </button>

          <button
            onClick={endCall}
            className="p-4 bg-red-600 rounded-full hover:bg-red-700 cursor-pointer"
            title="Kết thúc"
          >
            <PhoneOff className="text-white" />
          </button>
        </div>
      </CaptionsProvider>
    </div>
  );
}

CallWindow.propTypes = {
  userCall: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  isInitiator: PropTypes.bool,
  callId: PropTypes.string.isRequired,
};
