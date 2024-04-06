import { createSlice } from '@reduxjs/toolkit';

import { createUser, getUser } from '../actions/usersActions';

export const initialState = {
  createUserLoading: "idle", // 유저 생성중
  createUserError: null,
  getUserLoading: "idle", // 유저 로딩중
  getUserError: null,
  user: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  extraReducers: (builder) => {
    builder
      // 유저 생성 액션의 상태 처리
      .addCase(createUser.pending, (state) => {
        state.createUserLoading = "pending";
        state.createUserError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createUserLoading = "succeeded";
        state.createUserError = null;
        state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createUserLoading = "failed";
        state.createUserError = action.error.message;
      })
      // 유저 로딩 액션의 상태 처리
      .addCase(getUser.pending, (state) => {
        state.getUserLoading = "pending";
        state.getUserError = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.getUserLoading = "succeeded"
        state.logInError = null;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.getUserLoading = "failed";
        state.getUserError = action.error.message;
      })
  }
});

export default usersSlice.reducer;