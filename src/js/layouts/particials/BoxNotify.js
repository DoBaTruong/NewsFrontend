import { Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import avatar from '../../../images/bg/avatar-default.png'

const BoxNotify = ({
    userHeaderNotifyMenuAnchorEl,
    isUserHeaderNotifyMenuOpen,
    handleUserHeaderNotifyMenuClose,
    ...props}) => {
    const notifyMenuReadId = 'notifyMenuRead'
    const [notifyMenuReadAnchorEl, setNotifyMenuReadAnchorEl] = useState(null)

    const handleNotifyMenuReadOpen = (e) => {
        setNotifyMenuReadAnchorEl(e.currentTarget)
    }

    const handleNotifyMenuReadClose = () => {
        setNotifyMenuReadAnchorEl(null)
    }

    const isNotifyMenuReadOpen = Boolean(notifyMenuReadAnchorEl)

    return (
        <Menu 
            id='boxNotify'
            sx={{  
                marginTop: '.5em'
            }}
            anchorEl={userHeaderNotifyMenuAnchorEl}
            anchorOrigin={{ 
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{  
                vertical: 'top',
                horizontal: 'right'
            }}
            keepMounted
            open={isUserHeaderNotifyMenuOpen}
            onClose={handleUserHeaderNotifyMenuClose}
        >
            <div className='notify__title'>
                <h4 className='notify__title--name'>Thông báo</h4>
                <span 
                    className='notify__title--icon'
                    aria-controls={notifyMenuReadId}
                    aria-haspopup='true'
                    onClick={handleNotifyMenuReadOpen}
                ></span>
            </div>
            <MenuItem className='notify__item'>
                <div className='notify__item--user'>
                    <img className='notify__item--userPhoto' src={avatar} alt='' />
                </div>
                <div className='notify__item--desc'>
                    <p className='notify__item--descContent'>This week, food products in the UK and Canada have had to be recalled due to the presence of 
                        Salmonella and E.coli, while undeclared allergens have caused recalls in the UK and US.</p>
                    <span className='notify__item--descTime'>Một năm trước</span>
                </div>
                <div className='notify__item--status'>
                    <span  className='notify__item--statusDot'></span>
                </div>
            </MenuItem>    
            <MenuItem className='notify__item read'>
                <div className='notify__item--user'>
                    <img className='notify__item--userPhoto' src={avatar} alt='' />
                </div>
                <div className='notify__item--desc'>
                    <p className='notify__item--descContent'>This week, food products in the UK and Canada have had to be recalled due to the presence of 
                        Salmonella and E.coli, while undeclared allergens have caused recalls in the UK and US.</p>
                    <span className='notify__item--descTime'>Một năm trước</span>
                </div>
                <div className='notify__item--status'>
                    {/* <span  className='notify__item--statusDot'></span> */}
                </div>
            </MenuItem>         
            <Menu
                sx={{  
                    marginTop: '.5em'
                }}
                anchorEl={notifyMenuReadAnchorEl}
                anchorOrigin={{ 
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                id={notifyMenuReadId}
                transformOrigin={{  
                    vertical: 'top',
                    horizontal: 'right'
                }}
                keepMounted
                open={isNotifyMenuReadOpen}
                onClose={handleNotifyMenuReadClose}
            >
                <MenuItem>
                    <a className='remark__read--link'><i className='icofont-verification-check'></i> Đánh giá tất cả đã đọc</a>
                </MenuItem>
            </Menu>
        </Menu>
    )
}

export default BoxNotify