import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse, User } from '../../types';

type UserState = {
  loggedInUser: User | null;
}
const initialState: UserState = {
  loggedInUser: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authenticate: (state, action: PayloadAction<AuthResponse>) => {
      state.loggedInUser = action.payload.user;
    },
    logout: () => initialState
  }
})

export default userSlice.reducer
export const { authenticate, logout } = userSlice.actions
