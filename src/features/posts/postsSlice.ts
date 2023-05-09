import { createSlice } from '@reduxjs/toolkit'
import { Post } from '~/types'

const initialState: Post[] = []

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}
})

const postsReducer = postsSlice.reducer

export default postsReducer
