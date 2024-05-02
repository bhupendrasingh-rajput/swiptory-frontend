import { createSlice } from "@reduxjs/toolkit";
import { toggleBookmark } from "../../Apis/bookmarkApi";

const bookmark = {}
const bookmarkSlice = createSlice({
    name: 'bookmarks',
    initialState: bookmark,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(toggleBookmark.fulfilled, (state, action) => {
            if (action.payload) {
                state = action.payload;
            }
        });
    }
});

export default bookmarkSlice.reducer;