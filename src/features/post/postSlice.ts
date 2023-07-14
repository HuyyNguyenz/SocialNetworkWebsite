import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { Post } from '~/types'

interface PostSlice {
  data: Post[]
  editingPost: Post | null
  newPost: Post | null
}

const initialState: PostSlice = {
  data: [],
  editingPost: null,
  newPost: null
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPostList: (state, action: PayloadAction<Post[]>) => {
      state.data = action.payload
    },
    setNewPost: (state, action: PayloadAction<Post | null>) => {
      state.newPost = action.payload
    },
    deletePost: (state, action: PayloadAction<Post>) => {
      const id = action.payload.id
      const foundIndex = current(state.data).findIndex((post) => post.id === id)
      const newPostList = [...current(state.data)]
      foundIndex !== -1 && newPostList.splice(foundIndex, 1, action.payload)
      state.data = [...newPostList]
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

export const { setPostList, deletePost, startEditing, cancelEditing, setNewPost } = postSlice.actions
const postReducer = postSlice.reducer
export default postReducer
