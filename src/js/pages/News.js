import { InputLabel, MenuItem, Select } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { set, useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'
import { DELETE_NEWS_URI, GET_NEWS_URI } from '../config/api'
import TokenAxios from '../config/TokenAxios'
import { decodeHtml, getChildren, getCookie } from '../helpers/helpers'

const headColums = [
    '',
    'Tiêu đề',
    'Tóm tắt',
    'Tác giả',
    ''
]

function getNewsByPage(newsCallback, setTotalCallback, page, limit) {
    TokenAxios({
        method: 'get',
        url: GET_NEWS_URI + `/${page}/${limit}`,
        headers: {
            'X-Access-Token': getCookie('token'),
            'X-Refresh-Token': getCookie('_rftok'),
        }
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            newsCallback(res.data.news)
            setTotalCallback(res.data.total)
        }
    })
}

const News = ({isAdmin, ...props}) => {
    const [news, setNews] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(10)
    const checkAllRef = useRef()

    const {register, setValue, getValues} = useForm()

    const [cookies] = useCookies(['token', '_rftok'])

    useEffect(() => {
        getNewsByPage(setNews,setTotal, page, limit)
    }, [])
    
    const handleNextPage = () => {
        if(Math.ceil(total/limit) > page) {
            setPage(page + 1)
            getNewsByPage(setNews, setTotal, page + 1, limit)
        }
    }

    const handlePrevPage = () => {
        if(page > 1) {
            setPage(page - 1)
            getNewsByPage(setNews, setTotal, page - 1, limit)
        }
    }

    const handleCheckAll = (className, e) => {
        let trElem = document.querySelector('#news__table tbody').children
        if(trElem) {
            Object.values(trElem).forEach((elem, idx) => {
                let inputElem = getChildren(getChildren(elem, 'table__column--checkbox'), className)
                if(inputElem ) {
                    inputElem.checked = !e.target.checked
                    inputElem.click()
                }
            })
        }
    }

    const handleLimitChange = (e) => {
        setLimit(e.target.value)
        getNewsByPage(setNews, setTotal, page, e.target.value)
    }

    const handleClickRemove = () => {
        if(isAdmin && getValues('id')) {
            Swal.fire({
                title: 'Bạn chắc chắn?',
                text: "Bạn sẽ không thể lấy lại được !",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Chắc chắn, xóa nó!'
              })
              .then(() => {
                  TokenAxios({
                    method: 'delete',
                    url: DELETE_NEWS_URI,
                    data: {
                        id: getValues('id') 
                    },
                    headers: {
                        'X-Access-Token': cookies['token'],
                        'X-Refresh-Token': cookies['_rftok'],
                    }
                  })
                  .then((res) => {
                    if(!res.data.code || res.data.code === 200) {
                        getNewsByPage(setNews, setTotal, page, limit)
                        setValue('id', [])
                        Swal.fire('Deleted', 'Bạn đã xóa thành công', 'success')
                    }
                })
            })
        }
    }

    return (
        <section id='listNewsAdminPage' className='page'>
            <p className='table__group'>
                <span className='table__group--btn' onClick={handleClickRemove}>
                    <i className='icofont-bin'></i>Xóa bài đăng
                </span>
            </p>
            <table className='table' id='news__table'> 
                <thead className='table__thead'>
                    <tr className='table__row'>
                        {headColums.map((column, idx) => (
                            <th className='' key={idx}>
                                {idx === 0 && (<input ref={checkAllRef} style={{ width: '1.2em', height: '1.2em' }} onClick={handleCheckAll.bind(this, 'table__input--checkbox')} type='checkbox' />)}
                                <span className='table__label'>{column}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className='table__tbody'>
                    {news && news.map(item => (
                        <tr key={item.id} className='table__row'>
                            <td className='table__column table__column--checkbox'>
                                <input 
                                    className='table__input--checkbox'
                                    type='checkbox' 
                                    {...register('id[]')}
                                    value={item.id} 
                                />
                            </td>
                            <td className='table__column'>{item.title}</td>
                            <td className='table__column'>{decodeHtml(item.abstract)}</td>
                            <td className='table__column'>{item.authors}</td>
                            <td className='table__column table__action'>
                                <NavLink to={`/admin/news/update/${item.slug}`} className='table__action'>Sửa</NavLink>
                            </td>
                        </tr>
                    ))}
                    {news.length === 0 && (<tr><td colSpan={5}>Không có dữ liệu</td></tr>)}
                </tbody>
            </table>
            <div className='table__footer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className='pagination' style={{ display: 'flex', alignItems: 'center' }}>
                    <InputLabel sx={{ marginRight: '.5em' }} id='post__show'>Hiển thị</InputLabel>
                    <Select
                        labelId='post__show'
                        value={limit}
                        onChange={handleLimitChange}
                        sx={{ 
                            borderColor: 'transparent',
                            border: 'none',
                            height: '2em'
                            }}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                    </Select>
                </div>
                <div className='pagination__contain'>
                    <div className='pagination__contain'>
                        <p className='pagination__contain--label'>{page * limit - limit} – {page * limit > total ? total : page * limit} of {total}</p>
                        <span className={'pagination__contain--btn' + (page > 1 ? '' : ' disabled')} onClick={handlePrevPage}><i className='icofont-rounded-left'></i></span>
                        <span className={'pagination__contain--btn' + (page < Math.ceil(total/limit) ? '' : ' disabled')} onClick={handleNextPage}><i className='icofont-rounded-right'></i></span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default News