import { createSlice } from "@reduxjs/toolkit";
import { fetchAllStories, likeStory, editStory, addStory } from "../../Apis/storyApi";

const stories = {
    'Food': [],
    'Health and Fitness': [],
    'Travel': [],
    'Movie': [],
    'Education': []
}
const storySlice = createSlice({
    name: 'story',
    initialState: stories,
    reducer: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllStories.fulfilled, (state, action) => {
            if (action.payload) {
                const { stories } = action.payload;
                Object.keys(state).forEach(category => {
                    state[category] = [];
                });
                stories.forEach(story => {
                    state[story.category].push(story);
                });
            }
        });

        builder.addCase(likeStory.fulfilled, (state, action) => {
            if (action.payload) {
                const { category, _id } = action.payload

                const storyIndex = state[category].findIndex(story => story._id === _id);

                if (storyIndex !== -1) {
                    state[category][storyIndex] = action.payload;
                }

                console.log(state);
            }
        });

        builder.addCase(addStory.fulfilled, (state, action) => {
            if (action.payload) {
                const newStory = action.payload;
                state[newStory.category].push(newStory);
            }
        });

        builder.addCase(editStory.fulfilled, (state, action) => {
            const updatedStory = action.payload;
            if (updatedStory && updatedStory.category) {
                const { category, _id: storyId } = updatedStory;

                const categoryIndex = state.findIndex(cat => cat.category === category);
                if (categoryIndex !== -1) {
                    const storyIndex = state[categoryIndex].findIndex(story => story._id === storyId);
                    if (storyIndex !== -1) {
                        state[categoryIndex][storyIndex] = updatedStory;
                    }
                }
            }
        });


    }
})

export default storySlice.reducer;