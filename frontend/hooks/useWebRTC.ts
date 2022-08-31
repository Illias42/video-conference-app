import { useCallback, useEffect, useRef } from "react";
import useStateWithCallback from "./useStateWithCallback";
import getSocket from "../utils/socket";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import freeice from "freeice";
import {
  useJoinRoomMutation,
  useLeaveRoomMutation,
} from "../store/api/roomApi";

interface UseWebRTCOptions {
  roomID: string;
  userId: string;
}

interface NewPeerOptions {
  client: Client;
  createOffer: boolean;
}

interface PeerConnections {
  [key: string]: RTCPeerConnection;
}

interface RemovePeerOptions {
  peerID: string;
}

interface Client {
  peerID: string;
  name: string;
  avatar: string | null;
}

const useWebRTC = ({ roomID, userId }: UseWebRTCOptions) => {
  const socket = getSocket();
  const peerConnections = useRef<PeerConnections>({});
  const localMediaStream = useRef<MediaStream | null>(null);
  const peerMediaElements = useRef<any>({
    ["LOCAL_VIDEO"]: null,
  });

  const [clients, updateClients] = useStateWithCallback([]);
  const [joinRoom] = useJoinRoomMutation();
  const [leaveRoom] = useLeaveRoomMutation();

  const addNewClient = useCallback(
    (newClient: Client, cb: () => void) => {
      updateClients((list: Client[]) => {
        if (!list.includes(newClient)) {
          return [...list, newClient];
        }

        return list;
      }, cb);
    },
    [clients, updateClients]
  );

  useEffect(() => {
    async function handleNewPeer({ client, createOffer }: NewPeerOptions) {
      console.log("handleNewPeer", client, createOffer);
      const { peerID, name, avatar } = client;
      if (peerID in peerConnections.current) {
        return console.warn(`Already connected to peer ${peerID}`);
      }

      peerConnections.current[peerID] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      peerConnections.current[peerID].onicecandidate = (
        event: RTCPeerConnectionIceEvent
      ) => {
        if (event.candidate) {
          socket.emit("relayICE", {
            peerID,
            iceCandidate: event.candidate,
          });
        }
      };

      let tracksNumber = 0;
      peerConnections.current[peerID].ontrack = ({
        streams: [remoteStream],
      }: any) => {
        tracksNumber++;

        if (tracksNumber === 2) {
          tracksNumber = 0;
          addNewClient(client, () => {
            if (peerMediaElements.current[peerID]) {
              peerMediaElements.current[peerID].srcObject = remoteStream;
            } else {
              let settled = false;
              const interval = setInterval(() => {
                if (peerMediaElements.current[peerID]) {
                  peerMediaElements.current[peerID].srcObject = remoteStream;
                  settled = true;
                }

                if (settled) {
                  clearInterval(interval);
                }
              }, 1000);
            }
          });
        }
      };

      localMediaStream.current
        ?.getTracks()
        .forEach((track: MediaStreamTrack) => {
          peerConnections.current[peerID].addTrack(
            track,
            localMediaStream.current as MediaStream
          );
        });

      if (createOffer) {
        const offer = await peerConnections.current[peerID].createOffer();

        await peerConnections.current[peerID].setLocalDescription(offer);

        socket.emit("relaySDP", {
          peerID,
          sessionDescription: offer,
        });
      }
    }

    socket.on("addPeer", handleNewPeer);

    return () => {
      socket.off("addPeer");
    };
  }, []);

  useEffect(() => {
    async function setRemoteMedia({
      peerID,
      sessionDescription: remoteDescription,
    }: any) {
      await peerConnections.current[peerID]?.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );

      if (remoteDescription.type === "offer") {
        const answer = await peerConnections.current[peerID].createAnswer();

        await peerConnections.current[peerID].setLocalDescription(answer);

        socket.emit("relaySDP", {
          peerID,
          sessionDescription: answer,
        });
      }
    }

    socket.on("sdp", setRemoteMedia);

    return () => {
      socket.off("sdp");
    };
  }, []);

  useEffect(() => {
    socket.on("ice", ({ peerID, iceCandidate }) => {
      peerConnections.current[peerID]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate)
      );
    });

    return () => {
      socket.off("ice");
    };
  }, []);

  useEffect(() => {
    const handleRemovePeer = ({ peerID }: RemovePeerOptions) => {
      if (peerConnections.current[peerID]) {
        peerConnections.current[peerID].close();
      }

      delete peerConnections.current[peerID];
      delete peerMediaElements.current[peerID];

      updateClients((list: string[]) =>
        list.filter((c: string) => c !== peerID)
      );
    };

    socket.on("removePeer", handleRemovePeer);

    return () => {
      socket.off("removePeer");
    };
  }, []);

  useEffect(() => {
    async function startCapture() {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      addNewClient({peerID: "LOCAL_VIDEO", name: "LOCAL", avatar: null}, () => {
        const localVideoElement = peerMediaElements.current["LOCAL_VIDEO"];

        if (localVideoElement) {
          localVideoElement.volume = 1;
          localVideoElement.srcObject = localMediaStream.current;
        }
      });
    }

    startCapture()
      // .then(() => joinRoom({ roomId: roomID, userId: userId }))
      .catch((e) => console.error("Error getting userMedia:", e));

    return () => {
      localMediaStream.current
        ?.getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());

      // leaveRoom({ roomId: roomID, userId: userId });
    };
  }, [roomID]);

  const provideMediaRef = useCallback((id: string, node: any) => {
    peerMediaElements.current[id] = node;
  }, []);

  const muteAudio = useCallback((payload: boolean) => {
    localMediaStream.current?.getTracks().forEach((track: MediaStreamTrack) => {
      if (track.kind === "audio") {
        track.enabled = !payload;
      }
    });
    peerMediaElements.current["LOCAL_VIDEO"].srcObject =
      localMediaStream.current;
  }, []);

  const muteVideo = useCallback((payload: boolean) => {
    localMediaStream.current?.getTracks().forEach((track: MediaStreamTrack) => {
      if (track.kind === "video") {
        track.enabled = !payload;
      }
    });
    peerMediaElements.current["LOCAL_VIDEO"].srcObject =
      localMediaStream.current;
  }, []);

  const screenShare = useCallback(async (payload: boolean) => {
    if (localMediaStream.current) {
      if (payload) {
        localMediaStream.current
          .getTracks()
          .forEach((track: MediaStreamTrack) => {
            track.stop();
          });
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
      } else {
        localMediaStream.current.getVideoTracks()[0].stop();
        localMediaStream.current =
          await navigator.mediaDevices.getDisplayMedia();
      }

      peerMediaElements.current["LOCAL_VIDEO"].srcObject =
        localMediaStream.current;
      for (const peerID in peerConnections.current) {
        peerConnections.current[peerID]
          .getSenders()
          .forEach((sender: RTCRtpSender) => {
            sender.replaceTrack(localMediaStream.current!.getVideoTracks()[0]);
          });
      }
    }
  }, []);

  return {
    clients,
    provideMediaRef,
    muteVideo,
    muteAudio,
    screenShare,
  };
};

export default useWebRTC;
