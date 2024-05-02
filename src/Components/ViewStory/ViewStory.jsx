import React, { useState, useEffect } from 'react';
import { FaBookmark, FaHeart } from 'react-icons/fa';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { RxCross2 } from "react-icons/rx";
import { PiTelegramLogo } from 'react-icons/pi';
import style from './ViewStory.module.css';
import { getStoryById, likeStory } from '../../Apis/storyApi';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserBookmarks, toggleBookmark } from '../../Apis/bookmarkApi';
import { toast } from 'react-toastify';

const ViewStory = ({ storyId, closeModal }) => {
    const userId = localStorage.getItem('userId');
    const [story, setStory] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalSlides, setTotalSlides] = useState(0);
    const [likes, setLikes] = useState([]);
    const [bookmarkedStories, setBookmarkedStories] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [mobileView, setMobileView] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setMobileView(window.innerWidth < 600);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    };

    const previousSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    };

    const renderProgressBar = () => {
        return story?.slides?.map((slide, index) => (
            <div
                key={index}
                className={`${style.progressBarItem} ${index === currentIndex ? style.active : ''}`}
                onClick={() => setCurrentIndex(index)}
            />
        ));
    };


    const handleLike = async () => {
        try {
            if (!likes.includes(userId)) {
                await dispatch(likeStory({ storyId, slideId: null }));
                setLikes([...likes, userId]);
            } else {
                await dispatch(likeStory({ storyId, slideId: null }));
                setLikes(likes.filter(id => id !== userId));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleBookmarkClick = async (story) => {
        if (userId) {
            try {
                await dispatch(toggleBookmark(story));
                setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
            } catch (error) {
                console.error('Error toggling bookmark:', error);
            }
        } else {
            navigate('/login');
        }
    };

    const handleShare = async (storyId) => {
        try {
            await navigator.clipboard.writeText(`http://localhost:3000/shared/${storyId}`);
            toast.success("Link copied to clipboard")
        } catch (error) {
            console.error('Error In Sharing Story', error);
        }
    }


    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await getStoryById(storyId);
                setStory(response);
                setTotalSlides(response?.slides?.length || 0);
                setLikes(response?.likes || []);

                const bookmarksData = await getUserBookmarks(userId);
                setBookmarkedStories(bookmarksData.stories);
                const isStoryBookmarked = bookmarksData.stories.some(story => story._id === storyId);
                setIsBookmarked(isStoryBookmarked);
            } catch (error) {
                console.error('Error fetching story:', error);
            }
        };

        fetchStory();

        const slideChangeInterval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % totalSlides);
        }, 2000);

        return () => clearInterval(slideChangeInterval);
    }, [dispatch, storyId, totalSlides]);



    return (
        <>
            {story?._id ? (
                <>
                    <div className={style.navBtn} onClick={previousSlide}><GrPrevious /></div>
                    <div className={`${style.slide} ${style.transition}`}>
                        {mobileView && <div className={style.navBtnBox} >
                            <div className={style.mobileNavBtn} onClick={previousSlide}></div>
                            <div className={style.mobileNavBtn} onClick={nextSlide}></div>
                        </div>}
                        <img src={story?.slides[currentIndex]?.content?.image} alt="storyImage" className={style.storyImage} />
                        <div className={style.upperRow}>
                            <div className={style.progressBar}>{renderProgressBar()}</div>
                            <div className={style.buttonRow}>
                                <span onClick={() => { closeModal() }}><RxCross2 /></span>
                                <span onClick={() => { handleShare(story?._id) }} ><PiTelegramLogo /></span>
                            </div>
                        </div>
                        <div className={style.customContent}>
                            <h2>{story?.slides[currentIndex]?.content?.heading}</h2>
                            <p>{story?.slides[currentIndex]?.content?.description}</p>
                            <div className={style.bottomBtns}>
                                <div>
                                    <FaBookmark
                                        onClick={() => { handleBookmarkClick(story) }}
                                        style={{ color: isBookmarked ? 'blue' : 'white' }}
                                    />
                                </div>
                                <div>
                                    <FaHeart
                                        onClick={userId ? handleLike : () => { navigate('/login') }}
                                        style={{ color: likes.includes(userId) ? 'red' : 'white' }}
                                    />
                                    <span>{likes.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.navBtn} onClick={nextSlide}><GrNext /></div>
                </>
            ) : (
                <h2 style={{ color: 'white' }}>Loading story...</h2>
            )}
        </>
    );
};

export default ViewStory;
