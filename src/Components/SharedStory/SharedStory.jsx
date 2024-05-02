import React, { useEffect, useState } from 'react';
import Modal from "react-modal";
import { MobileStoryModalStyles, storyModalStyles } from "../../Utils/ModalStyles";
import ViewStory from '../ViewStory/ViewStory';
import { useNavigate, useParams } from 'react-router-dom';

const SharedStory = () => {
    const [modalOpen, setModalOpen] = useState(true);
    const navigate = useNavigate();
    const { storyId } = useParams();
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

    const closeModal = () => {
        setModalOpen(false);
        navigate('/');
    };
    return (
        <Modal isOpen={modalOpen} onRequestClose={closeModal} style={mobileView ? MobileStoryModalStyles : storyModalStyles}>
            <ViewStory storyId={storyId} closeModal={closeModal} />
        </Modal>
    )
}

export default SharedStory;