import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { BASE_PATH, GET_NEWS_BY_CATEGORY_SEARCH_URI } from "../config/api"

const getNewsBy = (page, limit, category, keyword, type, callBackOne, callbackTwo) => {
    axios({
        method: 'get',
        url: GET_NEWS_BY_CATEGORY_SEARCH_URI + `/${category}/${keyword}/${page}/${limit}`
    }).then(res => {
        console.log(res.data)
        if(!res.data.code || res.data.code === 200) {
            callBackOne(res.data.total)
            callbackTwo(res.data.news)
        }
    })
}

const Search = ({...props}) => {
    const {category, keyword} = useParams()
    const [limit, setLimit] = useState(5)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [results, setResults] = useState([])
    const [type, setType] = useState('keyword')

    useEffect(() => {
        getNewsBy(page, limit, category, keyword, type, setTotal, setResults)
    }, [category, keyword, limit, page])

    const handleNextPage = () => {
        if(Math.ceil(total/limit) > page) {
            setPage(page + 1)
        }
    }

    const handlePrevPage = () => {
        if(page > 1) {
            setPage(page - 1)
        }
    }

    return (
        <section id='showpage' className='page'>
            <section className='news__contain'>
                <section className='news__contain--main'>
                     <section className='news__block'>
                         <div className='news__head'>
                             <h3 className='news__head--title'>
                                Có {total ?? 0} kết quả được tìm thấy
                             </h3>
                         </div>
                         <section className='news__grid'>
                             {results && results.map(t => (
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
                         {total > 0 && (
                             <div className='pagination__contain' style={{ justifyContent: 'flex-end' }}>
                                <div className='pagination__contain'>
                                    <p className='pagination__contain--label'>{page * limit - limit} – {page * limit > total ? total : page * limit} of {total}</p>
                                    <span className={'pagination__contain--btn' + (page > 1 ? '' : ' disabled')} onClick={handlePrevPage}><i className='icofont-rounded-left'></i></span>
                                    <span className={'pagination__contain--btn' + (page < Math.ceil(total/limit) ? '' : ' disabled')} onClick={handleNextPage}><i className='icofont-rounded-right'></i></span>
                                </div>
                            </div>
                         )}
                     </section>
                </section> 
            </section>
        </section>
    )
}

export default Search