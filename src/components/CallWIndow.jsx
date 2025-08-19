// components/CallWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { v4 as uuidv4 } from "uuid";

/**
 * Props:
 * - userCall: the remote user object { _id, fullName, avatar }
 * - onClose: function
 * - isInitiator: boolean (true if current user is caller)
 * - callId: optional; if initiator, you can omit and component will generate; if callee, pass callId
 *
 * Usage:
 * - Caller: <CallWindow userCall={callee} isInitiator={true} onClose={...} />
 * - Callee (after accept): <CallWindow userCall={caller} isInitiator={false} callId={callId} onClose={...} />
 */
export default function CallWindow({ userCall, onClose, isInitiator = true, callId: incomingCallId = null }) {
  const socket = useAuthStore((s) => s.socket);
  const currentUser = useAuthStore((s) => s.user);
  const requestTurnViaSocket = useAuthStore((s) => s.requestTurnViaSocket);
  const getIceServers = () => useAuthStore.getState().iceServers || [{ urls: "stun:stun.l.google.com:19302" }];

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const dataChannelRef = useRef(null);

  const [status, setStatus] = useState("initializing"); // initializing | calling | ringing | waiting | connected | rejected | timeout | error
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [callId] = useState(incomingCallId || uuidv4());
  const [errorMsg, setErrorMsg] = useState(null);

  // Join/request flow only if socket exists
  useEffect(() => {
    let mounted = true;
    if (!socket) {
      setErrorMsg("Socket chưa kết nối. Vui lòng connect socket (ví dụ: sau login).");
      setStatus("error");
      return;
    }
    if (!currentUser || !userCall) {
      setErrorMsg("Thiếu thông tin user.");
      setStatus("error");
      return;
    }

    setErrorMsg(null);

    (async () => {
      try {
        // If initiator: emit call-user and wait for accept/reject
        if (isInitiator) {
          setStatus("calling");
          socket.emit("call-user", {
            to: userCall._id,
            from: currentUser._id,
            callId,
            metadata: { fromName: currentUser.fullName, avatar: currentUser.avatar },
          });

          // wait for call-accepted / call-rejected (or timeout)
          const onAccepted = ({ from, callId: acceptedId }) => {
            if (acceptedId !== callId) return;
            // accepted -> both should join room
            startJoin(callId).catch(console.error);
          };
          const onRejected = ({ from, callId: rejectedId, reason }) => {
            if (rejectedId !== callId) return;
            setStatus("rejected");
            // optional show reason
            setTimeout(() => {
              if (!mounted) return;
              cleanup();
              onClose?.();
            }, 1200);
          };
          const onTimeout = ({ callId: timeoutId }) => {
            if (timeoutId !== callId) return;
            setStatus("timeout");
            setTimeout(() => {
              if (!mounted) return;
              cleanup();
              onClose?.();
            }, 1200);
          };

          socket.on("call-accepted", onAccepted);
          socket.on("call-rejected", onRejected);
          socket.on("call-timeout", onTimeout);

          // client-side timeout as safety (30s)
          const t = setTimeout(() => {
            if (!mounted) return;
            setStatus("timeout");
            socket.off("call-accepted", onAccepted);
            socket.off("call-rejected", onRejected);
            socket.off("call-timeout", onTimeout);
            // inform server optionally (not required)
            try { socket.emit("call-timeout", { callId }); } catch {}
            setTimeout(() => { if (mounted) { cleanup(); onClose?.(); } }, 1200);
          }, 30000);

          // cleanup listeners on unmount
          return () => {
            mounted = false;
            clearTimeout(t);
            socket.off("call-accepted", onAccepted);
            socket.off("call-rejected", onRejected);
            socket.off("call-timeout", onTimeout);
          };
        } else {
          // callee path: we assume the callee already emitted accept-call elsewhere (IncomingCallModal)
          // We need to join the room to start signaling (caller will create offer)
          setStatus("waiting");
          await startJoin(callId);
        }
      } catch (err) {
        console.error("CallWindow flow error:", err);
        setErrorMsg("Lỗi khi thiết lập cuộc gọi");
        setStatus("error");
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, currentUser?._id, userCall?._id]);

  // start join: request TURN, join room, attach signaling listeners (room-info -> create offer if needed)
  async function startJoin(roomId) {
    // request TURN creds (best-effort)
    try {
      await requestTurnViaSocket({ ttl: 600, timeoutMs: 7000 });
    } catch (e) {
      console.warn("requestTurn failed", e);
    }

    // attach socket listeners for signaling for this call
    const sock = socket;
    if (!sock) throw new Error("socket missing");

    const onRoomInfo = async ({ count }) => {
      try {
        await ensurePeerConnection();
        setStatus("connected"); // we'll change after negotiation but set optimistically
        // if room already has another participant, create offer
        if (count >= 2) {
          if (isInitiator) {
            await createAndSendOffer();
          } else {
            // if callee joined and caller will create offer, do nothing
          }
        }
      } catch (e) {
        console.error("onRoomInfo error", e);
      }
    };

    const onPeerJoined = async ({ socketId, userId }) => {
      // peer joined after us -> initiator should create offer
      try {
        if (isInitiator) await createAndSendOffer();
      } catch (e) { console.error(e); }
    };

    const onOffer = async ({ sdp, from }) => {
      try {
        await ensurePeerConnection();
        if (!pcRef.current) return;
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        sock.emit("answer", { roomId, sdp: pcRef.current.localDescription, to: from });
      } catch (e) { console.error("onOffer error", e); }
    };

    const onAnswer = async ({ sdp }) => {
      try {
        if (!pcRef.current) return;
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      } catch (e) { console.error("onAnswer error", e); }
    };

    const onIce = async ({ candidate }) => {
      try {
        if (!pcRef.current) return;
        await pcRef.current.addIceCandidate(candidate);
      } catch (e) { /* ignore */ }
    };

    const onEnd = () => {
      cleanup();
      onClose?.();
    };

    const onPeerLeft = () => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      setStatus("waiting");
    };

    sock.on("room-info", onRoomInfo);
    sock.on("peer-joined", onPeerJoined);
    sock.on("offer", onOffer);
    sock.on("answer", onAnswer);
    sock.on("ice-candidate", onIce);
    sock.on("end-call", onEnd);
    sock.on("peer-left", onPeerLeft);

    // finally join room
    try {
      sock.emit("join", { roomId, userId: currentUser._id });
    } catch (e) {
      console.warn("emit join failed", e);
    }

    // detach listeners when leaving
    const detach = () => {
      try {
        sock.off("room-info", onRoomInfo);
        sock.off("peer-joined", onPeerJoined);
        sock.off("offer", onOffer);
        sock.off("answer", onAnswer);
        sock.off("ice-candidate", onIce);
        sock.off("end-call", onEnd);
        sock.off("peer-left", onPeerLeft);
      } catch (e) {}
    };

    // store detach for cleanup (we'll call detach inside cleanup)
    startJoin._detach = detach;
  }

  // --- WebRTC helpers ---
  async function ensurePeerConnection() {
    if (pcRef.current) return pcRef.current;

    // get local media
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
    } catch (err) {
      console.error("getUserMedia failed", err);
      setErrorMsg("Không thể truy cập mic/camera.");
      throw err;
    }

    const iceServers = getIceServers();
    const pc = new RTCPeerConnection({ iceServers });

    // add local tracks
    localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));

    // remote track
    pc.ontrack = (e) => {
      const [remoteStream] = e.streams;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    };

    // ice -> signaling
    pc.onicecandidate = (evt) => {
      if (evt.candidate) {
        try {
          socket?.emit("ice-candidate", { roomId: callId, candidate: evt.candidate });
        } catch (e) {}
      }
    };

    // datachannel
    try {
      if (isInitiator) {
        const dc = pc.createDataChannel("chat");
        dataChannelRef.current = dc;
        dc.onopen = () => console.log("datachannel open");
        dc.onmessage = (ev) => console.log("datachannel msg", ev.data);
      }
    } catch (e) {}
    pc.ondatachannel = (ev) => {
      const ch = ev.channel;
      ch.onopen = () => console.log("remote dc open");
      ch.onmessage = (e) => console.log("remote dc msg", e.data);
    };

    pcRef.current = pc;
    return pc;
  }

  async function createAndSendOffer() {
    if (!pcRef.current) await ensurePeerConnection();
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    try {
      socket?.emit("offer", { roomId: callId, sdp: pcRef.current.localDescription });
    } catch (e) {}
  }

  // Controls
  async function toggleMute() {
    if (!localStreamRef.current) return;
    const t = localStreamRef.current.getAudioTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled;
    setIsMuted(!t.enabled);
  }

  async function toggleVideo() {
    if (!localStreamRef.current) return;
    const t = localStreamRef.current.getVideoTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled;
    setIsVideoOff(!t.enabled);
  }

  async function shareScreen() {
    if (!pcRef.current) return;
    if (!isSharing) {
      try {
        const display = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = display.getVideoTracks()[0];
        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          await sender.replaceTrack(screenTrack);
          setIsSharing(true);
          screenTrack.onended = async () => {
            const cam = localStreamRef.current?.getVideoTracks()[0];
            if (sender && cam) await sender.replaceTrack(cam);
            setIsSharing(false);
          };
        }
      } catch (e) { console.warn(e); }
    } else {
      const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
      const cam = localStreamRef.current?.getVideoTracks()[0];
      if (sender && cam) {
        await sender.replaceTrack(cam);
        setIsSharing(false);
      }
    }
  }

  function endCall() {
    try { socket?.emit("end-call", { roomId: callId }); } catch (e) {}
    cleanup();
    onClose?.();
  }

  function cleanup() {
    try {
      // detach join listeners
      if (startJoin._detach) startJoin._detach();
    } catch (e) {}
    try { socket?.emit("leave", { roomId: callId }); } catch (e) {}
    try { pcRef.current?.getSenders()?.forEach((s) => s.track?.stop()); } catch (e) {}
    try { pcRef.current?.close(); } catch (e) {}
    pcRef.current = null;
    if (localStreamRef.current) {
      try { localStreamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {}
      localStreamRef.current = null;
    }
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setIsSharing(false);
    setStatus("initializing");
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      {/* Header */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-white text-lg font-semibold">
        <img src={`${Config.BACKEND_URL}${userCall.avatar}`} alt={userCall.fullName} className="w-8 h-8 rounded-full" />
        <span>{userCall.fullName}</span>
        <span className="ml-3 text-xs text-gray-300">{status === "connected" ? "Connected" : status}</span>
      </div>

      <button onClick={onClose} className="absolute top-4 right-4 text-white cursor-pointer hover:text-gray-300">
        <X size={28} />
      </button>

      {errorMsg && <div className="absolute top-20 text-red-300 bg-black/60 px-3 py-2 rounded">{errorMsg}</div>}

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-3/4 h-3/4 bg-black rounded-2xl flex items-center justify-center text-gray-400 relative overflow-hidden">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded-2xl" />
          <div className="absolute bottom-4 right-4 w-36 h-24 overflow-hidden rounded-lg border-2 border-white bg-black">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            {isVideoOff && <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">Camera off</div>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mb-8">
        <button onClick={toggleMute} className="p-4 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600">
          {isMuted ? <MicOff className="text-red-400" /> : <Mic className="text-white" />}
        </button>

        <button onClick={toggleVideo} className="p-4 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600">
          {isVideoOff ? <VideoOff className="text-red-400" /> : <Video className="text-white" />}
        </button>

        <button onClick={shareScreen} className="p-4 bg-gray-700 rounded-full hover:bg-gray-600">
          <MonitorUp className="text-white" />
        </button>

        <button onClick={() => {
          const text = prompt("Gửi tin nhanh (DataChannel demo):");
          if (text && dataChannelRef.current?.readyState === "open") {
            dataChannelRef.current.send(JSON.stringify({ type: "chat", text }));
          } else {
            alert("DataChannel chưa sẵn sàng");
          }
        }} className="p-4 bg-gray-700 rounded-full hover:bg-gray-600">
          <MessageSquare className="text-white" />
        </button>

        <button onClick={endCall} className="p-4 bg-red-600 rounded-full hover:bg-red-700">
          <PhoneOff className="text-white" />
        </button>
      </div>
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
  callId: PropTypes.string,
};
