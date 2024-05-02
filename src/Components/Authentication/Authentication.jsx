import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";
import { MobileModalStyles, modalStyles } from "../../Utils/ModalStyles";
import style from './Authentication.module.css';
import { useDispatch } from 'react-redux';
import { login, register } from '../../Apis/userApi';

Modal.setAppElement('#root');

const Authentication = ({ type }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [formError, setFormError] = useState({ username: false, password: false });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [mobileView, setMobileView] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setMobileView(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
        setFormError({ ...formError, [name]: false })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = formData;
        const errors = {};

        if (!username.trim()) {
            errors.username = true;
        }

        if (!password.trim()) {
            errors.password = true;
        }

        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            return;
        }

        if (type === 'register') {
            dispatch(register(formData)).then((result) => {
                if (result.type === 'register/fulfilled') {
                    navigate('/');
                    setFormData({ username: '', password: '' });
                }
            }).catch((err) => {
                console.log(err);
            });
        } else {
            dispatch(login(formData)).then((result) => {
                if (result.type === 'login/fulfilled') {
                    navigate('/');
                    setFormData({ username: '', password: '' });
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    function closeModal() {
        navigate(-1);
    }
    return (
        <Modal
            isOpen={true}
            onRequestClose={closeModal}
            style={mobileView ? MobileModalStyles : modalStyles}
            shouldCloseOnOverlayClick={false}
        >
            <form className={style.form}>
                <heading>{type === 'login' ? 'Login' : 'Register'} to SwipTory</heading>

                <div className={style.inputContainer}>
                    <label htmlFor="username">Username</label>
                    <input type="text" name='username' id='username'
                        placeholder='Enter Username'
                        onChange={handleChange} />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' id='password'
                        placeholder='Enter Password'
                        onChange={handleChange} />
                </div>

                <p className={style.error}>
                    {formError.username ? 'Please enter valid username' :
                        formError.password ? 'Please enter valid password' : null}
                </p>

                <button type='submit' onClick={handleSubmit}>{type === 'login' ? 'Login' : 'Register'}</button>
            </form>
            <button className={style.closeBtn} onClick={closeModal}>X</button>
        </Modal>
    )
}

export default Authentication;