import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import HomeSlider from '../components/HomeSlider'
import { GET_NEWS_URI } from '../config/api'

const getNews = (slug, callback, callbackTwo) => {
    axios({
        method: 'get',
        url: GET_NEWS_URI + `/${slug}`
    })
    .then(res => {
        console.log(res.data)
        if(res.data.code === 200 || !res.data.code) {
            callback(res.data.news)
            callbackTwo(res.data.relateds)
        }
    })
}

const Details = ({...props}) => {
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
            </section>
        </section>
    )
}

export default Details