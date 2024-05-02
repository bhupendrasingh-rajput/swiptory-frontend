import { createSlice } from "@reduxjs/toolkit";
import { register, login } from "../../Apis/userApi";

const initialState = {
    isAuthenticated: false,
    username: null,
    userId: null,
    token: null
};

const updateLocalStorage = (state) => {
    if (state.token) {
        localStorage.setItem("token", state.token);
        localStorage.setItem("isAuthenticated", state.isAuthenticated)
    }

    if (state.username) {
        localStorage.setItem("username", state.username);
    }

    if (state.userId) {
        localStorage.setItem('userId', state.userId);
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.isAuthenticated = false;
            state.username = null;
            state.userId = null;
            state.token = null;
            localStorage.clear();
        }
    },
    extraReducers: (builder) => {
        builder.addCase(register.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                state.username = action.payload.user.username;
                state.userId = action.payload.user._id;
                state.token = action.payload.token;
                updateLocalStorage(state);
            }
        })
        builder.addCase(login.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                state.username = action.payload.user.username;
                state.userId = action.payload.user._id;
                state.token = action.payload.token;
                updateLocalStorage(state);
            }
        })
    },

});

export const { logout } = userSlice.actions;

export default userSlice.reducer;