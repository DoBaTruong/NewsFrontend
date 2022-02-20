import axios from 'axios'
import { useEffect, useState } from 'react'
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

    const textAnchorEl = (
        <div className='formWraper'>
            <div className='formWraper__avatar'>
                <img src={BASE_PATH + userInfo.photo} alt='' />
            </div>
            <div className='formWraper__input'>
                <input type='text' placeholder='Bạn muốn có muốn nói gì không ?' />
            </div>
        </div>
    )

    return(
        <section id='detailpage' className='page'>
            <section className='page__news'>
                {news && (
                    <section className='page__news--main'>
                        <h3 className='page__news--title'>{news.title}</h3>
                        <p className='page__news--time'>{(new Date(news.published_at)).toLocaleDateString('en-US', {day: 'string', year: 'numeric', month: 'long', day: 'numeric'})}<span></span></p>
                        <div id='content'></div>
                        <p className='page__news--author'>{news.authors}</p>
                    </section>
                )}
                <section className='news__slider'>
                    <HomeSlider banners={relateds} />
                </section>
                <section className='page__news--comment'>
                    <h3 className='title'>165 bình luận</h3>
                    {textAnchorEl}
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
                                            <div className='item__info--content'>
                                                Các bác cho e hỏi chút ạ!
                                                E có mục đích học lập trình Js... và một số thứ liên quan.. để tự làm web, app... quy mô nhỏ, thì có thể làm việc độc lập được ko?
                                                E tìm hiểu môi trường lập trình cần có team, mỗi người một mảng rồi lắp ghép với nhau... thành 1 sản phẩm. Rồi học xong đa số phải đi thực tập, đi làm công ty. Chưa tìm thấy ai chia sẻ học xong tự làm cho mình luôn...
                                                Còn em thì mục đích học không phải đi làm công ty, mà tự làm cho mình luôn và làm freelancer cho dự án nhỏ của khách hàng, cá nhân/ doanh nghiệp nhỏ.
                                                Cám ơn các bác chia sẻ!
                                            </div>
                                        </div>
                                        <div className='item__foot'>
                                            <button className='item__foot--btn'>Thích</button>
                                            <button className='item__foot--btn'>Trả lời</button>
                                            <span className='item__foot--time'>5 ngày trước</span>
                                        </div>
                                        <div className='show__reply--btn'>Xem 1 câu trả lời <i className='icofont-rounded-down'></i></div>
                                        <div className='comment__item--wrapper'>
                                            <div className='child__comment comment__item'>
                                                <div className='comment__item--photo'>
                                                    <img src={BASE_PATH + userInfo.photo} alt='' />
                                                </div>
                                                <div className='comment__item--content'>
                                                    <div className='item__info'>
                                                        <p className='item__info--name'>{userInfo.name}</p>
                                                        <div className='item__info--content'>
                                                            Các bác cho e hỏi chút ạ!
                                                            E có mục đích học lập trình Js... và một số thứ liên quan.. để tự làm web, app... quy mô nhỏ, thì có thể làm việc độc lập được ko?
                                                            E tìm hiểu môi trường lập trình cần có team, mỗi người một mảng rồi lắp ghép với nhau... thành 1 sản phẩm. Rồi học xong đa số phải đi thực tập, đi làm công ty. Chưa tìm thấy ai chia sẻ học xong tự làm cho mình luôn...
                                                            Còn em thì mục đích học không phải đi làm công ty, mà tự làm cho mình luôn và làm freelancer cho dự án nhỏ của khách hàng, cá nhân/ doanh nghiệp nhỏ.
                                                            Cám ơn các bác chia sẻ!
                                                        </div>
                                                    </div>
                                                    <div className='item__foot'>
                                                        <button className='item__foot--btn'>Thích</button>
                                                        <button className='item__foot--btn'>Trả lời</button>
                                                        <span className='item__foot--time'>5 ngày trước</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='child__comment comment__item'>
                                                <div className='comment__item--photo'>
                                                    <img src={BASE_PATH + userInfo.photo} alt='' />
                                                </div>
                                                <div className='comment__item--content'>
                                                    <div className='item__info'>
                                                        <p className='item__info--name'>{userInfo.name}</p>
                                                        <div className='item__info--content'>
                                                            Các bác cho e hỏi chút ạ!
                                                            E có mục đích học lập trình Js... và một số thứ liên quan.. để tự làm web, app... quy mô nhỏ, thì có thể làm việc độc lập được ko?
                                                            E tìm hiểu môi trường lập trình cần có team, mỗi người một mảng rồi lắp ghép với nhau... thành 1 sản phẩm. Rồi học xong đa số phải đi thực tập, đi làm công ty. Chưa tìm thấy ai chia sẻ học xong tự làm cho mình luôn...
                                                            Còn em thì mục đích học không phải đi làm công ty, mà tự làm cho mình luôn và làm freelancer cho dự án nhỏ của khách hàng, cá nhân/ doanh nghiệp nhỏ.
                                                            Cám ơn các bác chia sẻ!
                                                        </div>
                                                    </div>
                                                    <div className='item__foot'>
                                                        <button className='item__foot--btn'>Thích</button>
                                                        <button className='item__foot--btn'>Trả lời</button>
                                                        <span className='item__foot--time'>5 ngày trước</span>
                                                    </div>
                                                </div>
                                            </div>
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