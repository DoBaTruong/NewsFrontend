import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import HomeSlider from '../components/HomeSlider'
import { GET_NEWS_URI, BASE_PATH } from '../config/api'

const getNews = (slug, callback, callbackTwo) => {
    axios({
        method: 'get',
        url: GET_NEWS_URI + `/${slug}`
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            callback(res.data.news)
            callbackTwo(res.data.relateds)
        }
    })
}

const Details = ({userInfo}) => {
    const {slug} = useParams()
    const [news, setNews] = useState(null)
    const [relateds, setRelateds] = useState([])

    useEffect(() => {
        getNews(slug, setNews, setRelateds)
    }, [])

    useEffect(() => {
        if(news) {
            let elem = document.createElement('div')
            elem.innerHTML = news.content
            document.getElementById('content').innerHTML = elem.innerText
        }
    }, [news])

    return(
        <section id='detailpage' className='page'>
            <section className='page__news'>
                {news && (
                    <Fragment>
                        <h3 className='page__news--title'>{news.title}</h3>
                        <p className='page__news--time'>{(new Date(news.published_at)).toLocaleDateString('en-US', {day: 'string', year: 'numeric', month: 'long', day: 'numeric'})}<span></span></p>
                        <div id='content'></div>
                        <p className='page__news--author'>{news.authors}</p>
                        <section className='news__slider'>
                            <HomeSlider banners={relateds} />
                        </section>
                    </Fragment>
                )}
                <section className='page__news--comment'>
                    <div className='comment'>
                        <div className='comment__container'>
                            <div className='comment__container--item'>
                                <div className='comment__item'>
                                    <div className='comment__item--photo'>
                                        <img src={BASE_PATH + userInfo.photo} alt='' />
                                    </div>
                                    <div className='comment__item--content'>
                                        <div className='item__info'>
                                            <p className='item__info--name'>{userInfo.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </section>
    )
}

export default Details