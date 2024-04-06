import { createSlice } from '@reduxjs/toolkit';

import { logIn, logOut, signUp } from '../actions/authActions';

export const initialState = {
  logInLoading: "idle", // 로그인 시도중
  logInError: null,
  logOutLoading: "idle", // 로그아웃 시도중
  logOutError: null,
  signUpLoading: "idle", // 회원가입 시도중
  signUpError: null,
  me: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      // 로그인 액션의 상태 처리
      .addCase(logIn.pending, (state) => {
        state.logInLoading = "pending";
        state.logInError = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.logInLoading = "succeeded";
        state.logInError = null;
        state.me = action.payload;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.logInLoading = "failed";
        state.logInError = action.error.message;
      })
      // 로그아웃 액션의 상태 처리
      .addCase(logOut.pending, (state) => {
        state.logOutLoading = "pending";
        state.logOutError = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.logOutLoading = "succeeded"
        state.logInError = null;
        state.me = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.logOutLoading = "failed";
        state.logOutError = action.error.message;
      })
      // 회원가입 액션의 상태 처리
      .addCase(signUp.pending, (state) => {
        state.signUpLoading = "pending";
        state.signUpError = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUpLoading = "succeeded";
        state.signUpError = null;
        state.me = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUpLoading = "failed";
        state.signUpError = action.error.message;
      })
  }
});

export default authSlice.reducer;