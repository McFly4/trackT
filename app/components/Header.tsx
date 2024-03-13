import { NavLink, Link } from '@remix-run/react'
import type { LayoutProps } from './Layout'
import React, { useState } from 'react'

type Viewport = 'desktop' | 'mobile'

export function Header({ header, isLoggedIn, cart, logo }: any) {
    const urlLogo = logo.metaobjects.nodes[0]?.field?.reference?.sources[0]?.url
    const [opacity1, setOpacity1] = useState(1)
    const [opacity2, setOpacity2] = useState(1)
    const [opacity3, setOpacity3] = useState(1)
    const handleOpacity1 = () => {
        const newOpacity = opacity1 - 0.2
        setOpacity1(newOpacity)
    }

    const handleOpacity2 = () => {
        const newOpacity = opacity2 - 0.2
        setOpacity2(newOpacity)
    }

    const handleOpacity3 = () => {
        const newOpacity = opacity3 - 0.2
        setOpacity3(newOpacity)
    }

    return (
        <header className='myheader'>
            <div className='nav-left'>
                <div className='logo'>
                    <NavLink prefetch='intent' to='/' end>
                        <video
                            style={{
                                width: '150px',
                            }}
                            autoPlay
                            loop
                            muted
                            playsInline
                            src={urlLogo}
                        >
                            <img
                                src={header?.shop?.brand?.logo?.image?.url}
                                alt='logo'
                            />
                        </video>
                    </NavLink>
                </div>
                <div className='nav-icons'>
                    <div className='icon'>
                        <NavLink prefetch='intent' to='/account/profile'>
                            <img src='/icons/person.svg' alt='person' />
                        </NavLink>
                    </div>
                    <div className='icon'>
                        <a href='#cart-aside'>
                            <img src='/icons/cart.svg' alt='cart' />
                        </a>
                    </div>
                    <div className='icon'>
                        <a href='#search-aside'>
                            <img src='/icons/search.svg' alt='search' />
                        </a>
                    </div>
                    <div className='icon'>
                        <img src='/icons/heart.svg' alt='heart' />
                    </div>
                    {/* <HeaderMenuMobileToggle /> */}
                </div>
            </div>
            <div className='nav-right'>
                <div
                    className='nav-images'
                    // onClick={handleOpacity1}
                    // style={{
                    //     opacity: opacity1,
                    // }}
                >
                    <Link to='/about'>
                        <img src='/nav/dropReused.png' alt='drop' />
                        <p>Non disponible</p>
                    </Link>
                </div>
                <div
                    className='nav-images'
                    // onClick={handleOpacity2}
                    // style={{
                    //     opacity: opacity2,
                    // }}
                >
                    <Link to='/about'>
                        <img src='/nav/wanted.png' alt='drop' />
                        <p>Non disponible</p>
                    </Link>
                </div>
                <div
                    className='nav-images'
                    onClick={handleOpacity3}
                    // style={{
                    //     opacity: opacity3,
                    // }}
                >
                    <Link to='/about'>
                        <img src='/nav/track.png' alt='drop' />
                        <p>Non disponible</p>
                    </Link>
                </div>
            </div>
        </header>
    )
}

function HeaderMenuMobileToggle() {
    return (
        <a className='header-menu-mobile-toggle' href='#mobile-menu-aside'>
            <h3>☰</h3>
        </a>
    )
}
