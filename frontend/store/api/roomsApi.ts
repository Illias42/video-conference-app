import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Room {
  id: string;
  name: string;
}

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  tagTypes: ["Rooms"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://confserver1.herokuapp.com/rooms",
  }),
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], void>({
      query: () => "/",
      providesTags: [{ type: "Rooms", id: "LIST" }],
    }),

    searchRooms: builder.query<Room[], string>({
      query: term => `/search?term=${term}`,
    }),

    createRoom: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Rooms", id: "LIST" }],
    }),
  }),
});

export const { useGetRoomsQuery, useSearchRoomsQuery, useCreateRoomMutation } = roomsApi;
