const Footer = ({logo, ...props}) => {
    return (
        <footer id='footer'>
            <div className='footer__logo'>
                <div className='footer__logo--top'>
                    <img className='footer__logo--topPhoto' alt='' src={logo} />
                    <span className='footer__logo--topTitle'>Tin Tức Thực Phẩm</span>
                </div>
                <p className='footer__logo--item'>
                    Trang tin tức về mọi khía cạnh của công nghiệp thực phẩm hàng đầu Việt Nam. 
                    Mang đến cho bạn đọc những thông tin bổ ích và mới nhất.
                </p>
            </div>
            <div className='footer__info'>
                <p className='footer__info--head'>Food News Online</p>
                <p className='footer__info--item'>Họ và tên: <span>Đỗ Bá Trường</span></p>
                <p className='footer__info--item'>Email: <span>dobatruongbk48@gmail.com</span></p>
                <p className='footer__info--item'>Địa chỉ: <span>Đan Tảo - Tân Minh - Sóc Sơn - Hà Nội</span></p>
            </div>
        </footer>
    )
}

export default Footer