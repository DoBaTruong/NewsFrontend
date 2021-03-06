import { useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import SunEditor from 'suneditor-react/dist/SunEditor'
import SelectCategory from '../components/SelectCategory'
import { ADMIN_GET_NEWS_URI, BASE_PATH, CHECK_TITLE_EXIST_URI, GET_ALL_CATEGORY_URI, GET_UPDATE_NEWS_URI, UPDATE_NEWS_URI } from '../config/api'
import TokenAxios from '../config/TokenAxios'
import { decodeHtml, getCategories, getChildren, getCookie, previewImage } from '../helpers/helpers'
import photo from '../../images/bg/avatar-default.png'

const hasTitle = async (title, id) => {
    const hasTitle = await TokenAxios({
        method: 'post',
        url: CHECK_TITLE_EXIST_URI,
        data: {
            title: title,
            type: 'update',
            id: id
        },
        headers: {
            'X-Access-Token': getCookie('token'),
            'X-Refresh-Token': getCookie('_rftok'),
        }
    })
    .then(res => res.data.hasTitle)

    return hasTitle
}

const getAllCategories = (recursiveCallback) => {
    TokenAxios({
        method: 'get',
        url: GET_ALL_CATEGORY_URI,
        headers: {
            'X-Access-Token': getCookie('token'),
            'X-Refresh-Token': getCookie('_rftok'),
        }
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            let getCate = getCategories(res.data.categories)
            recursiveCallback(getCate)
        }
    })
}

const getCategory = (callback, slug) => {
    TokenAxios({
        method: 'get',
        url: ADMIN_GET_NEWS_URI + `/${slug}`,
        headers: {
            'X-Access-Token': getCookie('token'),
            'X-Refresh-Token': getCookie('_rftok'),
        }
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            callback(res.data.news)
        }
    })
}

const UpdateNews = ({isAdmin}) => {
    const {slug} = useParams()
    const [categories, setCategories] = useState([])
    const [news, setNews] = useState('')
    const [cookies] = useCookies(['token', '_rftok'])
    const [imageBase64, setImageBase64] = useState('')
    const  buttonList = [
        ['formatBlock'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['font', 'fontSize'],
        ['table'],
        ['fontColor', 'hiliteColor', 'textStyle'],
        ['align', 'list', 'lineHeight', 'horizontalRule'],
        ['video', 'image', 'link'],
        ['codeView', 'preview']
    ]

    const navigate = useNavigate()

    useEffect(() => {
        getAllCategories(setCategories)
        getCategory(setNews, slug)
    }, [])

    const {register, handleSubmit, getValues, setValue, reset, formState: {isDirty, isValid, errors}, } = useForm({
        mode:'all',
        reValidateMode: 'onChange'
    })

    const onSubmit = data => {
        if(isValid && isAdmin) {
            if(imageBase64 !== '') {
                data.photo = imageBase64
            }

            let date = ((new Date(data.published_at)).getTime())/1000
            data.published_at = date

            TokenAxios({
                method: 'put',
                url: UPDATE_NEWS_URI + `/${news.id}`,
                data: data,
                headers: {
                    'X-Access-Token': cookies['token'],
                    'X-Refresh-Token': cookies['_rftok'],
                }
            })
            .then(res => {
                if(!res.data.code || res.data.code === 200) {
                    Swal.fire('Updated', 'B??i vi???t ???? s???a th??nh c??ng.', 'success')
                    navigate('/admin/news/list')
                }
            })
        }
    }

    const handleChangeFile = (e) => {
        previewImage(e.currentTarget, '.page__group--contain', 'page__group--preview', false, (v) => setImageBase64(v))
    }

    const handleChooseFile = (e) => {
        let inputFileElem = getChildren(e.currentTarget, 'page__group--file')
        inputFileElem.click()
    }

    const handleEditorOnChange = (content) => {
        setValue('content', content)
    }

    register('content', {
        required: {
            value: true,
            message: 'N???i d??ng b??i vi???t kh??ng ???????c ????? tr???ng'
        }
    })

    useEffect(() => {
        let fieldForm = [
            'title',
            'abstract',
            'category_id',
            'featured',
            'content',
            'authors',
            'published_at'
        ]
        if(news) {
            fieldForm.forEach(item => {
                setValue(item, news.item)
            })
            setValue('featured', news.featured.toString())
            setValue('title', news.title)
            setValue('authors', news.authors)
            setValue('abstract', news.abstract)
            setValue('category_id', news.category_id)
            setValue('content', news.content)
            imgPreviewElem.current.src = BASE_PATH + news.photo
            const datetime = (new Date(news.published_at)).toISOString().slice(0,16)
            
            document.getElementById('inputDateRef').value = datetime
            setValue('content', news.content)
        }
    }, [news])

    const imgPreviewElem = useRef()

    return (
        <section id='newsAdminPage' className='page'>
            <h3 className='page__title'>????ng b??i</h3>
            <form onSubmit={handleSubmit(onSubmit)} className='page__contain'>
                <section className='page__contain--left'>
                    <div className='page__group'>
                        <span className='page__group--lable'>Ti??u ?????</span>
                        <input 
                            {...register('title', {
                                required: {
                                    value: true,
                                    message: 'H??y nh???p ti??u ????? b??i vi???t'
                                },
                                validate: v => hasTitle(v)
                            })}
                            className='page__group--input' 
                            type='text' 
                        />
                        { errors.title && errors.title.type !== 'validate' && (<p className='error'>{errors.title.message}</p>)}
                        { errors.title && errors.title.type === 'validate' && (<p className='error'>Ti??u ????? b??i vi???t ???? t???n t???i.</p>)}
                    </div>
                    <div className='page__group'>
                        <span className='page__group--lable'>T??m t???t</span>
                        <textarea 
                            className='page__group--textarea'
                            {...register('abstract', {
                                required: {
                                    value: true,
                                    message: 'H??y nh???p t??m t???t b??i vi???t'
                                },
                                maxLength: {
                                    value: 500,
                                    message: 'T??m t???t qu?? d??i, h??y l?????c b???t'
                                }
                            })}
                        ></textarea>
                        { errors.abstract && (<p className='error'>{errors.abstract.message}</p>)}
                    </div>
                    <div className='page__group'>
                        <span className='page__group--lable'>Chuy??n m???c b??i vi???t</span>
                        <select 
                            className='page__group--select'
                            {...register('category_id', {
                                required: {
                                    value: true,
                                    message: 'H??y ch???n chuy??n m???c b??i vi???t.'
                                }
                            })}
                        >
                            <option value=''>-- Ch???n chuy??n m???c b??i vi???t --</option>
                            <SelectCategory categories={categories} />
                        </select>
                        { errors.category_id && (<p className='error'>{errors.category_id.message}</p>)}
                    </div>
                    <div className='page__group'>
                        <span className='page__group--lable'>???nh ?????i di???n</span>
                        <div className='page__group--contain file' onClick={handleChooseFile}>
                            <input 
                                className='page__group--file' 
                                type='file' 
                                {...register('photo', {
                                    onChange: handleChangeFile
                                })}
                            />
                            <img ref={imgPreviewElem} className='page__group--preview' src={photo} alt='' />
                        </div>
                        { errors.photo && (<p className='error'>{errors.photo.message}</p>)}
                    </div>
                    <div className='page__group'>
                        <span className='page__group--lable'>Tin n???i b???t</span>
                        <div className='page__group--contain' style={{ height: '2em' }}>
                            <label>
                                <input 
                                    checked
                                    {...register('featured')}
                                    className='page__group--radio' 
                                    type='radio' 
                                    value='1'
                                />
                                C??
                            </label>
                            <label>
                                <input
                                    {...register('featured')}
                                    className='page__group--radio' 
                                    type='radio' 
                                    value='0'
                                />
                                Kh??ng
                            </label>
                        </div>
                    </div>
                </section>
                <section className='page__contain--right'>
                    <div className='page__group'>
                        <span className='page__group--lable'>N???i dung</span>
                        <SunEditor 
                            setContents={decodeHtml(getValues('content'))}
                            setOptions={{ 
                                height: '15em',
                                buttonList
                            }}
                            onChange={handleEditorOnChange} 
                        />
                        { errors.content && (<p className='error'>{errors.content.message}</p>)}
                    </div>
                    <div className='page__group'>
                        <span className='page__group--lable'>T??c gi???</span>
                        <input 
                            className='page__group--input' 
                            type='text' 
                            {...register('authors', {
                                required: {
                                    value: true,
                                    message: 'T??n t??c gi??? kh??ng n??n ????? tr???ng'
                                }
                            })}
                        />
                        { errors.authors && (<p className='error'>{errors.authors.message}</p>)}
                    </div>
                    <div className='page__group'>
                        <span className='page__group--lable'>Gi??? ????ng</span>
                        <input 
                            id={'inputDateRef'}
                            className='page__group--input' 
                            type='datetime-local' 
                            {...register('published_at', {
                                required: {
                                    value: true,
                                    message: 'H??y ch???n th???i gian ????? publish b??i vi???t'
                                }
                            })}
                        />
                    </div>
                    <button 
                        type='submit' 
                        disabled={!isValid || !isDirty} 
                        className='page__button'
                    >
                        C???p nh???t
                    </button>
                </section>
            </form>
        </section>
    )
}

export default UpdateNews