// components/IncomingCall.jsx
import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import CallWindow from "./CallWIndow";
import Config from "../envVars";
import { Ringtone } from "../utils/ringtone";

export default function IncomingCall() {
  const socket = useAuthStore((s) => s.socket);
  const currentUser = useAuthStore((s) => s.user);

  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(null);
  const [callId, setCallId] = useState(null);
  const [peer, setPeer] = useState(null);
  const [status, setStatus] = useState("idle");
  const [isOpenLeavePopup, setIsOpenLeavePopup] = useState(false);
  const activeUrlRingtone = currentUser?.ringtones?.find(
    (r) => r._id === currentUser?.activeRingtone
  )?.url;

  useEffect(() => {
    if (!socket) return;

    // ---------- Handlers ----------
    const handleIncomingCall = ({ from, callId: incomingCallId, metadata }) => {
      Ringtone.play(activeUrlRingtone);
      setMode("incoming");
      setCallId(incomingCallId);
      setPeer({
        _id: from,
        fullName: metadata?.fullName,
        avatar: metadata?.avatar,
      });
      setStatus("ringing");
      setVisible(true);
    };

    const handleCallInitiated = ({ to, callId: outgoingCallId, toData }) => {
      Ringtone.play();
      setMode("outgoing");
      setPeer({
        _id: to,
        fullName: toData?.fullName,
        avatar: toData?.avatar,
      });
      setCallId(outgoingCallId);
      setStatus("calling");
      setVisible(true);
    };

    const handleCallAccepted = ({ from, callId: acceptedId, metadata }) => {
      if (!acceptedId) return;
      if (acceptedId !== callId) return;
      Ringtone.stop();
      setStatus("connected");
      setPeer({
        _id: metadata?._id,
        fullName: metadata?.fullName,
        avatar: metadata?.avatar,
      });
    };

    const handleCallTimeout = ({ callId: timeoutId }) => {
      if (timeoutId !== callId) return;
      setStatus("timeout");
      Ringtone.stop();
      setTimeout(() => setVisible(false), 2000);
    };

    const handleEndCall = ({ from }) => {
      setIsOpenLeavePopup(true);
      setVisible(false);
      setMode(null);
      setCallId(null);
      setPeer(null);
      setStatus("idle");
    };

    const handleCallRejected = ({ from, callId: rejectedId, reason }) => {
      if (rejectedId !== callId) return;
      setStatus("rejected");
      Ringtone.stop();
      // small delay so user sees reason
      setTimeout(() => setVisible(false), 900);
    };

    // ---------- Register listeners ----------
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-initiated", handleCallInitiated); // server should emit this to caller
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);
    socket.on("call-timeout", handleCallTimeout);
    socket.on("end-call", handleEndCall);
    return () => {
      // cleanup
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-initiated", handleCallInitiated);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
      socket.off("call-timeout", handleCallTimeout);
      socket.off("end-call", handleEndCall);
    };
  }, [socket, currentUser, callId, status, activeUrlRingtone]);

  // ---------- Actions ----------
  const accept = () => {
    if (!socket || !peer || !callId || !currentUser) return;
    try {
      Ringtone.stop();
      // notify server (server will forward call-accepted to caller)
      socket.emit("accept-call", {
        to: peer._id /* caller id */,
        from: currentUser._id,
        callId,
        metadata: {
          _id: currentUser._id,
          fullName: currentUser.fullName,
          avatar: currentUser.avatar,
        },
      });
      setStatus("connected");
    } catch (e) {
      console.error("accept emit failed", e);
      setStatus("error");
    }
  };

  const reject = () => {
    if (!socket || !peer || !callId || !currentUser) return;
    try {
      Ringtone.stop();
      socket.emit("reject-call", {
        to: peer._id /* caller */,
        from: currentUser._id,
        callId,
        reason: "rejected",
      });
      setStatus("rejected");
      setTimeout(() => setVisible(false), 600);
    } catch (e) {
      console.error("reject emit failed", e);
    }
  };

  const cancel = () => {
    // caller cancels outgoing call
    if (!socket || !peer || !callId || !currentUser) {
      setVisible(false);
      return;
    }
    try {
      Ringtone.stop();
      socket.emit("reject-call", {
        to: peer._id /* callee */,
        from: currentUser._id,
        callId,
        reason: "caller-cancel",
      });
    } catch (e) {}
    setStatus("rejected");
    setTimeout(() => setVisible(false), 400);
  };

  const endCall = () => {
    // close call window, notify server
    try {
      if (socket && callId) socket.emit("end-call", { roomId: callId, from: currentUser?._id });
    } catch (e) {}
    setVisible(false);
    setMode(null);
    setCallId(null);
    setPeer(null);
    setStatus("idle");
  };

  return (
    <>
      {isOpenLeavePopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]">
          <div className="relative px-6 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-2xl w-[300px] text-center animate-fade-in">
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xl">
                📞
              </div>
            </div>

            {/* Message */}
            <p className="text-lg font-semibold mb-2">
              {"Cuộc gọi đã kết thúc"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cảm ơn bạn đã sử dụng cuộc gọi.
            </p>

            {/* Close button */}
            <button
              onClick={() => {
                setIsOpenLeavePopup(false);
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-red-500 cursor-pointer hover:bg-red-600 text-white font-medium transition"
            >
              Đóng
            </button>

            {/* Nút X ở góc */}
            <button
              onClick={() => {
                setIsOpenLeavePopup(false);
              }}
              className="absolute top-2 right-2 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {mode === "outgoing"
                  ? status === "calling"
                    ? "Đang gọi…"
                    : status === "timeout"
                    ? "Không có phản hồi"
                    : status === "rejected"
                    ? "Đã bị từ chối"
                    : status
                  : mode === "incoming"
                  ? status === "ringing"
                    ? "Cuộc gọi đến"
                    : status === "timeout"
                    ? "Người gọi đã ngắt"
                    : status === "rejected"
                    ? "Bạn đã từ chối"
                    : status
                  : "Cuộc gọi"}
              </h3>
            </div>

            {status !== "connected" && (
              <>
                {peer && (
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={`${Config.BACKEND_URL}${peer.avatar}` || "/user.png"}
                      alt={peer.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold dark:text-white">
                        {peer.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {mode === "outgoing"
                          ? "Đang chờ phản hồi..."
                          : "Gọi đến"}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  {mode === "outgoing" && (
                    <button
                      onClick={cancel}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded"
                    >
                      Hủy
                    </button>
                  )}
                  {mode === "incoming" && (
                    <>
                      <button
                        onClick={reject}
                        className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
                      >
                        Từ chối
                      </button>
                      <button
                        onClick={accept}
                        className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
                      >
                        Chấp nhận
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {status === "connected" && peer && (
              <CallWindow
                userCall={peer}
                onClose={endCall}
                isInitiator={mode === "outgoing"}
                callId={callId}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
