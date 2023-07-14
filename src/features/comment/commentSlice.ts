import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { Comment } from '~/types'

interface CommentSlice {
  data: Comment[]
  editingComment: Comment | null
}

const initialState: CommentSlice = {
  data: [],
  editingComment: null
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setCommentList: (state, action: PayloadAction<Comment[]>) => {
      state.data = action.payload
    },
    deleteComment: (state, action: PayloadAction<Comment>) => {
      const id = action.payload.id
      const foundIndex = current(state.data).findIndex((comment) => comment.id === id)
      const newCommentList = [...current(state.data)]
      foundIndex !== -1 && newCommentList.splice(foundIndex, 1, action.payload)
      state.data = [...newCommentList]
    },
    startEditingComment: (state, action: PayloadAction<Comment>) => {
      const comment = action.payload
      state.editingComment = comment
    },
    cancelEditingComment: (state) => {
      state.editingComment = null
    }
  }
})

export const { setCommentList, deleteComment, startEditingComment, cancelEditingComment } = commentSlice.actions
const commentReducer = commentSlice.reducer
export default commentReducer
