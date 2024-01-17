import React, { useRef } from 'react'
import MainProduct from '~/components/Common/mainProduct'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'

export default function TrackT(products: any) {
    const swiperRef = useRef<any>(null)

    const nexto = () => {
        swiperRef.current?.slideNext()
    }

    const previo = () => {
        swiperRef.current?.slidePrev()
    }

    return (
        <div className='trackT'>
            <div className='trackT-header'>
                <h2>Panel trackt</h2>
                <NavButtons next={nexto} previous={previo} />
            </div>
            <Swiper
                modules={[Scrollbar]}
                scrollbar={{
                    hide: false,
                }}
                watchSlidesProgress={true}
                slidesPerView={4}
                grabCursor={true}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                spaceBetween={40}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
                {products?.products?.map((product: any, index: number) => (
                    <SwiperSlide
                        key={index}
                        style={{
                            padding: '40px 0',
                        }}
                    >
                        <MainProduct product={product} />
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
