import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, logoutThunk } from "./authThunks";

const initialState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })

      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(logoutThunk.rejected, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
