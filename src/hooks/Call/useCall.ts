import { useEffect, useRef, useState } from "react";
import socket from "../../Utils/socket";
import api from "../../API/API";
import { GET_USER, WEBRTC } from "./constants";
import { getToken } from "../../Utils/getToken";

export function useCall(myId: string) {
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [inCall, setInCall] = useState(false);

  const [isMicOff, setIsMicOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [callTarget, setCallTarget] = useState<string | null>(null);
  const [callTime, setCallTime] = useState(0);
  const callTimerRef = useRef<any>(null);
  const [callStartAt, setCallStartAt] = useState<number | null>(null);
  // ------------------ START CALL ------------------
  const startCall = async (targetId: string) => {
    setInCall(true);
    setCallStartAt(null);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const token = getToken();
    const res = await api.get(WEBRTC, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const iceServers = res?.data?.iceServers;
    const pc = createPeer(targetId, iceServers);
    peerRef.current = pc;

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    setCallTarget(targetId);
    socket?.emit("call-offer", { offer, targetId, from: myId });
  };

  const createPeer = (targetId: string, iceServers: any[]) => {
    const pc = new RTCPeerConnection({ iceServers });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket?.emit("ice-candidate", {
          targetId,
          from: myId,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    return pc;
  };

  // ------------------ ACCEPT CALL ------------------
  const acceptCall = async () => {
    const { from, offer } = incomingCall;
    setInCall(true);
    setCallTarget(incomingCall.from);
    setCallTime(0);
    callTimerRef.current = setInterval(() => {
      setCallTime((prev) => prev + 1);
    }, 1000);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const token = getToken();
    const res = await api.get(WEBRTC, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const iceServers = res?.data?.iceServers;

    const pc = createPeer(from, iceServers);
    peerRef.current = pc;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    const startAt = Date.now();
    socket?.emit("call-answer", {
      answer,
      targetId: from,
      from: myId,
      // startAt,
    });
    socket.emit("call-start", { targetId: from, startAt });
    socket.emit("call-start", { targetId: myId, startAt }); 
    // ⭐ NGƯỜI NHẬN CŨNG BẮT ĐẦU TIMER
    setCallStartAt(startAt);
    setIncomingCall(null);
  };

  // ------------------ DECLINE CALL ------------------
  const declineCall = () => {
    socket?.emit("call-reject", { targetId: incomingCall.from });
    setIncomingCall(null);
  };

  // ------------------ END CALL ------------------

  const endCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = null;

    setCallTime(0);
    setCallStartAt(null);
    // 1) Đóng WebRTC peer
    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.oniceconnectionstatechange = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    // 2) Tắt toàn bộ stream local
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
    }

    // 3) Xóa remote video stream để UI biến mất
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    // 4) Reset state
    setInCall(false);
    setIncomingCall(null);
    if (callTarget) {
      socket?.emit("call-end", { targetId: callTarget, from: myId });
    }
    setCallTarget(null);
  };

  // ------------------ TOGGLE MIC ------------------
  const toggleMic = () => {
    const audioTrack = localStreamRef.current
      ?.getAudioTracks()
      ?.find((t) => t.kind === "audio");

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOff(!audioTrack.enabled);
    }
  };

  // ------------------ TOGGLE VIDEO ------------------
  const toggleVideo = () => {
    const videoTrack = localStreamRef.current
      ?.getVideoTracks()
      ?.find((t) => t.kind === "video");

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  // ------------------ SOCKET HANDLERS ------------------

  useEffect(() => {
    if (!callStartAt) return;

    // ⭐ chạy timer dựa trên chênh lệch thời gian
    callTimerRef.current = setInterval(() => {
      setCallTime(Math.floor((Date.now() - callStartAt) / 1000));
    }, 1000);

    return () => clearInterval(callTimerRef.current);
  }, [callStartAt]);

  useEffect(() => {
    socket?.on("call-offer", async ({ from, offer }) => {
      const userRes = await api.get(`${GET_USER}${from}`);
      const user = userRes?.data?.data;

      setIncomingCall({
        from,
        offer,
        username: user?.username,
        avatar: user?.avatar,
      });
    });

    socket?.on("call-answer", async ({ answer }) => {
      await peerRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });
    socket.on("call-start", ({ startAt }) => {
      setCallStartAt(startAt); // <-- ADD
    });
    socket?.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.log("Error adding ICE", e);
      }
    });

    socket?.on("call-end", () => {
      endCall();
    });

    return () => {
      socket?.off("call-offer");
      socket?.off("call-answer");
      socket.off("call-start");
      socket?.off("ice-candidate");
      socket?.off("call-end");
    };
  }, []);

  return {
    incomingCall,
    inCall,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    toggleMic,
    toggleVideo,
    callTime,
    isMicOff,
    isVideoOff,
    localVideoRef,
    remoteVideoRef,
  };
}
