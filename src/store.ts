import { configureStore } from '@reduxjs/toolkit'
import postReducer from './features/post/postSlice'
import userDataReducer from './features/userData/userDataSlice'
import commentReducer from './features/comment/commentSlice'
import messageReducer from './features/message/messageSlice'

export const store = configureStore({
  reducer: {
    userData: userDataReducer,
    postList: postReducer,
    commentList: commentReducer,
    messageList: messageReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {post: PostState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
