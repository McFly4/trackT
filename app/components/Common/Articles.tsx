import React, { useRef } from 'react'
import MainProduct from '~/components/Common/mainProduct'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Autoplay, FreeMode, Scrollbar, Grid } from 'swiper/modules'
import { Link, useLocation } from '@remix-run/react'
import useWindowDimensions from '~/hooks/useWindowDimension'
import { Image } from '@shopify/hydrogen'

export default function TrackT({ articles }: any) {
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
    <div className='trackT article-blog'>
      <div
        className='trackT-header'
        style={{
          marginBottom: '10px',
        }}
      >
        <div>
          <h2
            style={{
              marginLeft: '0',
            }}
          >
            Actualités TrackT
          </h2>
          <Link to='/blogs'>
            <p
              style={{
                marginLeft: '0',
              }}
            >
              Tout afficher
            </p>
          </Link>
        </div>

        {sizeScreen > 768 && <NavButtons next={nexto} previous={previo} />}
      </div>
      <Swiper
        modules={[Scrollbar, FreeMode, Autoplay, Grid]}
        scrollbar={{
          hide: false,
        }}
        watchSlidesProgress={true}
        slidesPerView={4}
        autoplay={{
          delay: 3000,
        }}
        freeMode={true}
        grabCursor={true}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        spaceBetween={40}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {articles?.map((product: any, index: number) => (
          <SwiperSlide key={index} className='trackT-slide article-slide'>
            <Link to={`/blogs/news/${product.handle}`}>
              <div className='swiper-articles'>
                <Image data={product.image} aspectRatio='3/2' />
                <p>{product.title?.length > 70 ? product.title.slice(0, 70) + '...' : product.title}</p>
              </div>
            </Link>
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
        <svg xmlns='http://www.w3.org/2000/svg' width='7.574' height='13.928' viewBox='0 0 7.574 13.928'>
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
        <svg xmlns='http://www.w3.org/2000/svg' width='7.574' height='13.928' viewBox='0 0 7.574 13.928'>
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
