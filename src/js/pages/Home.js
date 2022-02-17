import { useEffect, useState } from 'react'
import HomeSlider from '../components/HomeSlider'
import { BASE_PATH, GET_ARTICLE_COMMENT_URI, GET_ARTICLE_NEW_URI, GET_COMPANY_HOME_URI, GET_NEWS_READ_A_LOT_URI, GET_SLIDE_URI } from '../config/api'
import axios from 'axios'
import { Link } from 'react-router-dom'

const getSlider = (callback) => {
    axios({
        method: 'get',
        url: GET_SLIDE_URI
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            callback(res.data.slide)
        }
    })
}

const getCompany = (callback) => {
    axios({
        method: 'get',
        url: GET_COMPANY_HOME_URI
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            callback(res.data.companies)
        }
    })
}

const getNewsReads = (callback) => {
    axios({
        method: 'get',
        url: GET_NEWS_READ_A_LOT_URI
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            callback(res.data.reads)
        }
    })
}

const getArticalNews = (callback) => {
    axios({
        method: 'get',
        url: GET_ARTICLE_NEW_URI
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            callback(res.data.news)
        }
    })
}

const getArticalComment = (callback) => {
    axios({
        method: 'get',
        url: GET_ARTICLE_COMMENT_URI
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            callback(res.data.newscomment)
        }
    })
}

const Home = (props) => {
    const [newHot, setNewHot] = useState([])
    const [reaALot, setReadALot] = useState([])
    const [companies, setCompanies] = useState([])
    const [updatedNew, setUpdatedNew] = useState([])
    const [newsComment, setNewsComment] = useState([])

    useEffect(() => {
        getSlider(setNewHot)
        getNewsReads(setReadALot)
        getCompany(setCompanies)
        getArticalNews(setUpdatedNew)
        getArticalComment(setNewsComment)
    }, [])

    return (
        <section id='homepage' className='page'>
            <section className='news__slider'>
                <HomeSlider banners={newHot} />
            </section>
            <section className='news__contain'>
                <section className='news__contain--main'>
                    <section className='news__block'>
                        <div className='news__head'>
                            <h3 className='news__head--title'>
                                <i className='icofont-fire-alt'></i>
                                Tin mới
                            </h3>
                            <span className='news__head--all'>Xem tất cả</span>
                        </div>
                        <section className='news__grid'>
                            {updatedNew && updatedNew.map(t => (
                                <div className='news__grid--item' key={t.id}>
                                    <div className='item__image'>
                                        <img className='item__image--photo' src={BASE_PATH + t.photo} />
                                    </div>
                                    <div className='item__info'>
                                        <Link to={'/news/' + t.slug} className='item__info--name'>{t.title}</Link>
                                        <p className='item__info--time'>{(new Date(t.published_at)).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}<a className='item__info--author'>{t.authors}</a></p>
                                        <p className='item__info--abstract'>{t.abstract}</p>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </section>
                    <section className='news__block'>
                        <div className='news__head'>
                            <h3 className='news__head--title'>
                                <i className='icofont-space'></i>
                                Bình luận nhiều
                            </h3>
                            <span className='news__head--all'>Xem tất cả</span>
                        </div>
                        <section className='news__grid'>
                            {newsComment && newsComment.map(n => (
                                <div className='news__grid--item' key={n.id}>
                                    <div className='item__image'>
                                        <img className='item__image--photo' src={BASE_PATH + n.photo} />
                                    </div>
                                    <div className='item__info'>
                                        <Link to={'/news/' + n.slug} className='item__info--name'>{n.title}</Link>
                                        <p className='item__info--time'>{(new Date(n.published_at)).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}<a className='item__info--author'>{n.authors}</a></p>
                                        <p className='item__info--abstract'>{n.abstract}</p>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </section>
                </section>
                <section className='news__contain--sub'>
                    <section className='news__block'>
                        <div className='news__head'>
                            <h3 className='news__head--title'>
                                <i className='icofont-learn'></i>
                                Đọc nhiều
                            </h3>
                            <span className='news__head--all'>Xem tất cả</span>
                        </div>
                        <section className='news__list'>
                            {reaALot && reaALot.map(item => (
                                <div className='news__list--item' key={item.id}>
                                <div className='item__image'>
                                    <img className='item__image--photo' src={BASE_PATH + item.photo} />
                                </div>
                                <div className='item__info'>
                                    <Link to={'/news/' + item.slug}  className='item__info--name'>{item.title}</Link>
                                    <p className='item__info--time'>{(new Date(item.published_at)).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}<a className='item__info--author'>{item.authors}</a></p>
                                    <p className='item__info--abstract'>{item.abstract}</p>
                                </div>
                            </div>
                            ))}
                        </section>
                    </section>  
                    <section className='news__block'>
                        <div className='news__head'>
                            <h3 className='news__head--title'>
                                <i className='icofont-address-book'></i>
                                Danh bạ công ty
                            </h3>
                            <span className='news__head--all'>Xem tất cả</span>
                        </div>
                        <section className='news__list'>
                            {companies && companies.map(c => (
                                <div className='news__list--item' key={c.id}>
                                    <div className='item__image'>
                                        <img className='item__image--photo contact' src={BASE_PATH + c.logo} />
                                    </div>
                                    <div className='item__info'>
                                        <a className='item__info--name'>{c.name}</a>
                                        <p className='item__info--address'>{c.address}</p>
                                        <p className='item__info--abstract'>{c.descript}</p>
                                    </div>          
                                </div>
                            ))}
                        </section>
                    </section>  
                </section>  
            </section>
        </section>
    )
}

export default Home