import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '~/types'

const initialState: User = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  birthDay: '',
  gender: '',
  dateCreated: ''
}

const userDataSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      return (state = { ...state, ...action.payload })
    },
    removeUserData: (state) => {
      return (state = initialState)
    }
  }
})

export const { setUserData, removeUserData } = userDataSlice.actions
const userDataReducer = userDataSlice.reducer
export default userDataReducer
