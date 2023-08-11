import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '~/types'

const user: User = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  birthDay: '',
  gender: '',
  createdAt: ''
}

const initialState = {
  data: user
}

const userDataSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.data = action.payload
    },
    removeUserData: (state) => {
      state.data = user
    }
  }
})

export const { setUserData, removeUserData } = userDataSlice.actions
const userDataReducer = userDataSlice.reducer
export default userDataReducer
