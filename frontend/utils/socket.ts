import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function getSocket() {
  if (!socket) {
    socket = io(
      "wss://confserver1.herokuapp.com",
      {
        forceNew: true,
        reconnectionAttempts: 1000,
        timeout: 1000,
        transports: ["websocket"],
      }
    );
  }
  return socket;
}