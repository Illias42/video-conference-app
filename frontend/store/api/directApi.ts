import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getSocket from "../../utils/socket";

interface DirectRoom {
  id: string;
  userId: string;
  lastMessage: {
    text: string;
    createdAt: string;
  },
  user: {
    name: string;
    avatar: string;
  };
}

export interface Message {
  id: string;
  message: string;
  type: "text" | "image";
  image: string | null;
  userId: string;
  createdAt: string;
}

interface SendMessagePayload {
  senderId: string;
  sendeeId: string;
  type: "text" | "image";
  image?: string;
  message?: string;
}

interface UserSearchResult {
  global: any[];
  local: any[];
}

export const directApi = createApi({
  reducerPath: "directApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/direct" }),
  tagTypes: ["DirectRooms", "DirectMessages"],
  endpoints: (builder) => ({
    sendDirectMessage: builder.mutation<null, SendMessagePayload>({
      queryFn: (payload: SendMessagePayload, {dispatch}) => {
        const socket = getSocket();
        return new Promise((resolve) => {
          socket.emit("sendDirectMessage", payload, () => {
            dispatch(directApi.util.invalidateTags(["DirectRooms"]));
            resolve({ data: null });
          });
        });
      },
    }),

    getDirectRooms: builder.query<DirectRoom[], void>({
      query: () => "/rooms",
      providesTags: ["DirectRooms"]
    }),

    searchUser: builder.query<UserSearchResult, string>({
      query: term => `/search?term=${term}`
    }),

    getDirectMessages: builder.query<Message[], {roomId: string, userId: string}>({
      query: ({roomId}) => `/messages?room=${roomId}`,
      providesTags: ["DirectMessages"],
      async onCacheEntryAdded(
        { roomId, userId },
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        const socket = getSocket();
        try {
          await cacheDataLoaded;

          socket.emit("joinDirect", { roomId, userId });

          socket.on("receiveDirectMessage", (message: Message) => {
            updateCachedData((draft) => {
              draft.push(message);
            });
          });
        } catch {}
        await cacheEntryRemoved;
        socket.off("receiveDirectMessage");
      },
    }),
  }),
});

export const {
  useGetDirectRoomsQuery,
  useGetDirectMessagesQuery,
  useSendDirectMessageMutation,
  useSearchUserQuery
} = directApi;

export default directApi;