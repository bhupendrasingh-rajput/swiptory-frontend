import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAsyncThunk } from '@reduxjs/toolkit';
const backendUrl = process.env.REACT_APP_BACKEND_URL;


export const getUserBookmarks = async (userId) => {
    try {
        const requestUrl = `${backendUrl}/bookmark/${userId}`;
        const response = await axios.get(requestUrl);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

export const toggleBookmark = createAsyncThunk('toggleBookmark  ', async (story, { rejectWithValue }) => {
    try {
        const requestUrl = `${backendUrl}/bookmark/toggle`;
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': token };
        const response = await axios.put(requestUrl, { story }, { headers });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})