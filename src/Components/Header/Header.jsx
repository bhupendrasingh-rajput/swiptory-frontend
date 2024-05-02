import React, { useEffect, useState } from 'react';
import style from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import Hamburger from 'hamburger-react'
import { useDispatch } from 'react-redux';
import { logout } from '../../Store/Features/User';
import { toast } from 'react-toastify';
import ProfilePic from "../../Assets/Images/ProfilePic.png";
import Bookmark from '../../Assets/Icons/Bookmark.jpg';


const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        localStorage.getItem('isAuthenticated');
    });

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

    const [isOpen, setOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        setIsAuthenticated(false);
        toast.info('Logged out!')
        navigate('/');
    }

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('isAuthenticated'));
    }, [dispatch, navigate]);


    return (
        <div className={style.header}>
            <div className={style.appLogo} onClick={() => { navigate('/') }}>SwipTory</div>
            {mobileView ? <div className={style.profileContainer}>
                <Menu menuStyle={mobileView ? { width: '100vw' } : {}}
                    menuButton={<MenuButton className={style.menuBtn}>
                        <Hamburger toggled={isOpen} toggle={setOpen} />
                    </MenuButton>}
                    transition menuClassName={style.menu}>
                    {isAuthenticated && <MenuItem className={style.menuItem}>
                        <img src={ProfilePic} alt="profile_pic" className={style.ProfilePic} />
                        {localStorage.getItem('username')}
                    </MenuItem>}
                    {isAuthenticated && <MenuItem className={style.menuItem}>
                        <div className={style.navigateBtn} onClick={() => { navigate('/my-stories') }}>Your story</div>
                    </MenuItem>}
                    {isAuthenticated && <MenuItem className={style.menuItem}>
                        <div className={style.navigateBtn} onClick={() => { navigate('/add-story') }}>Add story</div>
                    </MenuItem>}
                    {isAuthenticated && <MenuItem className={style.menuItem}>
                        <div className={style.navigateBtn} onClick={() => { navigate('/bookmarks') }}>
                            <img src={Bookmark} alt="bookmark" className={style.bookmark} />Bookmarks
                        </div>
                    </MenuItem>}
                    {isAuthenticated && <MenuItem className={style.menuItem}>
                        <button onClick={handleLogout}>Logout</button>
                    </MenuItem>}

                    {!isAuthenticated && <MenuItem className={style.menuItem}>
                        <button onClick={() => { navigate('/login') }}>Login</button>
                    </MenuItem>}
                    {!isAuthenticated && <MenuItem className={style.menuItem}>
                        <button onClick={() => { navigate('/register') }}>Register</button>
                    </MenuItem>}
                </Menu>
            </div> :
                <div className={style.profileContainer}>
                    {!isAuthenticated && <div className={style.buttonContainer}>
                        <button className={style.registerBtn} onClick={() => { navigate('/register') }}>Register Now</button>
                        <button className={style.loginBtn} onClick={() => { navigate('/login') }}>Sign in</button>
                    </div>}
                    {isAuthenticated && <div className={style.navigateBtn} onClick={() => { navigate('/bookmarks') }}>
                        <img src={Bookmark} alt="bookmark" className={style.bookmark} />Bookmarks
                    </div>}
                    {isAuthenticated && <div className={style.navigateBtn} onClick={() => { navigate('/add-story') }}>Add story</div>}
                    {isAuthenticated && <img src={ProfilePic} alt="profile_pic" className={style.ProfilePic} />}
                    {isAuthenticated &&
                        <Menu menuStyle={mobileView ? { width: '100vw' } : {}}
                            menuButton={<MenuButton className={style.menuBtn}>
                                <Hamburger toggled={isOpen} toggle={setOpen} />
                            </MenuButton>}
                            transition menuClassName={style.menu}>
                            <MenuItem className={style.menuItem}>
                                {localStorage.getItem('username')}
                            </MenuItem>
                            <MenuItem className={style.menuItem}>
                                <button onClick={handleLogout}>Logout</button>
                            </MenuItem>
                        </Menu>
                    }
                </div>
            }
        </div>
    )
}

export default Header;

