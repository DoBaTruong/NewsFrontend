import styled from '@emotion/styled'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { getCategories, getStyles } from '../helpers/helpers.js'
import { useWindowDemensions } from '../helpers/hooks.js'
import Category from '../pages/Category.js'
import Company from '../pages/Company.js'
import CreateNews from '../pages/CreateNews.js'
import Home from '../pages/Home.js'
import Setting from '../pages/Setting.js'
import News from '../pages/News.js'
import Footer from './particials/Footer.js'
import Header from './particials/Header.js'
import Sidebar from './particials/Sidebar.js'
import UpdateNews from '../pages/UpdateNews.js'
import Search from '../pages/Search.js'
import axios from 'axios'
import { GET_ALL_CATEGORY_URI } from '../config/api.js'
import Details from '../pages/Details.js'

const WrapperEl = styled(({children, refs, customStyle, ...props}) => (
    <main ref={refs} {...props}>{children}</main>
))(({customStyle}) => customStyle)

function getAllCategories(callback, callbackTwo) {
    axios({
        method: 'get',
        url: GET_ALL_CATEGORY_URI
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            let getCate = getCategories(res.data.categories)
            callback(getCate)
            getCate.childrens.forEach(item => {
                if(item.category.slug === 'cong-nghe') {
                    callbackTwo(item.childrens)
                }
            })
        }
    })
}

const Main = ({token, isAdmin, logo, appCallback, userInfo, ...props}) => {
    const mainRef = useRef(null)
    const [categories, setCategories] = useState([])
    const [childCategories, setChildCategories] = useState([])
    const [mainStyle, setMainStyle] = useState('')
    const { width} = useWindowDemensions()

    useEffect(() => {
        getAllCategories(setCategories, setChildCategories)
        const fh = getStyles(document.getElementById('footer'), 'height')
        const hh = getStyles(document.getElementById('header'), 'height')
        setMainStyle(`min-height: calc(100vh - ${fh + hh}px)`)

        const sw = document.getElementById('sidebar') ? getStyles(document.getElementById('sidebar'), 'width') : 0
        Array.from(document.getElementsByClassName('page')).map((elem, index) => {
            elem.style.width = `calc(100% - ${sw}px)`
            return true
         })
    }, [])

    return (
        <Fragment>
            <Header userInfo={userInfo} token={token} appCallback={appCallback} logo={logo} />
            <WrapperEl customStyle={mainStyle} refs={mainRef} id='wrapper'>
                { 
                    width >= 64*16 && (<Sidebar childCategories={childCategories} categories={categories} isAdmin={isAdmin} token={token} />)
                }
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/settings' element={<Setting appCallback={appCallback} userInfo={userInfo} />} />
                    <Route path='/search/:category/:keyword' element={<Search appCallback={appCallback} userInfo={userInfo} />} />
                    <Route path='/admin/categories/*' element={<Category isAdmin={isAdmin} appCallback={appCallback} />} />
                    <Route path='/admin/contacts/*' element={<Company isAdmin={isAdmin} appCallback={appCallback} />} />
                    <Route path='/admin/news/post' element={<CreateNews isAdmin={isAdmin} appCallback={appCallback} />} />
                    <Route path='/admin/news/list' element={<News isAdmin={isAdmin} appCallback={appCallback} />} />
                    <Route path='/admin/news/update/:slug' element={<UpdateNews isAdmin={isAdmin} appCallback={appCallback} />} />
                    <Route path='/news/:slug' element={<Details isAdmin={isAdmin} appCallback={appCallback} />} />
                </Routes>
            </WrapperEl>
            <Footer appCallback={appCallback} logo={logo} />
        </Fragment>
    )
}

export default Main