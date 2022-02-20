import { Slide, Slider, CarouselProvider, ButtonBack, ButtonNext } from "pure-react-carousel"
import { useEffect, useState } from "react"
import 'pure-react-carousel/dist/react-carousel.es.css'
import { getStyles } from "../helpers/helpers"
import { useWindowDemensions } from "../helpers/hooks"
import { BASE_PATH } from "../config/api"
import { Link } from "react-router-dom"

const HomeSlider = ({banners}) => {
    const {width} = useWindowDemensions()
    const [widthSlider, setWidthSlider] = useState(width)
    const [items, setItems] = useState(3)

    useEffect(() => {
        console.log(banners)
        if(document.getElementById('sidebar')) {
            setWidthSlider(width - getStyles(document.getElementById('sidebar'), 'width'))
        }
        if(width >= 64 * 16) {
            setItems(3)
        } else {
            width >= 480 ? setItems(2) : setItems(1)
        }
    }, [width])

    const TemplateSlider = banners.map((banner, idx) => {
        if(banner !== null) {
            return (<Slide index={idx} key={idx}>
                        <div className='slider__item'>
                            <div className='item__photo'>
                                <img className='item__photo--thumb' src={BASE_PATH + banner.photo} alt='' />
                            </div>
                            <div className='item__info'>
                                <Link to={`/news/${banner.slug}`} className='item__info--title'>{banner.title}</Link>
                                <div className='item__info--abstract'>{banner.abstract}</div>
                            </div>
                        </div>
                    </Slide>)
        }
        return null
    })

    return (
        <CarouselProvider
            naturalSlideWidth={widthSlider/items}
            naturalSlideHeight={15*16}
            totalSlides={banners.length}
            isPlaying={true}
            visibleSlides={items}
        >
            <Slider>
                {TemplateSlider}
            </Slider>
            <ButtonBack></ButtonBack>
            <ButtonNext></ButtonNext>
        </CarouselProvider>
    )
}

export default HomeSlider