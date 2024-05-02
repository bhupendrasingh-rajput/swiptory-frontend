import React, { useState, useEffect } from 'react';
import style from "./Bookmarks.module.css";
import { FaRegEdit } from "react-icons/fa";
import { getUserBookmarks } from '../../Apis/bookmarkApi';
import { useNavigate } from 'react-router-dom';

const Bookmarks = () => {
    const userId = localStorage.getItem('userId');
    const [bookmarkedStories, setBookmarkedStories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const bookmarksData = await getUserBookmarks(userId);
                setBookmarkedStories(bookmarksData?.stories || []);
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
            }
        };

        fetchBookmarks();
    }, []);

    const renderBookmark = (story) => {
        const firstSlide = story.slides[0]?.content;

        if (firstSlide) {
            return (
                <div key={story._id} className={style.postContainer} onClick={() => {
                    navigate('/', {
                        state: { storyId: story?._id, modalOpen: true }
                    })
                }}>
                    <div>
                        <span>{firstSlide.heading}</span>
                        <p>{firstSlide.description}</p>
                    </div>
                    <img src={firstSlide.image} alt='storyPoster' />
                </div>
            );
        }
        return null;
    };


    return (
        <div className={style.mainContainer}>
            <h2>Your Bookmarks</h2>
            <div className={style.storyRow}>
                {bookmarkedStories.map((story) => renderBookmark(story))}
            </div>
        </div>
    );
};

export default Bookmarks;
