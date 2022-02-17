import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import parse from 'html-react-parser'
import { GET_NEWS_URI } from '../config/api'

const getNews = (slug, callback) => {
    axios({
        method: 'get',
        url: GET_NEWS_URI + `/${slug}`
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            callback(res.data.category)
        }
    })
}

const options = {
    replace: (domNode) => {
        if (domNode.attribs && domNode.attribs.class === "remove") {
            return <></>;
        }
    }
}

const ContentElement = ({content}) => {
    return parse(content, options)
}

const Details = ({...props}) => {
    const {slug} = useParams()
    const [news, setNews] = useState(null)
    useEffect(() => {
        getNews(slug, setNews)
    }, [])

    useEffect(() => {
        if(news) {
            // var e = document.createElement('div')
            // e.innerHTML = news.content
            // document.getElementById('content').innerHTML = e.innerHTML
            // let html = () => (new DOMParser().parseFromString(news.content, "text/html").body.childNodes)
            // console.log(html)
            // document.getElementById('content').appendChild(news.content)
            // let frag = document.createRange().createContextualFragment(news.content)
            // console.log(frag)
        }
    }, [news])

    return(
        <section id='detailpage' className='page'>
            <section className='page__news'>
                {news && (
                    <Fragment>
                        <h3>{news.title}</h3>
                        <p>{(new Date(news.published_at)).toLocaleDateString('en-US', {day: 'string', year: 'numeric', month: 'long', day: 'numeric'})}<span></span></p>
                        <div id='content'></div>
                    </Fragment>
                )}
            </section>
        </section>
    )
}

export default Details