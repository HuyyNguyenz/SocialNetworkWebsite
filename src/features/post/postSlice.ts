import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { Post } from '~/types'

interface PostSlice {
  data: Post[]
  editingPost: Post | null
}

const initialState: PostSlice = {
  data: [],
  editingPost: null
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPostList: (state, action: PayloadAction<Post[]>) => {
      state.data = action.payload
    },
    deletePost: (state, action: PayloadAction<Post>) => {
      const id = action.payload.id
      const newPostList = current(state.data).filter((post) => post.id !== id)
      state.data = [...newPostList, action.payload]
    },
    startEditing: (state, action: PayloadAction<Post>) => {
      const post = action.payload
      state.editingPost = post
    },
    cancelEditing: (state) => {
      state.editingPost = null
    }
  }
})

export const { setPostList, deletePost, startEditing, cancelEditing } = postSlice.actions
const postReducer = postSlice.reducer
export default postReducer
