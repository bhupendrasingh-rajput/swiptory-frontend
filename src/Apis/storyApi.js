import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAsyncThunk } from '@reduxjs/toolkit';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const fetchAllStories = createAsyncThunk('fetchAllStories', async (_, { rejectWithValue }) => {
    try {
        const requestUrl = `${backendUrl}/story/all`;
        const response = await axios.get(requestUrl);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const addStory = createAsyncThunk('addStory', async (storyData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const requestUrl = `${backendUrl}/story/add`;
        const headers = { 'Authorization': token };
        const response = await axios.post(requestUrl, storyData, { headers });
        toast.success(response.data.message);
        return response.data.story;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const getStoryById = async (storyId) => {
    try {
        const requestUrl = `${backendUrl}/story/${storyId}`;
        const response = await axios.get(requestUrl);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

export const likeStory = createAsyncThunk('likeStory', async ({ storyId, slideId }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const requestUrl = `${backendUrl}/story/like`;
        const requestPayload = { storyId, slideId };
        const headers = { 'Authorization': token };
        const response = await axios.put(requestUrl, requestPayload, { headers });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const editStory = createAsyncThunk('editStory', async (storyData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const requestUrl = `${backendUrl}/story/edit`;
        const headers = { 'Authorization': token };
        const response = await axios.put(requestUrl, storyData, { headers });
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
}) 