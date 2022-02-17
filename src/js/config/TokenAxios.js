import axios from 'axios'
import { getCookie, setCookie } from '../helpers/helpers'
import { BASE_API_URI, REFRESH_TOKEN_URI } from './api'

const TokenAxios = axios.create({
    baseURL: BASE_API_URI,
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json'
    }
})

TokenAxios.interceptors.response.use((res) => {
    const {code} = res.data
    if(code === 401) {
        return TokenAxios({
            method: 'post',
            url: REFRESH_TOKEN_URI,
            data: {
                rftoken: getCookie('_rftok')
            }
        }).then(rs => {
            const { token, expiredIn } = rs.data
            const date = (new Date(expiredIn)).toUTCString()
            setCookie('token', token, {'expires': date, 'path': '/', 'sameSite': 'strict'})
            TokenAxios.defaults.headers['X-Access-Token'] = token
            TokenAxios.defaults.headers['X-Refresh-Token'] = getCookie('_rftok')
            const config = res.config
            config.headers['X-Access-Token'] = token
            config.headers['X-Refresh-Token'] = getCookie('_rftok')
            config.baseURL = BASE_API_URI
            return TokenAxios(config)
        })
    }
    return res
}, error => {
   
})

export default TokenAxios