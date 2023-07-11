import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { Message } from '~/types'

interface MessageSlice {
  data: Message[]
  editingMessage: Message | null
}

const initialState: MessageSlice = {
  data: [],
  editingMessage: null
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessageList: (state, action: PayloadAction<Message[]>) => {
      state.data = action.payload
    },
    deleteMessage: (state, action: PayloadAction<Message>) => {
      const id = action.payload.id
      const newMessageList = current(state.data).filter((message) => message.id !== id)
      state.data = [...newMessageList, action.payload]
    },
    startEditingMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload
      state.editingMessage = message
    },
    cancelEditingMessage: (state) => {
      state.editingMessage = null
    }
  }
})

export const { setMessageList, deleteMessage, startEditingMessage, cancelEditingMessage } = messageSlice.actions
const messageReducer = messageSlice.reducer
export default messageReducer
