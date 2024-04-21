import React, { useRef } from 'react'
import MainProduct from '~/components/Common/mainProduct'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'
import { useLocation } from '@remix-run/react'
import useWindowDimensions from '~/hooks/useWindowDimension'

export default function TrackT({ products, title, isAccount }: any) {
    const location = useLocation()
    const { width } = useWindowDimensions()

    const sizeScreen = width || 1920

    const swiperRef = useRef<any>(null)

    const nexto = () => {
        swiperRef.current?.slideNext()
    }

    const previo = () => {
        swiperRef.current?.slidePrev()
    }

    return (
        <div
            className='trackT'
            style={{
                margin:
                    location.pathname === '/account/profile'
                        ? sizeScreen > 768
                            ? '50px 50px 0 0'
                            : '0'
                        : location.pathname === '/account/orders'
                        ? sizeScreen > 768
                            ? '50px 0'
                            : '0'
                        : '',
            }}
        >
            <div className='trackT-header'>
                <h2>
                    {location.pathname === '/account/profile'
                        ? 'APPAREMMENT, CES ARTICLES NE VOUS ONT PAS LAISSÉ INDIFFÉRENTS'
                        : title}
                </h2>
                <p>Tout afficher</p>

                {sizeScreen > 768 && (
                    <NavButtons next={nexto} previous={previo} />
                )}
            </div>
            <Swiper
                modules={[Scrollbar]}
                scrollbar={{
                    hide: false,
                }}
                watchSlidesProgress={true}
                slidesPerGroup={1}
                slidesPerView={
                    location.pathname === '/account/profile' ||
                    location.pathname === '/account/orders'
                        ? 3
                        : 4
                }
                grabCursor={true}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                spaceBetween={0}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                    },
                    800: {
                        slidesPerView: 3,
                    },
                    1300: {
                        slidesPerView: isAccount === true ? 2 : 3,
                    },
                    1600: {
                        slidesPerView: isAccount === true ? 3 : 4,
                    },
                }}
            >
                {products?.map((product: any, index: number) => (
                    <SwiperSlide
                        key={index}
                        className='trackT-slide'
                        style={{
                            padding: '40px 0',
                            width: '300px !important',
                        }}
                    >
                        <MainProduct
                            product={product}
                            stickers={false}
                            isCarousel={true}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

function NavButtons({ next, previous }: any) {
    return (
        <div className='navigation-buttons'>
            <button onClick={previous}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='7.574'
                    height='13.928'
                    viewBox='0 0 7.574 13.928'
                >
                    <path
                        id='Tracé_416'
                        data-name='Tracé 416'
                        d='M-20862.068-17757.791a.61.61,0,0,1-.432-.18.612.612,0,0,1,0-.861l5.924-5.924-5.924-5.924a.612.612,0,0,1,0-.861.611.611,0,0,1,.863,0l6.355,6.354a.614.614,0,0,1,0,.863l-6.355,6.354A.61.61,0,0,1-20862.068-17757.791Z'
                        transform='translate(20862.678 17771.719)'
                        fill='#fff'
                    />
                </svg>
            </button>
            <button onClick={next}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='7.574'
                    height='13.928'
                    viewBox='0 0 7.574 13.928'
                >
                    <path
                        id='Tracé_416'
                        data-name='Tracé 416'
                        d='M-20862.068-17757.791a.61.61,0,0,1-.432-.18.612.612,0,0,1,0-.861l5.924-5.924-5.924-5.924a.612.612,0,0,1,0-.861.611.611,0,0,1,.863,0l6.355,6.354a.614.614,0,0,1,0,.863l-6.355,6.354A.61.61,0,0,1-20862.068-17757.791Z'
                        transform='translate(20862.678 17771.719)'
                        fill='#fff'
                    />
                </svg>
            </button>
        </div>
    )
}
