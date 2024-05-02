import React, { useEffect, useState } from 'react';
import Modal from "react-modal";
import { MobileModalStyles, modalStyles } from "../../Utils/ModalStyles";
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select'
import { v4 as uuid } from "uuid";
import { SelectStyles, mobileSelectStyles, options } from '../../Utils/SelectUtils';
import style from "./AddStory.module.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addStory, editStory } from '../../Apis/storyApi';

const AddStory = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [slides, setSlides] = useState([
        { id: uuid(), content: { heading: '', description: '', image: '' } },
        { id: uuid(), content: { heading: '', description: '', image: '' } },
        { id: uuid(), content: { heading: '', description: '', image: '' } },
    ]);
    const [activeSlideId, setActiveSlideId] = useState(slides.length > 0 ? slides[0].id : null);
    const [activeSlide, setActiveSlide] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { story, editable } = location.state || {};

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

    const addSlide = () => {
        if (slides.length < 6) {
            setSlides([...slides, { id: uuid(), content: { heading: '', description: '', image: '' } }]);
        }
    };

    const deleteSlide = (id) => {
        setSlides((prevSlides) => {
            const index = prevSlides.findIndex((slide) => slide.id === id);
            if (index !== -1) {
                const newSlides = [...prevSlides];
                newSlides.splice(index, 1);
                const newActiveSlideId = index === 0 ? prevSlides[1]?.id : prevSlides[0]?.id;
                setActiveSlideId(newActiveSlideId);
                return newSlides;
            }
            return prevSlides;
        });
    };

    const goToSlide = (id) => {
        setActiveSlideId(id);
    };

    const goToPrevSlide = () => {
        const index = slides.findIndex(slide => slide.id === activeSlideId);
        if (index > 0) {
            setActiveSlideId(slides[index - 1].id);
        }
    };

    const goToNextSlide = () => {
        const index = slides.findIndex(slide => slide.id === activeSlideId);
        if (index < slides.length - 1) {
            setActiveSlideId(slides[index + 1].id);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedSlide = { ...activeSlide };
        updatedSlide.content[name] = value;
        setActiveSlide(updatedSlide);
    };


    const handlePost = (event) => {
        event.preventDefault();
        const emptySlide = slides.find(slide => !slide.content.heading || !slide.content.description || !slide.content.image);
        if (emptySlide) {
            toast.error('All fields are mandatory!');
            return;
        }

        const storyData = {
            slides: slides.map(slide => ({
                id: slide.id,
                content: slide.content
            })),
            category: selectedCategory
        };

        if (editable && story) {
            dispatch(editStory({ ...story, ...storyData })).then((result) => {
                if (result.type === 'editStory/fulfilled') {
                    setIsOpen(false);
                    navigate('/');
                }
            }).catch((err) => {
                console.log(err);
            });
        } else {
            dispatch(addStory(storyData)).then((result) => {
                setIsOpen(false);
                navigate('/');
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const handleCategoryChange = (selectedOption) => {
        const newCategory = selectedOption.value;
        setSelectedCategory(newCategory);
    };

    const closeModal = () => {
        navigate('/');
    }

    useEffect(() => {
        if (editable && story) {
            setSlides(story.slides.map(slide => ({ id: slide.id, content: slide.content })));
            setSelectedCategory(story.category);
            setActiveSlideId(story.slides.length > 0 ? story.slides[0].id : null);
        }
    }, [editable, story]);

    useEffect(() => {
        setActiveSlide(slides.find(slide => slide.id === activeSlideId));
    }, [activeSlideId, slides]);


    return (
        <Modal className={style.modal} isOpen={isOpen} onRequestClose={closeModal} shouldCloseOnOverlayClick={false} style={mobileView ? MobileModalStyles : modalStyles}>
            <div className={style.modalHeader} onClick={closeModal}>
                {mobileView ? <p>Add story to feed</p> : <p>Add up to 6 slides</p>}
                <button>X</button>
            </div>
            <div className={style.slideContainer}>
                {slides.map((slide, index) => (
                    <div key={slide.id}
                        id={activeSlideId === slide.id ? style.activeSlide : ''}
                        onClick={() => goToSlide(slide.id)}>
                        <p>Slide {index + 1}</p>
                        {index + 1 > 3 ? <button onClick={() => deleteSlide(slide.id)}>X</button> : ''}
                    </div>
                ))}
                <div onClick={addSlide}>Add+</div>
            </div>
            <form className={style.slideForm}>
                <div className={style.inputBox}>
                    <label htmlFor="heading">Heading :</label>
                    <input type="text" name='heading' id='heading' placeholder='Your Heading'
                        value={activeSlide?.content?.heading || ''}
                        onChange={handleChange} />
                </div>
                <div className={style.inputBox}>
                    <label htmlFor="description">Description :</label>
                    <textarea name='description' id='description' placeholder='Your Heading'
                        value={activeSlide?.content?.description || ''}
                        onChange={handleChange} />
                </div>
                <div className={style.inputBox}>
                    <label htmlFor="image">Image :</label>
                    <input type="text" name='image' id='image' placeholder='Add Image URL'
                        value={activeSlide?.content?.image || ''}
                        onChange={handleChange} />
                </div>
                <div className={style.inputBox}>
                    <label htmlFor="category">Category :</label>
                    <Select
                        options={options}
                        placeholder={selectedCategory ? selectedCategory : 'Select category'}
                        isSearchable={false}
                        styles={mobileView ? mobileSelectStyles : SelectStyles}
                        onChange={handleCategoryChange}
                    />
                    {!mobileView && <p>This field will be common for all slides</p>}
                </div>
            </form>

            <div className={style.buttonRow}>
                {!mobileView && <button id={style.BtnPrev} onClick={goToPrevSlide}>Previous</button>}
                {!mobileView && <button id={style.BtnNext} onClick={goToNextSlide}>Next</button>}
                <button id={style.BtnPost} onClick={handlePost}>Post</button>
            </div>

        </Modal>
    )
}

export default AddStory;
