import { createSlice } from '@reduxjs/toolkit';

import { createPost, getPosts, removePost, updatePost } from '../actions/postsActions';

export const initialState = {
  createPostLoading: "idle", // 게시글 생성중
  createPostError: null,
  getPostsLoading: "idle", // 게시글 로드중
  getPostsError: null,
  removePostLoading: "idle", // 게시글 삭제중
  removePostError: null,
  updatePostLoading: "idle", // 게시글 수정중
  updatePostError: null,
  posts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  extraReducers: (builder) => {
    builder
      // 게시글 생성 액션의 상태 처리
      .addCase(createPost.pending, (state) => {
        state.createPostLoading = "pending";
        state.createPostError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createPostLoading = "succeeded";
        state.createPostError = null;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createPostLoading = "failed";
        state.createPostError = action.error.message;
      })
      // 게시글 로드 액션의 상태 처리
      .addCase(getPosts.pending, (state) => {
        state.getPostsLoading = "pending";
        state.getPostsError = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.getPostsLoading = "succeeded"
        state.getPostsError = null;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.getPostsLoading = "failed";
        state.getPostsError = action.error.message;
      })
      // 게시글 삭제 액션의 상태 처리
      .addCase(removePost.pending, (state) => {
        state.removePostLoading = "pending";
        state.removePostError = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.removePostLoading = "succeeded";
        state.removePostError = null;
        state.posts = state.posts.filter(
          (post) => action.payload.id !== post.id
        );
      })
      .addCase(removePost.rejected, (state, action) => {
        state.removePostLoading = "failed";
        state.removePostError = action.error.message;
      })
      // 게시글 수정 액션의 상태 처리
      .addCase(updatePost.pending, (state) => {
        state.updatePostLoading = "pending";
        state.updatePostError = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updatePostLoading = "succeeded";
        state.updatePostError = null;
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.updatePostLoading = "failed";
        state.updatePostError = action.error.message;
      })
  }
});

export default postsSlice.reducer;