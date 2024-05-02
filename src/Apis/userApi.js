import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAsyncThunk } from '@reduxjs/toolkit';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const register = createAsyncThunk('register', async ({ username, password }, { rejectWithValue }) => {
    try {
        const requestUrl = `${backendUrl}/user/register`;
        const requestPayload = { username, password };
        const response = await axios.post(requestUrl, requestPayload);
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const login = createAsyncThunk('login', async ({ username, password }, { rejectWithValue }) => {
    try {
        const requestUrl = `${backendUrl}/user/login`;
        const requestPayload = { username, password };
        const response = await axios.post(requestUrl, requestPayload);
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
});