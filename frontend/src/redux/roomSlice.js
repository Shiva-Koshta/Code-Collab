import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'room',
  initialState: {
    room: {
      name: ''

    }
  },
  reducers: {

  }
})

export const { setUserSlice, logout } = userSlice.actions
export default userSlice.reducer
