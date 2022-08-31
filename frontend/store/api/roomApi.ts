import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getSocket from "../../utils/socket";

interface ChatMessage {
  userId: string;
  roomId: string;
  type: string;
  message: string;
}

interface Message {
  type: "message" | "notification";
  userId?: string;
  userName?: string;
  avatar?: string;
  message: string;
  createdAt: string;
}

interface Payload {
  roomId: string;
  userId: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  tagTypes: ["Participants"],
  endpoints: (builder) => ({
    joinRoom: builder.mutation<void, Payload>({
      queryFn: (payload: Payload) => {
        const socket = getSocket();
        return new Promise(() => {
          socket.emit("joinRoom", payload);
        });
      },
      invalidatesTags: ["Participants"],
    }),

    leaveRoom: builder.mutation<void, Payload>({
      queryFn: ({ roomId, userId }: Payload) => {
        const socket = getSocket();
        return new Promise(() => {
          socket.emit("leaveRoom", { roomId, userId });
        });
      },
      invalidatesTags: ["Participants"],
    }),

    sendMessage: builder.mutation<void, ChatMessage>({
      queryFn: (message: ChatMessage) => {
        const socket = getSocket();
        return new Promise(() => {
          socket.emit("sendMessage", message);
        });
      },
    }),

    getMessages: builder.query<Message[], string>({
      query: (roomId) =>
        `/api/room/messages?room=${roomId}`,
      async onCacheEntryAdded(
        roomId,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        const socket = getSocket();
        try {
          await cacheDataLoaded;

          socket.on("receiveMessage", (message: Message) => {
            updateCachedData((draft) => {
              draft.push(message);
            });
          });
        } catch {}
        await cacheEntryRemoved;
        socket.off("receiveMessage");
      },
    }),

    getParticipants: builder.query<Participant[], string>({
      queryFn: () => ({ data: [] }),
      providesTags: ["Participants"],
      async onCacheEntryAdded(
        roomId,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        const socket = getSocket();
        try {
          await cacheDataLoaded;

          socket.on("participants", (participants: Participant[]) => {
            updateCachedData(() => participants);
          });
        } catch {}
        await cacheEntryRemoved;
        socket.off("participants");
      },
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetParticipantsQuery,
  useJoinRoomMutation,
  useLeaveRoomMutation,
} = roomApi;
