import React, { useEffect, useState, useMemo } from 'react';
import style from "../Home/Home.module.css";
import Modal from "react-modal";
import { MobileStoryModalStyles, storyModalStyles } from "../../Utils/ModalStyles";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStories } from '../../Apis/storyApi';
import { useNavigate } from 'react-router-dom';
import ViewStory from '../ViewStory/ViewStory';

const MyStories = () => {
  const userId = localStorage.getItem('userId');
  const [modalOpen, setModalOpen] = useState(false);
  const [storyId, setStoryId] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stories = useSelector(state => state?.story)
  const userStories = Object.values(stories).flat().filter(story => story.author === userId);

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

  const renderUserStories = useMemo(() => {
    return userStories.map((story) => (
      <div key={story._id} className={style.postContainer} onClick={() => { handleStoryExpand(story) }}>
        <div>
          <span>{story.slides[0]?.content?.heading}</span>
          <p>{story.slides[0]?.content?.description}</p>
        </div>
        <img src={story.slides[0]?.content?.image} alt='storyPoster' />
        <button onClick={() => { handleEdit(story) }}><FaRegEdit />Edit</button>
      </div>
    ));
  }, [userStories]);

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

  useEffect(() => {
    dispatch(fetchAllStories());
  }, [dispatch]);

  return (
    <div className={style.mainContainer}>
      <div className={style.displayContainer}>
        {renderUserStories.length > 0 ? (
          <div className={style.collectionBox}>
            <h2>Your Stories</h2>
            <div className={style.storyRow}>
              {renderUserStories}
            </div>
          </div>
        ) : (
          <h2 className={style.noStories}>No Stories Available</h2>
        )}
      </div>

      <Modal isOpen={modalOpen} onRequestClose={closeModal} style={mobileView ? MobileStoryModalStyles : storyModalStyles}>
        <ViewStory storyId={storyId} closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default MyStories;
