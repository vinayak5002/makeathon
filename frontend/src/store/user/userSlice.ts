import { createSlice } from "@reduxjs/toolkit"

export type UserState = {
  userID: string
}

let userID = localStorage.getItem('userID') ?? "";
if (localStorage.getItem('userId') === undefined) {
  userID = "";
}

const initialState: UserState = {
  userID: userID,
}

console.log("Initial state: ", userID)

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserID: (state, action) => {
      console.log("Setting userID: ", action)
      localStorage.setItem('userID', action.payload)
      state.userID = action.payload
    }
  }
});

export const { setUserID } = UserSlice.actions;

export default UserSlice.reducer;