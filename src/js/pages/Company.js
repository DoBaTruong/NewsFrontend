import { useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { InputLabel, MenuItem, Select } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { getChildren, getCookie, previewImage, decodeHtml } from '../helpers/helpers'
import photo from '../../images/bg/avatar-default.png'
import TokenAxios from '../config/TokenAxios'
import {  GET_COMPANY_URI, CHECK_COMPANY_EXIST_URI, CREATE_COMPANY_URI, DELETE_COMPANY_URI, UPDATE_COMPANY_URI, BASE_PATH } from '../config/api'

const headColums = [
    '',
    'Tên công ty',
    'Logo',
    ''
]

function getCompanies(totalCallback, companiesCallback, page, limit) {
    TokenAxios({
        method: 'get',
        url: GET_COMPANY_URI + `${page}/${limit}`,
        headers: {
            'X-Access-Token': getCookie('token'),
            'X-Refresh-Token': getCookie('_rftok'),
        }
    })
    .then(res => {
        if(res.data.code === 200 || !res.data.code) {
            companiesCallback(res.data.companies)
            totalCallback(res.data.total)
        }
    })
}

const hasName = async (name, type, id = 0) => {
    const hasName = await TokenAxios({
        method: 'post',
        url: CHECK_COMPANY_EXIST_URI,
        data: {
            name: name,
            type: type,
            id: id
        },
        headers: {
            'X-Access-Token': getCookie('token'),
            'X-Refresh-Token': getCookie('_rftok'),
        }
    })
    .then(res => res.data.hasName)

    return hasName
}

const Company = ({isAdmin, ...props}) => {
    const [imageBase64, setImageBase64] = useState('')
    const [cookies] = useCookies(['token', '_rftok'])
    const [companies, setCompanies] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [crudType, setCrudType] = useState(false)
    const [idActiveAnchor, setIdActiveAnchor] = useState(0)
    const navigate = useNavigate()
    const checkAllRef = useRef()

    useEffect(() => {
        getCompanies(setTotalPage, setCompanies, page, limit)
    }, [])

    const handleChooseFile = (e) => {
        let inputFileElem = getChildren(e.currentTarget, 'file__input')
        inputFileElem.click()
    }

    const handleChangeFile = (e) => {
        previewImage(e.currentTarget, '.field__group--file', 'file__preview', false, (v) => setImageBase64(v))
    }

    const {register, setValue, getValues, formState: { isValid, errors }} = useForm({
        mode: 'all', 
        reValidateMode: 'onChange',
        shouldFocusError: false,
    })

    const handleCompanySubmit = () => {
        function setWhenSuccess() {
            setValue('name', '')
            setValue('phone', '')
            setValue('contact_name', '')
            setValue('position', '')
            setValue('descript', '')
            setValue('address', '')
            setImageBase64('')
            setCrudType(false)
            setIdActiveAnchor(0)
            getCompanies(setTotalPage, setCompanies, page, limit)
            Swal.fire(crudType ? 'Updated' : 'Created', `Công ty đã ${crudType ? 'sửa' : 'thêm'} thành công.`, 'success')
        }
        if(isAdmin) {
            if(crudType) {
                if(getValues('name') !== '' || getValues('address') !== '' || getValues('descript') !== '' || imageBase64 !== '' || getValues('contact_name') !== '' || getValues('position') !== '' || getValues('phone') !== '') {
                    TokenAxios({
                        method: 'put',
                        url: UPDATE_COMPANY_URI + `/${idActiveAnchor}`, 
                        data: {
                            name: getValues('name'),
                            descript: getValues('descript'),
                            address: getValues('address'),
                            contact: getValues('contact_name') + '_-_-_' + getValues('position') + '_-_-_' + getValues('phone'),
                            logo: imageBase64
                        },
                        headers: {
                            'X-Access-Token': cookies['token'],
                            'X-Refresh-Token': cookies['_rftok'],
                        }
                    })
                    .then(res => {
                        console.log(res)

                        if(!res.data.code || res.data.code === 200) {
                            setWhenSuccess()
                        }
                    })
                }
            } else {
                if(getValues('name') !== '' && getValues('address') !== '' && getValues('descript') !== '' && imageBase64 !== '' && getValues('contact_name') !== '' && getValues('position') !== '' && getValues('phone') !== '') {
                    if(isValid) {
                        TokenAxios({
                            method: 'post',
                            url: CREATE_COMPANY_URI,
                            data: {
                                name: getValues('name'),
                                descript: getValues('descript'),
                                address: getValues('address'),
                                contact: getValues('contact_name') + '_-_-_' + getValues('position') + '_-_-_' + getValues('phone'),
                                logo: imageBase64
                            },
                            headers: {
                                'X-Access-Token': cookies['token'],
                                'X-Refresh-Token': cookies['_rftok'],
                            }
                        })
                        .then(res => {
                            if(!res.data.code || res.data.code === 200) {
                                setWhenSuccess()
                            }
                        })
                    }
                }
            }
        }
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
                    url: DELETE_COMPANY_URI,
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
                        getCompanies(setTotalPage, setCompanies, page, limit)
                        checkAllRef.current.click()
                        Swal.fire('Deleted', 'Bạn đã xóa thành công', 'success')
                    }
                })
            })
        }
    }

    const handleNextPage = () => {
        if(Math.ceil(totalPage/limit) > page) {
            setPage(page + 1)
            getCompanies(setTotalPage, setCompanies, page + 1, limit)
        }
    }

    const handlePrevPage = () => {
        if(page > 1) {
            setPage(page - 1)
            getCompanies(setTotalPage, setCompanies, page - 1, limit)
        }
    }

    const handleCheckAll = (className, e) => {
        let trElem = document.querySelector('#companies__table tbody').children
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
        getCompanies(setTotalPage, setCompanies, page, e.target.value)
    }

    const handleSetValueUpdate = (id, slug, e) => {
        setIdActiveAnchor(id)
        let imgElem = document.getElementById('logoPreview')
        if(id === idActiveAnchor) {
            setIdActiveAnchor(0)
            setValue('name', '')
            setValue('address', '')
            setValue('descript', '')
            setValue('phone', '')
            setValue('contact_name', '')
            setValue('position', '')
            imgElem.src = BASE_PATH + photo
            setCrudType(false)
            navigate(`/admin/contacts`)
        } else {
            navigate(`/admin/contacts/${slug}`)
            companies.forEach(item => {
                if(item.id === id) {
                    setValue('name', item.name)
                    setValue('address', item.address)
                    setValue('descript', item.descript)
                    let contact = item.contact.split('_-_-_')
                    setValue('phone', contact[2])
                    setValue('contact_name', contact[0])
                    setValue('position', contact[1])
                    imgElem.src = BASE_PATH + item.logo
                }
            })
            setCrudType(true)
        }
    }

    return (
        <section id='contactpage' className='page'>
            <h3 className='page__title'>Quản lý công ty</h3>
            <section className='page__contain'>
                <section className='page__contain--left'>
                    <div className='field__group'>
                        <span className='field__group---label'>Tên công ty</span>
                        <input 
                            className='field__group--input' 
                            style={{ padding: '0 1em' }} 
                            type='text' 
                            {...register('name', {
                                required: {
                                    value: true,
                                    message: 'Hãy nhập tên công ty.'
                                },
                                validate: v => hasName(v, crudType, idActiveAnchor)
                            })}
                        />
                        { errors.name && errors.name.type !== 'validate' && (<p className='error'>{errors.name.message}</p>)}
                        { errors.name && errors.name.type === 'validate' && (<p className='error'>Tên công ty đã tồn tại.</p>)}
                    </div>
                    <div className='field__group'>
                        <span className='field__group--label'>Logo</span>
                        <div className='field__group--file' onClick={handleChooseFile}>
                            <input 
                                className='file__input' 
                                type='file' 
                                {...register('logo', {
                                    onChange: handleChangeFile,
                                    required: {
                                        value: true,
                                        message: 'Hãy chọn logo công ty.'
                                    },
                                    validate: {
                                        checkExtension: v => ['jpg', 'jpeg', 'png', 'gif'].includes(v[0].type.trim().split('/')[1].toLowerCase()) || 'Không đúng định dạng.',
                                        checkSize: v => v[0].size < 102400 || 'Kích thước ảnh quá lớn.'
                                    }
                                })}
                            />
                            <img id='logoPreview' className='file__preview' alt='' src={photo} />
                        </div>
                        { errors.photo && (<p className='error'>{errors.photo.message}</p>)}
                    </div>
                    <div className='field__group'>
                        <span className='field__group--label'>Giới thiệu</span>
                        <textarea 
                            className='field__group--textarea'
                            {...register('descript', {
                                required: {
                                    value: true,
                                    message: 'Vui lòng điền thông tin công ty.'
                                },
                                maxLength: {
                                    value: 500,
                                    message: 'Thông tin giới thiệu quá dài, hãy rút ngắn.'
                                }
                            })}
                        >
                        </textarea>
                        { errors.descript && (<p className='error'>{errors.descript.message}</p>)}
                    </div>
                    <div className='field__group'>
                        <span className='field__group---label'>Địa chỉ</span>
                        <input 
                            className='field__group--input' 
                            style={{ padding: '0 1em' }} 
                            type='text' 
                            {...register('address', {
                                required: {
                                    value: true,
                                    message: 'Địa chỉ công ty không được để trống.'
                                }
                            })}
                        />
                        { errors.address && (<p className='error'>{errors.address.message}</p>)}
                    </div>
                    <div className='field__group'>
                            <span className='field__group---label'>Tên</span>
                            <input 
                                className='field__group--input' 
                                style={{ padding: '0 1em' }} 
                                type='text' 
                                {...register('contact_name', {
                                    required: {
                                        value: true,
                                        message: 'Nhập tên người có thể liên lạc.'
                                    }
                                })}
                            />
                            { errors.contact_name && (<p className='error'>{errors.contact_name.message}</p>)}
                        </div>
                    <div className='field__group--container' style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1em' }}>
                        <div className='field__group' style={{ flex: '0 0 48%' }}>
                                <span className='field__group---label'>Số điện thoại</span>
                                <input 
                                    className='field__group--input' 
                                    style={{ padding: '0 1em' }} 
                                    type='text' 
                                    {...register('phone', {
                                        required: {
                                            value: true,
                                            message: 'Hãy nhập số điện thoại.'
                                        },
                                        pattern: {
                                            value: /^(((\+84)|[0])((3[2-9]|5[689]|7[06-9]|8[1-689]|9[1-46-9])))([0-9])(([0-9]{3}))(([0-9]{3}))$/,
                                            message: 'Số điện thoại không đúng.'
                                        }
                                    })}
                                />
                                { errors.phone && (<p className='error'>{errors.phone.message}</p>)}
                        </div>
                        <div className='field__group' style={{ flex: '0 0 48%' }}>
                            <span className='field__group---label'>Chức vụ</span>
                            <input 
                                className='field__group--input' 
                                style={{ padding: '0 1em' }} 
                                type='text' 
                                {...register('position', {
                                    required: {
                                        value: true,
                                        message: 'Vui lòng nhập vị trí công tác.'
                                    }
                                })}
                            />
                            { errors.position && (<p className='error'>{errors.position.message}</p>)}
                        </div>
                    </div>
                    <div className='btn' style={{ marginTop: '1.5em', color: '#86c232', borderColor: '#86c232' }} onClick={handleCompanySubmit}>{crudType ? 'Sửa' : 'Thêm'} công ty</div>
                </section>
                <section className='page__contain--right'>
                    <p className='table__group'><span className='table__group--btn' onClick={handleClickRemove}><i className='icofont-bin'></i>Xóa công ty</span></p>
                    <table className='table' id='companies__table'> 
                        <thead className='table__thead'>
                            <tr className='table__row'>
                                {headColums.map((column, idx) => (
                                    <th className='' key={idx}>
                                        {idx === 0 && (<input ref={checkAllRef} onClick={handleCheckAll.bind(this, 'table__input--checkbox')} type='checkbox' />)}
                                        <span className='table__label'>{column}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='table__tbody'>
                            {companies && companies.map(item => (
                                <tr key={item.id} className='table__row'>
                                    <td className='table__column table__column--checkbox'>
                                        <input 
                                            className='table__input--checkbox'
                                            type='checkbox' 
                                            value={item.id} 
                                            {...register('id[]')}
                                        />
                                    </td>
                                    <td className='table__column'>
                                        <p className='table__column--name'>{item.name}</p>
                                        <span className='table__column--address'>{item.address}</span>
                                    </td>
                                    <td className='table__column'>
                                        <img className='companies__img' alt='' src={BASE_PATH + item.logo} />
                                    </td>
                                    <td className='table__action'>
                                        <span onClick={handleSetValueUpdate.bind(this, item.id, item.slug)} className='table__action--btn'>{idActiveAnchor === item.id ? 'Hủy' : 'Sửa'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='table__footer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className='pagination' style={{ display: 'flex', alignItems: 'center' }}>
                            <InputLabel sx={{ marginRight: '.5em' }} id='record__show'>Hiển thị</InputLabel>
                            <Select
                                labelId='record__show'
                                value={limit}
                                onChange={handleLimitChange}
                                sx={{ 
                                    borderColor: 'transparent',
                                    border: 'none',
                                    height: '2em'
                                    }}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                            </Select>
                        </div>
                        <div className='pagination__contain'>
                            <div className='pagination__contain'>
                                <p className='pagination__contain--label'>{page * limit - limit} – {page * limit > totalPage ? totalPage : page * limit} of {totalPage}</p>
                                <span className={'pagination__contain--btn' + (page > 1 ? '' : ' disabled')} onClick={handlePrevPage}><i className='icofont-rounded-left'></i></span>
                                <span className={'pagination__contain--btn' + (page < Math.ceil(totalPage/limit) ? '' : ' disabled')} onClick={handleNextPage}><i className='icofont-rounded-right'></i></span>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </section>
    )
}

export default Company