// components/IncomingCall.jsx
import React, { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/authStore";
import CallWindow from "./CallWIndow";
import Config from "../envVars";

export default function IncomingCall() {
  const socket = useAuthStore((s) => s.socket);
  const currentUser = useAuthStore((s) => s.user);

  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(null); // "outgoing" | "incoming" | null
  const [callId, setCallId] = useState(null);
  const [peer, setPeer] = useState(null); // { _id, fullName, avatar }
  const [status, setStatus] = useState("idle"); // idle|calling|ringing|connected|rejected|timeout|error
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // ---------- Handlers ----------
    const handleIncomingCall = ({ from, callId: incomingCallId, metadata }) => {
      setMode("incoming");
      setCallId(incomingCallId);
      setPeer({
        _id: from,
        fullName: metadata?.fullName,
        avatar: metadata?.avatar,
      });
      setStatus("ringing");
      setVisible(true);

      // start timeout (30s)
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (status === "ringing") {
          setStatus("timeout");
          try {
            socket.emit("reject-call", {
              to: from,
              from: currentUser?._id,
              callId: incomingCallId,
              reason: "no-answer",
            });
          } catch (e) {}
          // auto close shortly
          setTimeout(() => setVisible(false), 900);
        }
      }, 30000);
    };

    const handleCallInitiated = ({ to, callId: outgoingCallId, metadata }) => {
      // CALLER receives call-initiated (server echo) -> show outgoing UI
      // Here `to` is callee id; caller is currentUser
      setMode("outgoing");
      setCallId(outgoingCallId);
      setPeer({
        _id: to,
        fullName: metadata?.fullName,
        avatar: metadata?.avatar,
      });
      setStatus("calling");
      setVisible(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (status === "calling") {
          setStatus("timeout");
          // keep modal for a moment then close
          setTimeout(() => setVisible(false), 900);
        }
      }, 30000);
    };

    const handleCallAccepted = ({ from, callId: acceptedId, metadata }) => {
      if (!acceptedId) return;
      if (acceptedId !== callId) return;
      setStatus("connected");
      setPeer({
        _id: metadata?._id,
        fullName: metadata?.fullName,
        avatar: metadata?.avatar,
      });
      // keep modal visible and render CallWindow
    };

    const handleCallRejected = ({ from, callId: rejectedId, reason }) => {
      if (rejectedId !== callId) return;
      setStatus("rejected");
      // small delay so user sees reason
      setTimeout(() => setVisible(false), 900);
    };

    const handleCallTimeout = ({ callId: timeoutId }) => {
      if (timeoutId !== callId) return;
      setStatus("timeout");
      setTimeout(() => setVisible(false), 900);
    };

    // ---------- Register listeners ----------
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-initiated", handleCallInitiated); // server should emit this to caller
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);
    socket.on("call-timeout", handleCallTimeout);

    return () => {
      // cleanup
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-initiated", handleCallInitiated);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
      socket.off("call-timeout", handleCallTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, currentUser, callId, status]);

  // ---------- Actions ----------
  const accept = () => {
    if (!socket || !peer || !callId || !currentUser) return;
    try {
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } catch (e) {
      console.error("accept emit failed", e);
      setStatus("error");
    }
  };

  const reject = () => {
    if (!socket || !peer || !callId || !currentUser) return;
    try {
      socket.emit("reject-call", {
        to: peer._id /* caller */,
        from: currentUser._id,
        callId,
        reason: "rejected",
      });
      setStatus("rejected");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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
      socket.emit("reject-call", {
        to: peer._id /* callee */,
        from: currentUser._id,
        callId,
        reason: "caller-cancel",
      });
    } catch (e) {}
    setStatus("rejected");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTimeout(() => setVisible(false), 400);
  };

  const endCall = () => {
    // close call window, notify server
    try {
      if (socket && callId) socket.emit("end-call", { roomId: callId });
    } catch (e) {}
    setVisible(false);
    setMode(null);
    setCallId(null);
    setPeer(null);
    setStatus("idle");
  };

  // ---------- Render ----------
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">
            {mode === "outgoing"
              ? status === "calling"
                ? "Đang gọi…"
                : status
              : mode === "incoming"
              ? status === "ringing"
                ? "Cuộc gọi đến"
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
                    {mode === "outgoing" ? "Đang chờ phản hồi..." : "Gọi đến"}
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
  );
}
