import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Posts } from '~/types'

const initialState: Posts[] = []

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostsList: (state, action: PayloadAction<Posts[]>) => {
      return (state = action.payload)
    }
  }
})

export const { setPostsList } = postsSlice.actions
const postsReducer = postsSlice.reducer
export default postsReducer
