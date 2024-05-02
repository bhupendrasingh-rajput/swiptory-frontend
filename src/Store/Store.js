import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Features/User";
import storyReducer from "./Features/Story";
import bookmarkReducer from "./Features/Bookmark";

const Store = configureStore({
    reducer: {
        user: userReducer,
        story: storyReducer,
        bookmark: bookmarkReducer
    }
})

export default Store;