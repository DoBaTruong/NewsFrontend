import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu } from '@mui/material'
import { useWindowDemensions } from '../../helpers/hooks'
import MobileSidebar from './MobileSidebar'
import { getParent } from '../../helpers/helpers'
import BoxNotify from './BoxNotify'
import { BASE_PATH, LOGOUT_API_URI } from '../../config/api'
import { getValue } from '@testing-library/user-event/dist/utils'

const UserHeadElem = (props) => {
    return (
        <div className='header__user'>
            <div 
                className='header__user--notify'
                aria-controls='boxNotify'
                aria-haspopup='true'
                onClick={props.handleUserHeaderNotifyMenuOpen}
            >
                <i className='icofont-alarm'></i>
                <span className='broadcast'></span>
            </div>
            {
                props.widthResize >= 64*16 && (
                    <div 
                        className='header__user--manage'
                        aria-controls={props.userHeaderMenuId}
                        aria-haspopup='true'
                        onClick={props.handleUserHeaderMenuOpen}
                    >
                        <div className='user__avatar'>
                            <img className='user__avatar--photo' src={BASE_PATH + props.logo} alt='' />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

const UserHeadMenuElem = (props) => {
    return (
        <Menu
            sx={{  
                marginTop: '.5em'
            }}
            anchorEl={props.userHeaderAnchorEl}
            anchorOrigin={{ 
                vertical: 'bottom',
                horizontal: 'right'
            }}
            id={props.userHeaderMenuId}
            transformOrigin={{  
                vertical: 'top',
                horizontal: 'right'
            }}
            keepMounted
            open={props.isUserHeaderMenuOpen}
            onClose={props.handleUserHeaderMenuClose}
        >
            <div className='submenu__head'> 
                <img className='submenu__head--photo' src={BASE_PATH + props.logo} alt='' />
                <div className='submenu__head--info'>
                    <p className='submenu__head--infoName'>{props.infoUser.name}</p>
                    <span className='submenu__head--infoEmail'>{'@' + props.infoUser.email.split('@')[0]}</span>
                </div>
            </div>
            <a className='submenu__item'>Bài viết đã lưu</a>
            <NavLink onClick={props.handleUserHeaderMenuClose} to='/settings' className={navData => 'submenu__item' + (navData.isActive ? ' active' : ''  )}>Cài đặt</NavLink>
            <a className='submenu__item' onClick={props.handleLogout}>Đăng xuất</a>
        </Menu>
    )
}

const Header = ({
    logo, 
    appCallback, 
    userInfo
    }) => {
    const {width} = useWindowDemensions()
    const [cookies, setCookie] = useCookies(['token', '_rftok'])
    const [userHeaderAnchorEl, setUserHeaderAnchorEl] = useState(null)
    const [infoUser, setUserInfo] = useState(null)
    const [mobileSidebarAnchorEl, setMobileSidebarAnchorEl] = useState(null)
    const [userHeaderNotifyMenuAnchorEl, setUserHeaderNotifyMenuAnchorEl] = useState(null)
    const isUserHeaderMenuOpen = Boolean(userHeaderAnchorEl)
    const isUserHeaderNotifyMenuOpen = Boolean(userHeaderNotifyMenuAnchorEl)
    const navigate = useNavigate()

    const handleUserHeaderMenuOpen = (e) => {
        setUserHeaderAnchorEl(e.currentTarget)
    }

    const handleUserHeaderNotifyMenuOpen = (e) => {
        setUserHeaderNotifyMenuAnchorEl(e.currentTarget)
    }
    
    const handleUserHeaderMenuClose = () => {
        setUserHeaderAnchorEl(null)
        setMobileSidebarAnchorEl(null)
    }

    const handleUserHeaderNotifyMenuClose = () => {
        setUserHeaderNotifyMenuAnchorEl(null)
    }

    const handleLogout = () => {
        handleUserHeaderMenuClose()
        if(infoUser) {
            axios({
                method: 'delete',
                url: LOGOUT_API_URI,
                data: {
                    rftoken: cookies['_rftok']
                }
            })
            .then(res => {
                if(res.data.code === 200) {
                    setCookie('token', '', {'expires': new Date(-1)})
                    setCookie('_rftok', '', {'expires': new Date(-1)})
                    window.localStorage.removeItem('personroot')
                }
            })
        } else {
            setCookie('token', '', {'expires': new Date(-1)})
            setCookie('_rftok', '', {'expires': new Date(-1)})
        }
        appCallback(null)
        setUserInfo(null)
    }

    const handleMobileSidebarOpen = () => {
        setMobileSidebarAnchorEl(true)
    }

    const handleMobileSidebarClose = (e) => {
        if(getParent(e.target, '.item__link')) {
            setMobileSidebarAnchorEl(null)
        } else {
            if(!getParent(e.target, '.mobile__sidebar')) {
                setMobileSidebarAnchorEl(null)
            }
        }
    }
 
    useEffect(() => {
        setUserInfo(userInfo)
    }, [userInfo])
    
    const userHeaderMenuId = 'userHeader'

    const handleOnClick = () => {
        navigate(`/search/all/${getValues('keyword')}`)
    }

    const {register, getValues} = useForm()

    return (
        <header id='header'>
            <div className='header__toggle--logo'>
                {
                    width < 64 * 16 && (<div className='header__toggle'>
                                            <i className='icofont-navigation-menu' onClick={handleMobileSidebarOpen}></i>
                                        </div>)
                }
                {
                    width >= 46.25 * 16 && (
                        <div className='header__logo'>
                            <img className='header__logo--photo' alt='' src={logo} />
                        </div>
                    )
                }
            </div>
            <div className='header__search'>
                <input {...register('keyword')} className='header__search--input' type='text' placeholder='Tìm kiếm' />
                <button className='header__search--btn' onClick={handleOnClick}> 
                    <i className='icofont-ui-search'></i>
                </button>
            </div>
            {infoUser && (
                <UserHeadElem
                    userHeaderMenuId={userHeaderMenuId}
                    widthResize={width}
                    handleUserHeaderMenuOpen={handleUserHeaderMenuOpen}
                    handleUserHeaderNotifyMenuOpen={handleUserHeaderNotifyMenuOpen}
                    logo={userInfo.photo ?? logo}
                />
             )}
             {
                 infoUser && width >= 64 * 16 && (
                     <UserHeadMenuElem 
                        logo={userInfo.photo ?? logo}
                        handleUserHeaderMenuClose={handleUserHeaderMenuClose}
                        isUserHeaderMenuOpen={isUserHeaderMenuOpen}
                        userHeaderAnchorEl={userHeaderAnchorEl}
                        handleLogout={handleLogout}
                        userHeaderMenuId={userHeaderMenuId}
                        infoUser={infoUser}
                     />
                 )
             }
             {
                 !infoUser && width >= 64 * 16 && (
                    <Link to='/accounts/login' className='header__user--login'>Đăng nhập</Link>
                )
             }
             {
                mobileSidebarAnchorEl && width < 64 * 16 && (<MobileSidebar 
                                                                handleUserHeaderMenuClose={handleUserHeaderMenuClose} 
                                                                handleLogout={handleLogout} 
                                                                infoUser={infoUser} 
                                                                handleMobileSidebarClose={handleMobileSidebarClose} 
                                                            />) 
             }
             {
                 infoUser && (<BoxNotify 
                                userHeaderNotifyMenuAnchorEl={userHeaderNotifyMenuAnchorEl}
                                isUserHeaderNotifyMenuOpen={isUserHeaderNotifyMenuOpen}
                                handleUserHeaderNotifyMenuClose={handleUserHeaderNotifyMenuClose}
                            />)
             }
        </header>
    )
}

export default Header