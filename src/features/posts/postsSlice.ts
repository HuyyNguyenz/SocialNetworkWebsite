import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { Posts } from '~/types'

const initialState: Posts[] = []

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostsList: (state, action: PayloadAction<Posts[]>) => {
      return (state = action.payload)
    },
    deletePosts: (state, action: PayloadAction<number>) => {
      const newPostsList = current(state).filter((post) => post.id !== action.payload)
      return (state = newPostsList)
    }
  }
})

export const { setPostsList, deletePosts } = postsSlice.actions
const postsReducer = postsSlice.reducer
export default postsReducer
