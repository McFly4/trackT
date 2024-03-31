import { NavLink, Link } from '@remix-run/react'
import useWindowDimensions from '~/hooks/useWindowDimension'

export function Header({ header, isLoggedIn, cart, logo }: any) {
    const urlLogo = logo.metaobjects.nodes[0]?.field?.reference?.sources[0]?.url
    const { width } = useWindowDimensions()
    const sizeScreen = width || 1920

    return (
        <header className='myheader'>
            {sizeScreen > 768 ? (
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
                        <div className='icon icon-cart'>
                            {cart?._data?.totalQuantity > 0 && (
                                <span>{cart?._data?.totalQuantity || 0}</span>
                            )}
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
            ) : (
                <div className='nav-responsive'>
                    <div>
                        <div className='icon'>
                            <a href='#search-aside'>
                                <img src='/icons/search.svg' alt='search' />
                            </a>
                        </div>
                        <div className='icon'>
                            <NavLink prefetch='intent' to='/account/profile'>
                                <img src='/icons/person.svg' alt='person' />
                            </NavLink>
                        </div>
                    </div>
                    <div className='logo'>
                        <NavLink prefetch='intent' to='/' end>
                            <video
                                style={{
                                    width: '120px',
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
                    <div>
                        <div className='icon'>
                            <img src='/icons/heart.svg' alt='heart' />
                        </div>
                        <div className='icon icon-cart'>
                            {cart?._data?.totalQuantity > 0 && (
                                <span>{cart?._data?.totalQuantity || 0}</span>
                            )}
                            <a href='#cart-aside'>
                                <img src='/icons/cart.svg' alt='cart' />
                            </a>
                        </div>
                    </div>
                </div>
            )}
            {sizeScreen > 768 && (
                <div className='nav-right'>
                    <div className='nav-images'>
                        <Link to='/about'>
                            <img src='/nav/dropReused.png' alt='drop' />
                            <p>Non disponible</p>
                        </Link>
                    </div>
                    <div className='nav-images'>
                        <Link to='/about'>
                            <img src='/nav/wanted.png' alt='drop' />
                            <p>Non disponible</p>
                        </Link>
                    </div>
                    <div className='nav-images'>
                        <Link to='/about'>
                            <img src='/nav/track.png' alt='drop' />
                            <p>Non disponible</p>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
