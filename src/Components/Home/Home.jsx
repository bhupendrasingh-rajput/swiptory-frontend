import React, { useEffect, useState, useMemo } from 'react';
import style from "./Home.module.css";
import Filters from '../Filters/Filters';
import Modal from "react-modal";
import { MobileStoryModalStyles, storyModalStyles } from "../../Utils/ModalStyles";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStories } from '../../Apis/storyApi';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewStory from '../ViewStory/ViewStory';

const Home = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const [filter, setFilter] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [storyId, setStoryId] = useState('');
    const [showAllStories, setShowAllStories] = useState({});
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const stories = useSelector(state => state?.story);

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

    const handleStoryExpand = (story) => {
        setStoryId(story._id);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        navigate('/');
    };


    const renderStoriesByCategory = useMemo(() => (category) => {
        let categoryWiseStories = stories[category];
        const displayLimit = showAllStories[category] ? categoryWiseStories?.length : 4;

        if (category === 'All') {
            categoryWiseStories = Object.values(stories).flat().filter(story => story.author === userId);
        }

        if (categoryWiseStories && categoryWiseStories.length > 0) {
            return categoryWiseStories.slice(0, displayLimit).map((story) => {
                const firstSlide = story.slides[0]?.content;

                if (firstSlide) {
                    return (
                        <div key={story._id} className={style.postContainer} onClick={() => { handleStoryExpand(story) }}>
                            <div>
                                <span>{firstSlide.heading}</span>
                                <p>{firstSlide.description}</p>
                            </div>
                            <img src={firstSlide.image} alt='storyPoster' />
                            {userId === story.author ? <button onClick={() => { handleEdit(story) }}><FaRegEdit />Edit</button> : ''}
                        </div>
                    );
                }
                return null;
            });
        }

        return <h2 className={style.noStories}>No Stories Available</h2>;
    }, [stories, userId, showAllStories]);


    const handleEdit = (story) => {
        if (story) {
            navigate('/add-story', {
                state: {
                    story: story,
                    editable: true
                }
            });
        }
    };

    const toggleShowAllStories = (category) => {
        setShowAllStories(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };

    useEffect(() => {
        dispatch(fetchAllStories());
    }, [dispatch]);

    useEffect(() => {
        setStoryId(location?.state?.storyId);
        setModalOpen(location?.state?.modalOpen);
    }, [location]);

    return (
        <div className={style.mainContainer}>
            <Filters filter={filter} setFilter={setFilter} />
            <div className={style.displayContainer}>
                {(isAuthenticated && filter === 'All') && (
                    <div className={style.collectionBox}>
                        <h2>Your Stories</h2>
                        <div className={style.storyRow}>
                            {renderStoriesByCategory('All')}
                        </div>
                        {!showAllStories['All'] && <button className={style.showMore} onClick={() => { toggleShowAllStories('All') }}>Show More</button>}
                    </div>
                )}

                {(!filter || filter === "All" || filter === 'Food') && (
                    <div className={style.collectionBox}>
                        <h2>Top Stories About Food</h2>
                        <div className={style.storyRow}>
                            {renderStoriesByCategory('Food')}
                        </div>
                        {!showAllStories['Food'] && <button className={style.showMore} onClick={() => { toggleShowAllStories('Food') }}>Show More</button>}
                    </div>
                )}

                {(!filter || filter === "All" || filter === 'Health and Fitness') && (
                    <div className={style.collectionBox}>
                        <h2>Top Stories About Health and Fitness</h2>
                        <div className={style.storyRow}>
                            {renderStoriesByCategory('Health and Fitness')}
                        </div>
                        {!showAllStories['Health and Fitness'] && <button className={style.showMore} onClick={() => { toggleShowAllStories('Health and Fitness') }}>Show More</button>}
                    </div>
                )}

                {(!filter || filter === "All" || filter === 'Travel') && (
                    <div className={style.collectionBox}>
                        <h2>Top Stories About Travel</h2>
                        <div className={style.storyRow}>
                            {renderStoriesByCategory('Travel')}
                        </div>
                        {!showAllStories['Travel'] && <button className={style.showMore} onClick={() => { toggleShowAllStories('Travel') }}>Show More</button>}
                    </div>
                )}

                {(!filter || filter === "All" || filter === 'Movie') && (
                    <div className={style.collectionBox}>
                        <h2>Top Stories About Movie</h2>
                        <div className={style.storyRow}>
                            {renderStoriesByCategory('Movie')}
                        </div>
                        {!showAllStories['Movie'] && <button className={style.showMore} onClick={() => { toggleShowAllStories('Movie') }}>Show More</button>}
                    </div>
                )}

                {(!filter || filter === "All" || filter === 'Education') && (
                    <div className={style.collectionBox}>
                        <h2>Top Stories About Education</h2>
                        <div className={style.storyRow}>
                            {renderStoriesByCategory('Education')}
                        </div>
                        {!showAllStories['Education'] && <button className={style.showMore} onClick={() => { toggleShowAllStories('Education') }}>Show More</button>}
                    </div>
                )}
            </div>
            <Modal isOpen={modalOpen} onRequestClose={closeModal} style={mobileView ? MobileStoryModalStyles : storyModalStyles}>
                <ViewStory storyId={storyId} closeModal={closeModal} />
            </Modal>
        </div>
    );

};

export default Home;
