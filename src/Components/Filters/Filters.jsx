import React, { useEffect, useState } from 'react';
import style from "./Filters.module.css";
import All from "../../Assets/Images/AllCategories.jpg";
import Food from "../../Assets/Images/Food.jpg";
import Fitness from "../../Assets/Images/Fitness.jpg";
import Travel from "../../Assets/Images/Travel.jpg";
import Movie from "../../Assets/Images/Movie.jpg";
import Education from "../../Assets/Images/Education.jpg";

const Categories = [
    {
        title: 'All',
        link: All
    },
    {
        title: 'Food',
        link: Food
    },
    {
        title: 'Health and Fitness',
        link: Fitness
    },
    {
        title: 'Travel',
        link: Travel
    },
    {
        title: 'Movie',
        link: Movie
    },
    {
        title: 'Education',
        link: Education
    },
]

const Filters = ({ filter, setFilter }) => {
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

    return (
        <div className={style.mainContainer}>
            {Categories.map((item, index) => (
                <div
                    className={style.categoryBox}
                    key={index} onClick={() => { setFilter(item.title) }}
                    style={(mobileView && item.title === 'All') ? { display: 'none' } : {}}
                >
                    <img src={item.link} alt="image" id={filter === item.title ? style.selected : null} />
                    <p>{item.title}</p>
                </div>
            ))
            }
        </div >
    )
}

export default Filters;