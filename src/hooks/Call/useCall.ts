import { useEffect, useRef, useState } from "react";
import socket from "../../Utils/socket";
import api from "../../API/API";
import { GET_USER, WEBRTC } from "./constants";
import { getToken } from "../../Utils/getToken";

export function useCall(myId: string) {
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [inCall, setInCall] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // ------------------ START CALL ------------------
  const startCall = async (targetId: string) => {
    setInCall(true);

    // Get camera/mic
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const res = await api.get(WEBRTC);
    const iceServers = res.data.iceServers;
    // Create peer
    const pc = createPeer(targetId, iceServers);
    peerRef.current = pc;

    // Add media tracks
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    // Create an offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send offer to target
    socket.emit("call-offer", { offer, targetId, from: myId });
  };

  // ------------------ CREATE PEER ------------------
//   const createPeer = (targetId: string) => {
//     // const pc = new RTCPeerConnection({
//     //   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     // });
//     const res = await api.get("/webRtc");

//     const pc = new RTCPeerConnection({
//       iceServers: res.data.iceServers,
//     });
//     pc.onicecandidate = (e) => {
//       if (e.candidate) {
//         socket.emit("ice-candidate", {
//           targetId,
//           from: myId,
//           candidate: e.candidate,
//         });
//       }
//     };

//     pc.ontrack = (e) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = e.streams[0];
//       }
//     };

//     return pc;
//   };
const createPeer = (targetId: string, iceServers: any[]) => {
  const pc = new RTCPeerConnection({ iceServers });

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("ice-candidate", {
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
//   const acceptCall = async () => {
//     const { from, offer } = incomingCall;
//     setInCall(true);

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localStreamRef.current = stream;
//     if (localVideoRef.current) localVideoRef.current.srcObject = stream;

//     const pc = createPeer(from);
//     peerRef.current = pc;

//     stream.getTracks().forEach((track) => pc.addTrack(track, stream));

//     await pc.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);

//     socket.emit("call-answer", { answer, targetId: from, from: myId });
//     setIncomingCall(null);
//   };
const acceptCall = async () => {
  const { from, offer } = incomingCall;
  setInCall(true);

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  localStreamRef.current = stream;
  if (localVideoRef.current) localVideoRef.current.srcObject = stream;

  // 🔥 Lấy ICE server giống bên gọi
  const res = await api.get(WEBRTC);
  const iceServers = res.data.iceServers;

  const pc = createPeer(from, iceServers);
  peerRef.current = pc;

  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  socket.emit("call-answer", { answer, targetId: from, from: myId });

  setIncomingCall(null);
};


  // ------------------ DECLINE CALL ------------------
  const declineCall = () => {
    socket.emit("call-reject", { targetId: incomingCall.from });
    setIncomingCall(null);
  };

  // ------------------ END CALL ------------------
  const endCall = () => {
    peerRef.current?.close();
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());

    setInCall(false);
    setIncomingCall(null);

    socket.emit("call-end", { targetId: incomingCall?.from || "" });
  };

  // ------------------ SOCKET HANDLERS ------------------
  useEffect(() => {
    socket.on("call-offer", async ({ from, offer }) => {
      const token = getToken();
      const userRes = await api.get(GET_USER, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = userRes.data.data;
      setIncomingCall({
        from,
        offer,
        username: user.username,
        avatar: user.avatar,
      });
    });

    socket.on("call-answer", async ({ answer }) => {
      await peerRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.log("Error adding ICE", e);
      }
    });

    socket.on("call-end", () => {
      endCall();
    });

    return () => {
      socket.off("call-offer");
      socket.off("call-answer");
      socket.off("ice-candidate");
      socket.off("call-end");
    };
  }, []);

  return {
    incomingCall,
    inCall,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    localVideoRef,
    remoteVideoRef,
  };
}
