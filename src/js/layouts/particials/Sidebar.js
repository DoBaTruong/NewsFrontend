import { Menu, MenuItem } from "@mui/material"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import {decodeHtml} from '../../helpers/helpers.js'

const Sidebar = ({token, isAdmin, categories, childCategories}) => {
    const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null)
    const [foodTechMenuAnchorEl, setFoodTechMenuAnchorEl] = useState(null)
    const isAdminMenuOpen = Boolean(adminMenuAnchorEl)
    const isFoodTechMenuOpen = Boolean(foodTechMenuAnchorEl)

    const handleAdminMenuClose = () => {
        setAdminMenuAnchorEl(null)
    }

    const handleFoodTechMenuClose = () => {
        setFoodTechMenuAnchorEl(null)
    }

    const handleFoodTechMenuOpen = (e) => {
        setAdminMenuAnchorEl(null)
        setFoodTechMenuAnchorEl(e.currentTarget)
    }

    const handleAdminMenuOpen = (e) => {
        setFoodTechMenuAnchorEl(null)
        setAdminMenuAnchorEl(e.currentTarget)
    }

    const adminMenuId = 'sidebarSub'
    const foodTechMenuId = 'sidebarFoodTechSub'

    return (
        <aside id='sidebar'>
            { token && isAdmin &&
                (<div 
                    className='sidebar__menu--admin'
                    aria-controls={adminMenuId}
                    aria-haspopup='true'
                    onClick={handleAdminMenuOpen}
                >
                    <i className='icofont-plus'></i>
                </div>)
            }
            <ul className='sidebar__menu'>
                <li className='sidebar__menu--item'>
                    <NavLink to={'/'} className={navData => navData.isActive ? 'sidebar__item active' : 'sidebar__item'}>
                        <i className='icofont-home'></i>
                        <span className='sidebar__item--label'>Home</span>
                    </NavLink>
                </li>
                {categories.childrens && categories.childrens.map(item => (
                    <li 
                        key={item.category.slug}
                        className='sidebar__menu--item'
                        aria-controls={item.category.slug === 'cong-nghe' ? foodTechMenuId : ''}
                        onClick={item.category.slug === 'cong-nghe' ? handleFoodTechMenuOpen : () => false}
                    >
                        {
                            item.category.slug !== 'cong-nghe' ? (
                            <NavLink to={`/search/${item.category.slug}/""`} className={navData => navData.isActive ? 'sidebar__item active' : 'sidebar__item'}>
                                {item.category.slug === 'suc-khoe' ? (<i className='icofont-heart-beat-alt'></i>) : ''} 
                                {item.category.slug === 'cong-nghe' ? (<i className='icofont-industries-3'></i>) : ''} 
                                {item.category.slug === 'phap-luat' ? (<i className='icofont-court-hammer'></i>) : ''} 
                                <span className='sidebar__item--label'>{item.category.name}</span>
                            </NavLink>
                            ) : (
                                <a className={'sidebar__item'}>
                                    <i className='icofont-industries-3'></i>
                                    <span className='sidebar__item--label'>{item.category.name}</span>
                                </a> 
                            )
                        }
                        
                    </li>
                ))}
            </ul>
            <Menu
                sx={{  
                    marginTop: '.5em'
                }}
                anchorEl={foodTechMenuAnchorEl}
                anchorOrigin={{ 
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                id={foodTechMenuId}
                transformOrigin={{  
                    vertical: 'top',
                    horizontal: 'left'
                }}
                keepMounted
                open={isFoodTechMenuOpen}
                onClose={handleFoodTechMenuClose}
            >
                {childCategories && childCategories.map(c => (
                    <MenuItem className='submenu__item' key={c.category.id}>
                        <NavLink to={`/search/${c.category.slug}/''`}  to={`/search/${c.category.slug}/""`} className={navData => navData.isActive ? 'submenu__item--link active' : 'submenu__item--link'}>
                            {c.category.slug === 'trien-vong' ? (<i className='icofont-bars'></i>) : ''} 
                            {c.category.slug === 'san-xuat' ? (<i className='icofont-fruits'></i>) : ''} 
                            {c.category.slug === 'rd' ? (<i className='icofont-laboratory'></i>) : ''} 
                            {c.category.slug === 'qaqc' ? (<i className='icofont-license'></i>) : ''} 
                            {c.category.slug === 'phu-gia' ? (<i className='icofont-search-2'></i>) : ''} 
                            <span className='submenu__item--linkLabel'>{decodeHtml(c.category.name)}</span>
                        </NavLink>
                    </MenuItem>
                ))}
            </Menu>
            { token && isAdmin &&(<Menu
                sx={{  
                    marginTop: '.5em'
                }}
                anchorEl={adminMenuAnchorEl}
                anchorOrigin={{ 
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                id={adminMenuId}
                transformOrigin={{  
                    vertical: 'top',
                    horizontal: 'left'
                }}
                keepMounted
                open={isAdminMenuOpen}
                onClose={handleAdminMenuClose}
            >
                <MenuItem className='submenu__item'>
                    <NavLink to='/admin/news/post' onClick={handleAdminMenuClose} className={navData => 'submenu__item--link' + (navData.isActive ? ' active' : '')}>
                        <i className='icofont-pen-holder'></i>
                        <span className='submenu__item--linkLabel'>Đăng bài</span>
                    </NavLink>
                </MenuItem>
                <MenuItem className='submenu__item'>
                    <NavLink to='/admin/categories' onClick={handleAdminMenuClose} className={navData => 'submenu__item--link' + (navData.isActive ? ' active' : '')}>
                        <i className='icofont-tasks-alt'></i>
                        <span className='submenu__item--linkLabel'>Danh mục</span>
                    </NavLink>
                </MenuItem>
                <MenuItem className='submenu__item'>
                    <NavLink to='/admin/contacts' onClick={handleAdminMenuClose} className={navData => 'submenu__item--link' + (navData.isActive ? ' active' : '')}>
                        <i className='icofont-address-book'></i>
                        <span className='submenu__item--linkLabel'>Danh bạ</span>
                    </NavLink>
                </MenuItem>
            </Menu>) }
        </aside>
    )
}

export default Sidebar