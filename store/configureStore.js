// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {persistReducer, persistStore} from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/auth";
import postsReducer from "../reducers/posts";
import usersReducer from "../reducers/users";


export default configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    users: usersReducer,
  },
});