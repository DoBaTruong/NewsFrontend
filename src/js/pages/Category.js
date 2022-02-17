import { Fragment, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { getChildren, getCookie, getCategories, previewImage, getArrFromObject, decodeHtml } from '../helpers/helpers'
import photo from '../../images/bg/avatar-default.png'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import TokenAxios from '../config/TokenAxios'
import { BASE_PATH, CHECK_NAME_EXIST_URI, CREATE_CATEGORY_URI, DELETE_CATEGORY_URI, GET_ALL_CATEGORY_URI, UPDATE_CATEGORY_URI } from '../config/api'
import SelectCategory from '../components/SelectCategory'

const headColums = [
    '',
    'Tên danh mục',
    'Ảnh đại diện',
    'Danh mục cha',
    ''
]

function getAllCategories(categoriesCallback, recursiveCallback) {
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
            categoriesCallback(getCate)
            recursiveCallback(res.data.categories)
        }
    })
}

const hasName = async (name) => {
    const hasName = await TokenAxios({
        method: 'post',
        url: CHECK_NAME_EXIST_URI,
        data: {
            name: name,
            type: 'create'
        },
        headers: {
            'X-Access-Token': getCookie('token'),
            'X-Refresh-Token': getCookie('_rftok'),
        }
    })
    .then(res => res.data.hasName)

    return hasName
}

const Category = ({isAdmin, ...props}) => {
    const [imageBase64, setImageBase64] = useState('')
    const [cookies] = useCookies(['token', '_rftok'])
    const [idActiveAnchor, setIdActiveAnchor] = useState([])
    const [categories, setCategories] = useState('')
    const [categoryAlls, setCategoryAlls] = useState([])
    const checkAllRef = useRef()

    useEffect(() => {
        getAllCategories(setCategories, setCategoryAlls)
    }, [])

    const handleChooseFile = (e) => {
        let inputFileElem = getChildren(e.currentTarget, 'file__input')
        inputFileElem.click()
    }

    const handleTableChooseFile = (id, e) => {
        if(idActiveAnchor.includes(id)) {
            let inputFileElem = getChildren(e.currentTarget, 'file__input')
            inputFileElem.click()
        }
    }

    const handleChangeFile = (e) => {
        previewImage(e.currentTarget, '.field__group--file', 'file__preview', false, (v) => setImageBase64(v))
    }

    const {register, setValue, getValues, formState: { errors }} = useForm({
        mode: 'all', 
        reValidateMode: 'onChange', 
    })

    const handleAddCategorySubmit = () => {
        if(isAdmin && !errors.name && !errors.photo && !errors.parent_id) {
            if(getValues('name') !== '' && getValues('parent_id') !== '' && imageBase64 !== '') {
                TokenAxios({
                    method: 'post',
                    url: CREATE_CATEGORY_URI,
                    data: {
                        name: getValues('name'),
                        parent_id: getValues('parent_id'),
                        photo: imageBase64
                    },
                    headers: {
                        'X-Access-Token': cookies['token'],
                        'X-Refresh-Token': cookies['_rftok'],
                    }
                })
                .then(res => {
                    if(!res.data.code || res.data.code === 200) {
                        setValue('name', '')
                        setValue('parent_id', 0)
                        getAllCategories(setCategories, setCategoryAlls)
                        Swal.fire('Created', 'Danh mục đã tạo thành công.', 'success')
                    }
                })
            }
        }
    }

    const handleClickNameInputUpdate = (id, parentId, name, photo, slug, e) => {
        let arr = idActiveAnchor;
        let inputElem = document.getElementById('input__group--name' + id)
        let selectElem = document.getElementById('field__group--select' + id)
        let fileElem = document.getElementById('preview' + id)
        fileElem.src = BASE_PATH + photo
        inputElem.disabled = !inputElem.disabled
        selectElem.disabled = !selectElem.disabled
        let editBtnElem = document.getElementById('editBtn' + id)

        if(idActiveAnchor.includes(id)) {
            arr.splice(idActiveAnchor.indexOf(id), 1)
            inputElem.value = name
            selectElem.value = parentId
            editBtnElem.innerText = 'Sửa'
            let saveElem = getChildren(editBtnElem.parentElement, 'save')
            if(saveElem) {
                saveElem.remove()
            }
        } else {
            arr.push(id)
            editBtnElem.innerText = 'Hủy'
            let saveElem = document.createElement('span')
            saveElem.innerText = 'Save'
            saveElem.className = 'btn save'
            saveElem.addEventListener('click', handleUpdateCategory.bind(this, id, name, parentId, photo))
            editBtnElem.parentElement.appendChild(saveElem)
        }
        setIdActiveAnchor(arr)
    }

    const handleUpdateCategory = (id, nameDefault, parentDefault, photoDefault, e) => {
        let name = getValues('name' + id)
        let parent = getValues('parent_id' + id)
        let photo = getValues('photo' + id)

        function setUpdateSuccess(data) {
            if(data.photo) {
                document.getElementById('preview' + id).src = data.photo
            }

            let parentNew = Boolean(data.parent_id) ? data.parent_id : parentDefault
            let nameNew = Boolean(data.name) ? data.name : nameDefault
            let photoNew = Boolean(data.photo) ? data.photo : photoDefault

            handleClickNameInputUpdate.call(this, id, parentNew, nameNew, photoNew)
            getAllCategories(setCategories, setCategoryAlls)

            Swal.fire('Updated', 'Danh mục đã sửa thành công.', 'success')
        }

        if(isAdmin) {
            TokenAxios({
                method: 'post',
                url: CHECK_NAME_EXIST_URI,
                data: {
                    name: name ?? nameDefault,
                    type: 'update',
                    id: id
                },
                headers: {
                    'X-Access-Token': cookies['token'],
                    'X-Refresh-Token': cookies['_rftok'],
                }
            })
            .then(res => {
                if(res.data.code === 200 || !(res.data.code)) {
                    return res.data.hasName
                }
            })
            .then(res => {
                if(res) {
                    let fileElem = document.getElementById('imgCategory' + id)
                    if(fileElem.files && fileElem.files[0]) {
                        let reader = new FileReader()
                        reader.onload = function () {
                            let img = reader.result
                            TokenAxios({
                                method: 'put',
                                url: UPDATE_CATEGORY_URI + '/' + id,
                                data: {
                                    name: name ?? nameDefault,
                                    parent_id: parent ?? parentDefault,
                                    photo: img
                                },
                                headers: {
                                    'X-Access-Token': cookies['token'],
                                    'X-Refresh-Token': cookies['_rftok'],
                                }
                            })
                            .then(res => {
                                setUpdateSuccess(res.data.result)
                            })
                        }
                        reader.readAsDataURL(fileElem.files[0])
                    } else {
                        if(name || parent) {
                            TokenAxios({
                                method: 'put',
                                url: UPDATE_CATEGORY_URI + '/' + id,
                                data: {
                                    name: name ?? nameDefault,
                                    parent_id: Boolean(parent) ? parent : parentDefault,
                                    photo: null
                                },
                                headers: {
                                    'X-Access-Token': cookies['token'],
                                    'X-Refresh-Token': cookies['_rftok'],
                                }
                            })
                            .then(res => {
                                if(res.data.code === 200 || !res.data.code) {
                                    setUpdateSuccess(res.data.result)
                                }
                            })
                        }
                    }
                }
            })
        }
    }

    const handleClickRemove = () => {
        let idArr = getValues('id') 
        let dataId = []
        if(idArr.length && isAdmin) {
            let arrResult = []
            idArr.forEach(id => {
                let idItemArr = getArrFromObject(categoryAlls, id)
                idItemArr.push(parseInt(id))
                arrResult.push(idItemArr)
            })
            dataId = arrResult.flat(Infinity).filter((item, idx) => arrResult.flat(Infinity).indexOf(item) === idx)
        } 

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
                url: DELETE_CATEGORY_URI,
                data: {
                    id: dataId
                },
                headers: {
                    'X-Access-Token': cookies['token'],
                    'X-Refresh-Token': cookies['_rftok'],
                }
              })
              .then((res) => {
                if(!res.data.code || res.data.code === 200) {
                    getAllCategories(setCategories, setCategoryAlls)
                    checkAllRef.current.click()
                    Swal.fire('Deleted', 'Bạn đã xóa thành công', 'success')
                }
              })
          })
    }

    const handleCheckAll = (className, e) => {
        let trElem = document.querySelector('#categories__table tbody').children
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

    return (
        <section id='catepage' className='page'>
            <h3 className='page__title'>Quản lý danh mục</h3>
            <section className='page__contain'>
                <section className='page__contain--left'>
                    <div className='field__group'>
                        <span className='field__group---label'>Tên danh mục</span>
                        <input 
                            className='field__group--input' 
                            style={{ padding: '0 1em' }} 
                            type='text' 
                            {...register('name', {
                                required: {
                                    value: true,
                                    message: 'Hãy nhập tên danh mục.'
                                },
                                validate: v => hasName(v)
                            })}
                        />
                        { errors.name && errors.name.type !== 'validate' && (<p className='error'>{errors.name.message}</p>)}
                        { errors.name && errors.name.type === 'validate' && (<p className='error'>Tên danh mục đã tồn tại.</p>)}
                    </div>
                    <div className='field__group'>
                        <span className='field__group--label'>Ảnh đại diện</span>
                        <div className='field__group--file' onClick={handleChooseFile}>
                            <input 
                                className='file__input' 
                                type='file' 
                                {...register('photo', {
                                    onChange: handleChangeFile,
                                    required: {
                                        value: true,
                                        message: 'Vui lòng chọn ảnh làm đại diện.'
                                    },
                                    validate: {
                                        checkExtension: v => ['jpg', 'jpeg', 'png', 'gif'].includes(v[0].type.trim().split('/')[1].toLowerCase()) || 'Không đúng định dạng.',
                                        checkSize: v => v[0].size < 102400 || 'Kích thước ảnh quá lớn.'
                                    }
                                })}
                            />
                            <img className='file__preview' alt='' src={photo} />
                        </div>
                        { errors.photo && (<p className='error'>{errors.photo.message}</p>)}
                    </div>
                    <div className='field__group'>
                        <span className='field__group--label'>Danh mục cha</span>
                        <select 
                            className='field__group--select'
                            defaultValue={0}
                            {...register('parent_id', {
                                required: {
                                    value: true,
                                    message: 'Vui lòng chọn thư mục cha.'
                                }
                            })}
                        >
                            <option value={0}>Danh mục cha</option> 
                            <SelectCategory categories={categories} />
                        </select>
                        { errors.parent_id && (<p className='error'>{errors.parent_id.message}</p>)}
                    </div>
                    <div className='btn' style={{ marginTop: '1.5em', color: '#86c232', borderColor: '#86c232' }} onClick={handleAddCategorySubmit}>Thêm danh mục</div>
                </section>
                <section className='page__contain--right'>
                    <p className='table__group'><span className='table__group--btn' onClick={handleClickRemove}><i className='icofont-bin'></i>Xóa thư mục</span></p>
                    <table className='table' id='categories__table'> 
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
                            {categoryAlls && categoryAlls.map(item => (
                                <tr key={item.id} className='table__row'>
                                    <td className='table__column table__column--checkbox'>
                                        <input 
                                            className='table__input--checkbox'
                                            type='checkbox' 
                                            value={item.id} 
                                            {...register('id[]')}
                                        />
                                    </td>
                                    <td className='table__column input__group'>
                                        <input 
                                            className='input__group--name'
                                            id={'input__group--name' + item.id}
                                            disabled={!idActiveAnchor.includes(item.id)} 
                                            type='text'
                                            defaultValue={decodeHtml(item.name)}
                                            {...register('name' + item.id)}
                                        />
                                    </td>
                                    <td style={{ display: 'flex', justifyContent: 'center' }} className='table__column'>
                                        <div 
                                            className={'field__group--file'}
                                            onClick={handleTableChooseFile.bind(this, item.id)}
                                        >
                                            <input 
                                                className='file__input' 
                                                type='file' 
                                                id={'imgCategory' + item.id}
                                                {...register('photo' + item.id, {
                                                    onChange: handleChangeFile
                                                })}
                                            />
                                            <img id={'preview' + item.id} className='file__preview' alt='' src={ BASE_PATH + item.photo} />
                                        </div>
                                    </td>
                                    <td>
                                        <select 
                                            style={{ 
                                                color: '#fff',
                                                backgroundColor: 'transparent'
                                             }}
                                            id={'field__group--select' + item.id}
                                            disabled={!idActiveAnchor.includes(item.id)} 
                                            className='field__group--select'
                                            defaultValue={item.parent_id}
                                            {...register('parent_id' + item.id, {
                                                required: {
                                                    value: true,
                                                    message: 'Vui lòng chọn thư mục cha.'
                                                }
                                            })}
                                        >
                                            <option value={0}>Danh mục cha</option> 
                                            <SelectCategory categories={categories} />
                                        </select>
                                    </td>
                                    <td className='table__action table__column'>
                                        <span id={'editBtn' + item.id} className='btn' onClick={handleClickNameInputUpdate.bind(this, item.id, item.parent_id, item.name, item.photo, item.slug)}>Sửa</span>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (<tr><td colSpan={5}>Không có dữ liệu</td></tr>)}
                        </tbody>
                    </table>
                </section>
            </section>
        </section>
    )
}

export default Category