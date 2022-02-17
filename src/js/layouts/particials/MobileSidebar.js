import { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'
import avatar from '../../../images/bg/avatar-default.png'

const MobileSidebar = ({handleUserHeaderMenuClose, handleMobileSidebarClose, infoUser, handleLogout, ...props}) => {
    return (
        <aside id='mobileSidebar' onClick={handleMobileSidebarClose}>
            <section className='mobile__sidebar'>
                {
                    infoUser && (
                        <div className='sidebar__user'>
                            <Link 
                                className='sidebar__user--config' 
                                to='settings' 
                                onClick={handleUserHeaderMenuClose}
                            >
                                <i className='icofont-automation'></i>
                            </Link>
                            <img className='sidebar__user--photo' src={infoUser.photo ?? avatar} alt='' />
                            <div className='sidebar__user--info'>
                                <p className='sidebar__user--infoName'>{infoUser.name}</p>
                                <span className='sidebar__user--infoMail'>@{infoUser.email.split('@')[0]}</span>
                            </div>
                        </div>
                    )
                }
                <ul className='sidebar__menu'>
                    {
                        infoUser ? (
                            <Fragment>
                                <li className='sidebar__menu--item'>
                                    <NavLink to='/admin/news/post' className={navData => 'item__link' + (navData.isActive ? ' active' : '')}>
                                        <i className='icofont-newspaper'></i>
                                        <span className='item__link--name'>Đăng bài</span>
                                    </NavLink>
                                </li>
                                <li className='sidebar__menu--item'>
                                    <NavLink to='/admin/categories' className={navData => 'item__link' + (navData.isActive ? ' active' : '')}>
                                        <i className='icofont-library'></i>
                                        <span className='item__link--name'>Danh mục</span>
                                    </NavLink>
                                </li>
                                <li className='sidebar__menu--item'>
                                    <NavLink to='/admin/contacts' className={navData => 'item__link' + (navData.isActive ? ' active' : '')}>
                                        <i className='icofont-card'></i>
                                        <span className='item__link--name'>Công ty</span>
                                    </NavLink>
                                </li>
                            </Fragment>
                        ) : (
                            <li className='sidebar__menu--item'>
                                <Link to='/accounts/login' className='item__link'>
                                    <i className='icofont-login'></i>
                                    <span className='item__link--name'>Đăng nhập</span>
                                </Link>
                            </li>
                        )
                    }
                </ul>
                <ul className='sidebar__menu'>
                    <li className='sidebar__menu--item'>
                        <NavLink to={'/'} className={navData =>  'item__link' + (navData.isActive ? ' active' : ''  )}>
                            <i className='icofont-home'></i>
                            <span className='item__link--name'>Trang chủ</span>
                        </NavLink>
                    </li>
                    <li className='sidebar__menu--item'>
                        <a className='item__link'>
                            <i className='icofont-heart-beat-alt'></i>
                            <span className='item__link--name'>Sức khỏe</span>
                        </a>
                    </li>
                    <li className='sidebar__menu--item'>
                        <a className='item__link'>
                            <i className='icofont-industries-3'></i>
                            <span className='item__link--name'>Công nghệ</span>
                        </a>
                    </li>
                    <li className='sidebar__menu--item'>
                        <a className='item__link'>
                            <i className='icofont-court-hammer'></i>
                            <span className='item__link--name'>Pháp luật</span>
                        </a>
                    </li>
                </ul>
                {
                    infoUser && (
                        <Fragment>
                            <ul className='sidebar__menu'>
                                <li className='sidebar__menu--item'>
                                    <a className='item__link'>
                                        <i className='icofont-home'></i>
                                        <span className='item__link--name'>Bài viết đã lưu</span>
                                    </a>
                                </li>
                            </ul>
                            <ul className='sidebar__menu'>
                                <li className='sidebar__menu--item'>
                                    <div className='item__link' onClick={handleLogout}>
                                        <i className='icofont-logout'></i>
                                        <span className='item__link--name'>Đăng xuất</span>
                                    </div>
                                </li>
                            </ul>
                        </Fragment>
                    )
                }
            </section>
        </aside>
    )
}

export default MobileSidebar