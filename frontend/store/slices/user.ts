import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  tag: string;
  email: string;
  avatar: string | null;
}

const initialState = {
  id: "",
  name: "",
  tag: "",
  email: "",
  avatar: null
} as User;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: User, action: PayloadAction<User>) => {
      state.id = action.payload.id ?? '';
      state.name = action.payload.name ?? '';
      state.tag =  action.payload.tag ?? '';
      state.email = action.payload.email ?? '';
      state.avatar = action.payload.avatar ?? null;
    }
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;