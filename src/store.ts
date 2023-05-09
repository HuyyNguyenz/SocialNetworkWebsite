import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './features/posts/postsSlice'
import userDataReducer from './features/userData/userDataSlice'

export const store = configureStore({
  reducer: { userData: userDataReducer, posts: postsReducer }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
