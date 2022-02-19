import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import avatar from '../../images/bg/avatar-default.png'
import camera from '../../images/bg/camera-edit.png'
import { BASE_PATH, RESET_PASSWORD_URI, UPDATE_INFO_USER_URI } from '../config/api'
import TokenAxios from '../config/TokenAxios'
import { getChildren, previewImage } from '../helpers/helpers'

const Setting = ({userInfo, appCallback}) => {
    const [inputNameAnchorEl, setInputNameAnchorEl] = useState(null)
    const [inputAvatarAnchorEl, setInputAvatarAnchorEl] = useState(null)
    const [inputPhoneAnchorEl, setInputPhoneAnchorEl] = useState(null)
    const [inputAddressAnchorEl, setInputAddressAnchorEl] = useState(null)
    const [inputPasswordAnchorEl, setInputPasswordAnchorEl] = useState(null)
    const [imageBase64, setImageBase64] = useState('')
    const SaveAnchorEl =  ({onClick}) => <button type='button' onClick={onClick} className='form__btn--item btn__save'>Lưu</button>
    const [cookies, setCookie] = useCookies(['token', '_rftok'])

    const handleInputNameAnchorEl = (e) => {
        setInputNameAnchorEl(!inputNameAnchorEl)
    }

    const handleInputAvatarAnchorEl = () => {
        setInputAvatarAnchorEl(!inputAvatarAnchorEl)
    }

    const handleInputPhoneAnchorEl = () => {
        setInputPhoneAnchorEl(!inputPhoneAnchorEl)
    }

    const handleInputAddressAnchorEl = () => {
        setInputAddressAnchorEl(!inputAddressAnchorEl)
    }

    const handleClickAvatar = (e) => {
        let fileElem = getChildren(e.currentTarget, 'form__file--input')
        if(Boolean(fileElem)) {
            fileElem.click()
        }
    }

    const handleAvatarOnChange = (e) => {
        previewImage(e.target, '.form__file', 'form__file--img', false, (v) => setImageBase64(v))
    }

    const handleChangePassword = () => {
        setInputPasswordAnchorEl(!inputPasswordAnchorEl)
    }

    const {register, setError, getValues, formState: { errors }} = useForm({
        mode: 'onChange', 
        reValidateMode: 'onChange', 
        defaultValues: {
            'name': userInfo.name,
            'phone': userInfo.phone ?? '',
            'address': userInfo.address ?? ''
        }})

    const handleSubmitChange = (nameField, callback) => {
        if(!errors.nameField) {
            if(getValues(nameField).length) {
                let data = {
                    value: nameField === 'photo' ? imageBase64 : getValues(nameField),
                    field: nameField
                }

                if(nameField === 'photo') {
                    data.filename = userInfo.name
                }

                TokenAxios({
                    method: 'put',
                    url: `${UPDATE_INFO_USER_URI}/${userInfo.id}`,
                    data: data,
                    headers: {
                        'X-Access-Token': cookies['token'],
                        'X-Refresh-Token': cookies['_rftok'],
                    }
                })
                .then(res => {
                    console.log(res.data)
                    if(!res.data.code || res.data.code === 200) {
                        let rftime = new Date(res.data.result.expireIn)
                        callback()
                        setCookie('_rftok', res.data.result.rftoken, {expires: new Date(rftime.getTime() + 10*86400000), path: '/'})
                        setCookie('token', res.data.result.token, {expires: rftime, path: '/'})
                        appCallback(res.data.result.token)
                    }
                })
            }
        }
    }

    const handleSubmitChangePassword = () => {
        if(!errors.oldPassword && !errors.newPassword && !errors.reNewPassword) {
            if (getValues('oldPassword') && getValues('newPassword') && getValues('reNewPassword')) {
                TokenAxios({
                    method: 'put',
                    url: RESET_PASSWORD_URI,
                    data: {
                        password: getValues('oldPassword'),
                        newpassword: getValues('newPassword'),
                        id: userInfo.id
                    }
                })
                .then(res => {
                    console.log(res)
                    if(res.data.code === 200) {
                        Swal.fire('Success !', 'Bạn đã đổi mật khẩu thành công !', "success")
                        setInputPasswordAnchorEl(null)
                    } else {
                    }
                })
            }            
        }
    }

    return (
        <section id='settingspage' className='page'>
            <h2 className='page__title'>Cài đặt</h2>
            <section className='row'>
                <div className='page__form'>
                    <h4 className='page__form--title'>Thông tin cá nhân</h4>
                    <div className='page__form--group'>
                        <div className='form__info form__value'>
                            <label className='form__label'> Họ Tên </label>
                            <input 
                                disabled={!inputNameAnchorEl} 
                                type='text' 
                                className='form__input' 
                                {...register('name', {
                                    required: {
                                        value: true,
                                        message: 'Tên bạn đang để trống.'
                                    }
                                })}
                            />
                            <span className='form__note'>
                                Tên của bạn xuất hiện trên trang cá nhân và bên cạnh các bình luận của bạn.
                            </span>
                            {inputNameAnchorEl && errors.name && (<p className='error'>{errors.name.message}</p>)}
                        </div>
                        <div className='form__btn'>
                            {
                                inputNameAnchorEl && (<SaveAnchorEl onClick={handleSubmitChange.bind(this, 'name', setInputNameAnchorEl)} />)
                            }
                            <button onClick={handleInputNameAnchorEl} type='button' className='form__btn--item btn__edit'>{inputNameAnchorEl ? 'Hủy' : 'Chỉnh sửa'}</button>
                        </div>
                    </div>
                    <div className='page__form--group'>
                        <div className='form__info'>
                            <label className='form__label'> Avatar </label>
                            <span className='form__note'>
                                Nên là ảnh vuông, chấp nhận các tệp: JPG, PNG hoặc GIF.
                            </span>
                            {inputAvatarAnchorEl && errors.avatar && (<p className='error'>{errors.avatar.message}</p>)}
                        </div>
                        <div className='form__file form__value' onClick={inputAvatarAnchorEl ? handleClickAvatar : () => false}>
                            <input 
                                className='form__file--input form__input' 
                                type='file' 
                                {...register('photo', {
                                    onChange: handleAvatarOnChange,
                                    required: {
                                        value: true,
                                        message: 'Vui lòng chọn ảnh làm đại diện.'
                                    },
                                    validate: {
                                        checkExtension: v => ['jpg', 'jpeg', 'png', 'gif'].includes(v[0].type.trim().split('/')[1].toLowerCase()) || 'Không đúng định dạng.',
                                        checkSize: v => v[0].size < 10240 || 'Kích thước ảnh quá lớn.'
                                    }
                                })}
                            />
                            {
                                inputAvatarAnchorEl && (<img className='form__file--overlay' src={camera} alt='' />)
                            }
                            <img className='form__file--img' alt='' src={userInfo.photo ? BASE_PATH + userInfo.photo : avatar} />
                        </div>
                        <div className='form__btn'>
                            {
                                inputAvatarAnchorEl && (<SaveAnchorEl onClick={handleSubmitChange.bind(this, 'photo', setInputAvatarAnchorEl)} />)
                            }
                            <button onClick={handleInputAvatarAnchorEl} type='button' className='form__btn--item btn__edit'>{inputAvatarAnchorEl ? 'Hủy' : 'Chỉnh sửa'}</button>
                        </div>
                    </div>
                    <div className='page__form--group'>
                        <div className='form__info form__value'>
                            <label className='form__label'> Số điện thoại </label>
                            <input 
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
                                disabled={!inputPhoneAnchorEl} 
                                type='text' 
                                placeholder='Thêm số điện thoại' 
                                className='form__input' 
                            />
                            <span className='form__note'>
                                Số điện thoại nên để dạng: 0988 041 615 hoặc +84 988 041 615
                            </span>
                            {inputPhoneAnchorEl && errors.phone && (<p className='error'>{errors.phone.message}</p>)}
                        </div>
                        <div className='form__btn'>
                            {
                                inputPhoneAnchorEl && (<SaveAnchorEl onClick={handleSubmitChange.bind(this, 'phone', setInputPhoneAnchorEl)} />)
                            }
                            <button onClick={handleInputPhoneAnchorEl} type='button' className='form__btn--item btn__edit'>{inputPhoneAnchorEl ? 'Hủy' : 'Chỉnh sửa'}</button>
                        </div>
                    </div>
                    <div className='page__form--group'>
                        <div className='form__info form__value'>
                            <label className='form__label'> Địa chỉ </label>
                            <input 
                                disabled={!inputAddressAnchorEl} 
                                type='text' 
                                placeholder='Thêm địa chỉ' 
                                className='form__input' 
                                {...register('address', {
                                    required: {
                                        value: true,
                                        message: 'Vui lòng nhập địa chỉ của bạn.'
                                    }
                                })}
                            />
                            <span className='form__note'>
                                Bạn có thể thêm nếu bạn muốn.
                            </span>
                            {inputAddressAnchorEl && errors.address && (<p className='error'>{errors.address.message}</p>)}
                        </div>
                        <div className='form__btn'>
                            {
                                inputAddressAnchorEl && (<SaveAnchorEl onClick={handleSubmitChange.bind(this, 'address', setInputAddressAnchorEl)} />)
                            }
                            <button onClick={handleInputAddressAnchorEl} type='button' className='form__btn--item btn__edit'>{inputAddressAnchorEl ? 'Hủy' : 'Chỉnh sửa'}</button>
                        </div>
                    </div>
                    <div className='page__form--group'>
                        <div className='form__info'>
                            <label className='form__label'> Email </label>
                            <input disabled value={userInfo.email} className='form__input' />
                        </div>
                    </div>
                </div>
                <div className='page__form password'>
                    <h4 className='page__form--title'>Thay đổi mật khẩu 
                        <span className='row'>
                            {inputPasswordAnchorEl && (<span onClick={handleSubmitChangePassword} className='password__btn save' style={{ marginRight: '1em' }}> Lưu </span>)}
                            <span className='password__btn' onClick={handleChangePassword}> 
                                {inputPasswordAnchorEl ? 'Hủy' : 'Thay đổi'}
                            </span>
                        </span>
                    </h4>
                    <div className='page__form--group'>
                        <label className='form__label'> Mật khẩu cũ </label>
                        <input 
                            disabled={!inputPasswordAnchorEl}
                            type='password' 
                            {...register('oldPassword', {
                                required: true,
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu quá ngắn.'
                                }
                            })}
                            className='form__input' 
                        />
                        {inputPasswordAnchorEl && errors.oldPassword && (<p className='error'>{errors.oldPassword.message}</p>)}
                    </div>
                    <div className='page__form--group'>
                        <label className='form__label'> Mật khẩu mới </label>
                        <input 
                            type='password' 
                            disabled={!inputPasswordAnchorEl}
                            {...register('newPassword', {
                                required: true,
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu quá ngắn.'
                                }
                            })} 
                            className='form__input' 
                        />
                        {inputPasswordAnchorEl && errors.newPassword && (<p className='error'>{errors.newPassword.message}</p>)}
                    </div>
                    <div className='page__form--group'>
                        <label className='form__label'>Nhập lại mật khẩu mới </label>
                        <input 
                            type='password' 
                            disabled={!inputPasswordAnchorEl}
                            {...register('reNewPassword', {
                                required: true,
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu quá ngắn.'
                                },
                                validate: {
                                    compare: v => v === getValues('newPassword') || 'Mật khẩu không khớp.'
                                }
                            })}
                            className='form__input' 
                        />
                        {inputPasswordAnchorEl && errors.reNewPassword && (<p className='error'>{errors.reNewPassword.message}</p>)}
                    </div>
                </div>
            </section>
            
        </section>
    )
}

export default Setting