import axios from 'axios'
import { Fragment, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CHECK_EMAIL_EXIST_URI, SIGNATURE_BASE_URI } from '../config/api'

const hasEmail = async (email, type) => {
    const hasEmail = await axios({
        method: 'post',
        url: CHECK_EMAIL_EXIST_URI,
        data: {
            email: email,
            sign: type
        }
    })
    .then(res => res.data.hasEmail)

    return hasEmail
}

const Sign = ({logo, appCallback}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [cookies, setCookie] = useCookies(['token', '_rftok'])
    const [typeSign, setTypeSign] = useState(location.pathname.includes('login') ? null : true)
    const textLabel = typeSign ? 'Đăng ký tài khoản FoodNews' : 'Đăng nhập vào FoodNews'
    const handleSetTypeSign = () => {
        navigate(typeSign ? 'login' : 'register')
        reset()
        setTypeSign(!typeSign)
    }

    const {register, handleSubmit, setError, reset, formState: { isValid, isDirty, errors }} = useForm({mode: 'onChange', reValidateMode: 'onChange'})
    const onSubmit = data => {
        const signPath = SIGNATURE_BASE_URI + (typeSign ? 'register' : 'login')
        axios({
            method: 'post',
            url: signPath,
            data: data
        }).then(response => {
            if(response.data) {
                if(response.data.code === 422) {
                    setError('systems', {type: 'sign', message: response.data.message})
                }
                if(response.data.code === 200) {
                    let rftime = new Date(response.data.expireIn)
                    if(typeSign) {
                        navigate('login')
                        setTypeSign(null)
                        reset()
                    } else {
                        setCookie('_rftok', response.data.rftoken, {expires: new Date(rftime.getTime() + 10*86400000), path: '/'})
                        setCookie('token', response.data.token, {expires: rftime, path: '/'})
                        appCallback(response.data.token)
                        navigate('/')
                    }
                }
            }
        })
    }
    return (
        <section id='sign'>
            <div className="sign__container">
                <Link to='/' className='sign__container--goback'>Về Home</Link>
                <img className='sign__container--logo' alt='' src={logo} />
                <h3 className='sign__container--title'>{textLabel}</h3>
                <form className='sign__container--form' onSubmit={handleSubmit(onSubmit)}>
                    {errors.systems && (<div className='error'>{errors.systems.message}</div>)}
                    { typeSign && (
                        <Fragment>
                            <input 
                                {...register('name', {
                                    required: 'Hãy nhập họ và tên của bạn.',
                                    pattern: {
                                        value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/,
                                        message: 'Họ tên không hợp lệ.'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Họ tên của bạn quá dài.'
                                    }
                                })}
                                className='sign__form--input' 
                                type='text' name='name' 
                                placeholder='Họ và tên' 
                            />  
                            {errors.name && (<div className='error'>{errors.name.message}</div>)}
                        </Fragment>
                    )}
                    <input
                        {...register("email", {
                            required: 'Bạn chưa nhập địa chỉ email !', 
                            pattern: {
                                value: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: 'Địa chỉ email không hợp lệ !'
                            },
                            validate: v => hasEmail(v, typeSign)
                        })} 
                        className='sign__form--input'
                        type='text' 
                        placeholder='Địa chỉ email' 
                    />
                    { errors.email && errors.email.type !== 'validate' && (<div className='error'>{errors.email.message}</div>) }
                    { errors.email && errors.email.type === 'validate' && (<div className='error'>{typeSign ? 'Địa chỉ email đã sử dụng' : 'Địa chỉ email không tồn tại'}.</div>) }
                    <input 
                        {...register('password', {
                            required: 'Mật khẩu không được để trống',
                            minLength: {
                                value: 6,
                                message: 'Mật khẩu tối thiểu phải từ 6 ký tự.'
                            }
                        })}
                        className='sign__form--input' 
                        type='password'
                        placeholder='Mật khẩu'
                    />
                    { errors.password && (<div className='error'>{errors.password.message}</div>) }
                    <button disabled={!isValid || !isDirty} className='sign__form--btn' type='submit'>{ typeSign ? 'Đăng ký' : 'Đăng nhập' }</button>
                </form>
                <p className='sign__container--foot'>Bạn { typeSign ? 'đã' : 'chưa' } có tài khoản ? <span className='sign__container--footbtn' onClick={handleSetTypeSign}>{ !typeSign ? 'Đăng ký' : 'Đăng nhập' }</span></p>
            </div>
        </section>
    )
}

export default Sign