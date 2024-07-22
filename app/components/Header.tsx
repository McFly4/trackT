import { useState } from 'react'
import { NavLink, Link } from '@remix-run/react'
import useWindowDimensions from '~/hooks/useWindowDimension'
import SearchOptions from '~/components/Common/Modals/SearchOptions'
import React from 'react'
import { Image } from '@shopify/hydrogen'

export function Header({ header, isLoggedIn, cart, logo, rightNow, trendy }: any) {
  const rightNowProducts = rightNow.metaobjects.nodes[0].field.references.nodes
  const trendyProducts = trendy.metaobjects.nodes[0].field.references.nodes

  const { width } = useWindowDimensions()
  const sizeScreen = width || 1920

  const [subMenu, setSubMenu] = useState(false)
  const [subsubMenu, setSubSubMenu] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState(true)
  const [sneakers, setSneakers] = useState(false)
  const [textile, setTextile] = useState(false)
  const [accessoires, setAccessoires] = useState(false)
  const [marques, setMarques] = useState(false)
  const [about, setAbout] = useState(false)
  const [now, setNow] = useState(false)
  const [jordan, setJordan] = useState(false)
  const [dunk, setDunk] = useState(false)
  const [yeezy, setYeezy] = useState(false)
  const [adidas, setAdidas] = useState(false)

  const urlLogo = logo?.metaobjects?.nodes[0]?.field?.reference?.sources[0]?.url

  const resetSubmenuStates = () => {
    setSneakers(false)
    setTextile(false)
    setAccessoires(false)
    setMarques(false)
    setAbout(false)
    setSubMenu(false)
    setNow(false)
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const getParentClass = (activeState: boolean) => {
    return hovered && !activeState ? 'parent-opacity' : ''
  }

  const colors = [
    { name: 'blanc', hex: '#fff', link: '/filtered?palette=white' },
    { name: 'rouge', hex: '#ff0000', link: '/filtered?palette=red' },
    { name: 'rose', hex: '#ff00ff', link: '/filtered?palette=pink' },
    { name: 'violet', hex: '#800080', link: '/filtered?palette=violet' },
    {
      name: 'Bleu navy',
      hex: '#000080',
      link: '/filtered?palette=blue-navy',
    },
    {
      name: 'bleu clair',
      hex: '#add8e6',
      link: '/filtered?palette=blue-clair',
    },
    { name: 'vert', hex: '#008000', link: '/filtered?palette=green' },
    { name: 'jaune', hex: '#ffff00', link: '/filtered?palette=yellow' },
    { name: 'beige', hex: '#f5f5dc', link: '/filtered?palette=beige' },
    { name: 'orange', hex: '#ffa500', link: '/filtered?palette=orange' },
    { name: 'marron', hex: '#8b4513', link: '/filtered?palette=brown' },
    { name: 'kaki', hex: '#556b2f', link: '/filtered?palette=kaki' },
    { name: 'gris', hex: '#808080', link: '/filtered?palette=grey' },
    { name: 'noir', hex: '#000', link: '/filtered?palette=black' },
  ]

  const brandList = [
    { name: 'Adidas', link: '/search?q=adidas' },
    { name: 'Audemars Piguet', link: '/search?q=audemars' },
    { name: 'Bearbrick', link: '/search?q=bearbrick' },
    { name: 'Birkenstock', link: '/search?q=birkenstock' },
    { name: 'Bravest studios', link: '/search?q=bravest' },
    { name: 'Cactus Jack Nike', link: '/search?q=cactus' },
    { name: 'Chrome Hearts', link: '/search?q=chrome' },
    { name: 'Jordan', link: '/search?q=jordan' },
    { name: 'Jumpman Jack', link: '/search?q=jumpman' },
    { name: 'Kaws', link: '/search?q=kaws' },
    { name: 'Kobe ', link: '/search?q=kobe' },
    { name: 'Larvee', link: '/search?q=larvee' },
    { name: ' Nke', link: '/search?q=nike' },
    { name: 'Palace', link: '/search?q=palace' },
    { name: 'Spalding', link: '/search?q=spalding' },
    { name: 'Super 7', link: '/search?q=super7' },
    { name: 'supreme', link: '/search?q=supreme' },
    { name: 'Stussy', link: '/search?q=stussy' },
    { name: 'Yeezy', link: '/search?q=yeezy' },
  ]

  const textileList = [
    { name: 'Tout le textile', link: '/search?q=Clothing' },
    { name: 'Tous les tee-shirt', link: '/collections/T-shirt' },
    { name: 'Tous les hoodies', link: '/collections/Hoodie' },
    { name: 'Toutes les vestes', link: '/collections/Veste' },
    { name: 'Tous les pants', link: '/collections/Pants' },
  ]

  const accessoiresList = [
    { name: 'Tous les accessoires', link: '/search?q=Accessories' },
    { name: 'Tous les pocket item', link: '/collections/pocket-item' },
    { name: 'Toutes les figurines', link: '/collections/figurine' },
    { name: 'Toutes les casquettes', link: '/collections/casquette' },
    { name: 'Tous les bonnets', link: '/collections/bonnet' },
    { name: 'Toutes les planches', link: '/collections/planches' },
    { name: 'Toutes les autres accessoires', link: '/collections/other-accessories' },
  ]
  return (
    <>
      {sizeScreen > 768 ? (
        <header
          onMouseLeave={() => {
            setHovered(false)
            resetSubmenuStates()
          }}
          className={`myheader ${hovered ? 'b-bottom' : ''}`}
        >
          <div className={`overflow ${hovered ? 'collapse' : ''}`}></div>
          <div className='logo'>
            <NavLink prefetch='intent' to='/' end>
              <video style={{ width: '100px' }} autoPlay loop muted playsInline src={urlLogo}>
                <img src={header?.shop?.brand?.logo?.image?.url} alt='logo' />
              </video>
            </NavLink>
          </div>
          <div className='content'>
            <a href='#categories-aside'>
              <button className='categories'>Toutes les catégories</button>
            </a>
            <p
              onMouseEnter={() => {
                setHovered(true)
                resetSubmenuStates()
                setSneakers(true)
              }}
              className={getParentClass(sneakers)}
            >
              <NavLink to='/search?q=sneakers'>Sneakers</NavLink>
            </p>
            <p
              onMouseEnter={() => {
                setHovered(true)
                resetSubmenuStates()
                setTextile(true)
              }}
              className={getParentClass(textile)}
            >
              <NavLink to='/search?q=Clothing'>Textile</NavLink>
            </p>
            <p
              onMouseEnter={() => {
                setHovered(true)
                resetSubmenuStates()
                setAccessoires(true)
              }}
              className={getParentClass(accessoires)}
            >
              <NavLink to='/search?q=Accessories'>Accessoires</NavLink>
            </p>
            <p
              onMouseEnter={() => {
                setHovered(true)
                resetSubmenuStates()
                setMarques(true)
              }}
              className={getParentClass(marques)}
            >
              Marques
            </p>
            <p
              onMouseEnter={() => {
                setAbout(true)
                resetSubmenuStates()
              }}
              className={getParentClass(about)}
            >
              <NavLink to='/about'>A propos de trackt</NavLink>
            </p>
            <span
              onMouseEnter={() => {
                resetSubmenuStates()
              }}
              className={hovered ? 'parent-opacity' : ''}
            >
              <NavLink to='/blogs'>Blog</NavLink>
            </span>
            {hovered && (
              <div className='submenu'>
                {sneakers && (
                  <>
                    <NavLink to='/collections/jordan'>Jordan</NavLink>
                    <NavLink to='/collections/dunk'>Dunk</NavLink>
                    <NavLink to='/collections/yeezy'>Yeezy</NavLink>
                    <NavLink to='/collections/adidas'>Adidas</NavLink>
                    <NavLink to='/collections/collab'>Collab's</NavLink>
                  </>
                )}
                {textile && (
                  <>
                    {textileList.map((textile, index) => (
                      <NavLink key={index} to={textile.link}>
                        {textile.name}
                      </NavLink>
                    ))}
                  </>
                )}
                {accessoires && (
                  <>
                    {accessoiresList.map((accessoire, index) => (
                      <NavLink key={index} to={accessoire.link}>
                        {accessoire.name}
                      </NavLink>
                    ))}
                  </>
                )}
                {marques && (
                  <>
                    {brandList.map((brand, index) => (
                      <NavLink key={index} to={brand.link}>
                        {brand.name}
                      </NavLink>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
          <div className='icons'>
            <a href='#search-aside'>
              <img src='/icons/search.svg' alt='search' />
            </a>
            {/*<SearchOptions icon={true} />*/}
            {/*<NavLink to='/about'>*/}
            {/*  <img src='/icons/folder.svg' alt='folder' />*/}
            {/*</NavLink>*/}
            <NavLink prefetch='intent' to='/account/profile'>
              <img src='/icons/person.svg' alt='person' />
            </NavLink>
            <div className='icon icon-cart'>
              {cart?._data?.totalQuantity > 0 && <span>{cart?._data?.totalQuantity || 0}</span>}
              <a href='#cart-aside'>
                <img src='/icons/cart.svg' alt='cart' />
              </a>
            </div>
          </div>
        </header>
      ) : (
        <header className='myheader'>
          <div className='nav-responsive'>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                className='icon'
              >
                <SearchOptions toggleMenu={toggleMenu} icon={true} />
                <a href='/account/profile'>
                  <img src='/icons/person.svg' alt='person' />
                </a>
              </div>
            </div>
            <div className='logo'>
              <a href='/'>
                <video style={{ width: '90px' }} autoPlay loop muted playsInline src={urlLogo}>
                  <img src={header?.shop?.brand?.logo?.image?.url} alt='logo' />
                </video>
              </a>
            </div>
            <div>
              <div className='icon icon-cart'>
                {cart?._data?.totalQuantity > 0 && <span>{cart?._data?.totalQuantity || 0}</span>}
                <a href='#cart-aside'>
                  <img src='/icons/cart.svg' alt='cart' />
                </a>
              </div>
              <img
                style={{ width: '25px', height: '25px' }}
                src='/icons/burger-menu.svg'
                alt='burger-menu'
                onClick={toggleMenu}
              />
            </div>
          </div>
          {menuOpen && (
            <div className='full-screen-menu'>
              <div className='menu-top'>
                <img
                  onClick={
                    subsubMenu
                      ? () => setSubSubMenu(false)
                      : () => {
                          setSubMenu(false)
                          resetSubmenuStates()
                        }
                  }
                  src='/icons/arrowRight.svg'
                  alt='arrow-right'
                  style={{
                    width: '25px',
                    height: '25px',
                    transform: 'rotate(180deg)',
                    cursor: 'pointer',
                    opacity: subMenu ? 1 : 0,
                  }}
                />
                <a href='#search-aside'>
                  <img src='/icons/search.svg' alt='search' />
                </a>
                <div
                  onClick={toggleMenu}
                  style={{
                    backgroundColor: '#262626',
                    borderRadius: '50px',
                    padding: '15px',
                    height: '15px',
                  }}
                >
                  <img style={{ width: '15px', height: '15px' }} src='/icons/close.svg' alt='close' />
                </div>
              </div>
              {subMenu ? (
                subsubMenu ? (
                  <div className='parent subParent'>
                    {jordan && (
                      <ul>
                        <li>
                          <a href='/collections/Jordan-1'>Jordan 1</a>
                        </li>
                        <li>
                          <a href='/collections/Jordan-3'>Jordan 3</a>
                        </li>
                        <li>
                          <a href='/collections/Jordan-4'>Jordan 4</a>
                        </li>
                        <li>
                          <a href='/search?q=jordan-6'>Jordan 6</a>
                        </li>
                        <li>
                          <a href='/search?q=jordan'>Voir toutes les jordan</a>
                        </li>
                      </ul>
                    )}
                    {dunk && (
                      <ul>
                        <li>
                          <a href='/collections/dunk-low'>Dunk Low</a>
                        </li>
                        <li>
                          <a href='/collections/sb-dunk-low'>Dunk Low sb</a>
                        </li>
                        <li>
                          <a href='/collections/dunk-high'>Dunk High (+sb)</a>
                        </li>
                        <li>
                          <a href='/search?q=dunk'>Voir toutes les dunk</a>
                        </li>
                      </ul>
                    )}
                    {yeezy && (
                      <ul>
                        <li>
                          <a href='/collections/yeezy-boost'>Yeezy boost</a>
                        </li>
                        <li>
                          <a href='/collections/yeezy-slide'>Yeezy slide</a>
                        </li>
                        <li>
                          <a href='/collections/yeezy-foam'>Yeezy foam</a>
                        </li>
                        <li>
                          <a href='/search?q=yeezy'>Voir toutes les yeezy</a>
                        </li>
                      </ul>
                    )}
                    {adidas && (
                      <ul>
                        <li>
                          <a href='/collections/campus-00s'>Campus</a>
                        </li>
                        <li>
                          <a href='/collections/gazelle'>Gazelle</a>
                        </li>
                        <li>
                          <a href='/collections/samba'>samba</a>
                        </li>
                        <li>
                          <a href='/search?q=adidas'>Voir toutes les adidas</a>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className='parent subParent'>
                    {now && (
                      <>
                        <div className='now-product'>
                          <h5
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            En ce moment sur TrackT
                            <img
                              style={{
                                marginLeft: '10px',
                                width: '25px',
                              }}
                              src='/icons/heart.gif'
                              alt='coin-mario'
                            />
                          </h5>
                          {rightNowProducts.map((product: any) => (
                            <div key={product.id} className='right-now-product'>
                              <Image data={product.image} loading='lazy' />
                              <p>{product.title}</p>
                            </div>
                          ))}
                        </div>
                        <div className='now-product'>
                          <h5
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            Modèles populaires
                            <img
                              style={{
                                marginLeft: '10px',
                                width: '25px',
                              }}
                              src='/icons/coin-mario.gif'
                              alt='coin-mario'
                            />
                          </h5>
                          {trendyProducts.map((product: any) => (
                            <div key={product.id} className='right-now-product'>
                              <Image data={product.images.nodes[0]} loading='lazy' />
                              <p>{product.vendor}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {sneakers && (
                      <ul>
                        <li>
                          <a href='/search?q=sneakers'>Voir toutes les sneakers</a>
                        </li>
                        <li
                          onClick={() => {
                            setSubSubMenu(true)
                            setJordan(true)
                          }}
                        >
                          <p>Jordan</p>
                          <img src='/icons/arrowRight.svg' alt='arrow-right' />
                        </li>
                        <li
                          onClick={() => {
                            setSubSubMenu(true)
                            setDunk(true)
                          }}
                        >
                          <p>Dunk</p>
                          <img src='/icons/arrowRight.svg' alt='arrow-right' />
                        </li>
                        <li
                          onClick={() => {
                            setSubSubMenu(true)
                            setYeezy(true)
                          }}
                        >
                          <p>Yeezy</p>
                          <img src='/icons/arrowRight.svg' alt='arrow-right' />
                        </li>
                        <li
                          onClick={() => {
                            setSubSubMenu(true)
                            setAdidas(true)
                          }}
                        >
                          <p>Adidas</p>
                          <img src='/icons/arrowRight.svg' alt='arrow-right' />
                        </li>{' '}
                        <li>
                          <a href='/search?q=collab'>
                            <p>
                              collab's
                              <br />
                              <span
                                style={{
                                  fontWeight: 'normal',
                                  fontSize: '12px',
                                }}
                              >
                                (travis, suprême, kobe, dior, off white, j-balvin...)
                              </span>
                            </p>
                          </a>
                        </li>
                      </ul>
                    )}
                    {textile && (
                      <ul>
                        {textileList.map((textile, index) => (
                          <li key={index}>
                            <a href={textile.link}>{textile.name}</a>
                          </li>
                        ))}
                        <li
                          style={{
                            justifyContent: 'flex-start',
                          }}
                        >
                          Tous les one of one
                          <img
                            style={{
                              width: '51px',
                              height: '33px',
                              marginLeft: '10px',
                            }}
                            src='/about/soonAbout.png'
                            alt='soon'
                          />
                        </li>
                      </ul>
                    )}
                    {accessoires && (
                      <ul>
                        {accessoiresList.map((accessoire, index) => (
                          <li key={index}>
                            <a href={accessoire.link}>{accessoire.name}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {marques && (
                      <ul>
                        {brandList.map((brand, index) => (
                          <li key={index}>
                            <a href={brand.link}>{brand.name}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              ) : (
                <div className='parent'>
                  <ul>
                    <li
                      onClick={() => {
                        setNow(true)
                        setSubMenu(true)
                      }}
                    >
                      <p
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        En ce moment
                        <img
                          style={{
                            marginLeft: '10px',
                            width: '25px',
                          }}
                          src='/icons/coin-mario.gif'
                          alt='coin-mario'
                        />
                      </p>
                      <img src='/icons/arrowRight.svg' alt='arrow-right' />
                    </li>
                    <li
                      onClick={() => {
                        setSneakers(true)
                        setSubMenu(true)
                      }}
                    >
                      <p>Sneakers</p>
                      <img src='/icons/arrowRight.svg' alt='arrow-right' />
                    </li>
                    <li
                      onClick={() => {
                        setTextile(true)
                        setSubMenu(true)
                      }}
                    >
                      <p>Textile</p>
                      <img src='/icons/arrowRight.svg' alt='arrow-right' />
                    </li>
                    <li
                      onClick={() => {
                        setAccessoires(true)
                        setSubMenu(true)
                      }}
                    >
                      <p>Accessoires</p>
                      <img src='/icons/arrowRight.svg' alt='arrow-right' />
                    </li>
                    <li
                      onClick={() => {
                        setMarques(true)
                        setSubMenu(true)
                      }}
                    >
                      <p>Marques</p>
                      <img src='/icons/arrowRight.svg' alt='arrow-right' />
                    </li>
                    <li>
                      <a href='/about'>
                        <p>A propos de trackt, la safe place streetwear</p>
                      </a>
                    </li>
                    <li>
                      <a href='/blogs'>
                        <p>X-Trackt, le blog</p>
                      </a>
                    </li>
                    <li
                      style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <p>Shop with labels</p>
                      <div className='shop-labels'>
                        <a href='/filtered?new=true'>
                          <img src='/product/stickers/new.png' alt='new' />
                          <p>Nouvel arrivage</p>
                        </a>
                        <a href='/filtered?fast=true'>
                          <img src='/product/stickers/ship.png' alt='fast' />
                          <p>Livré en 24h</p>
                        </a>
                        <a href='/filtered?hotdeal=true'>
                          <img src='/product/stickers/hotDeal.png' alt='hot deal' />
                          <p>hot deal</p>
                        </a>
                        <a href='/filtered?release=true'>
                          <img src='/product/stickers/release.png' alt='release' />
                          <p>exclusive item</p>
                        </a>
                        <a href='/filtered?promotion=true'>
                          <img src='/product/stickers/promotion.png' alt='promo' />
                          <p>en promo</p>
                        </a>
                      </div>
                    </li>
                    <li
                      style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <p>Shop with colors</p>
                      <div className='shop-colors'>
                        {colors.map((color, index) => (
                          <div
                            onClick={() => (window.location.href = color.link)}
                            key={index}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: color.hex,
                                margin: 'unset',
                                width: '13px',
                                height: '13px',
                                padding: 'unset',
                              }}
                            ></span>
                            <p
                              style={{
                                marginLeft: '10px',
                              }}
                            >
                              {color.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </li>
                  </ul>
                  <div className='menu-footer'>
                    <div>
                      <p>
                        Assistance TrackT <br />
                        7/7 - 24/24
                      </p>
                      <a
                        style={{
                          color: '#fee233',
                          marginTop: '10px',
                        }}
                        href='https://instagram.com/tracktonline'
                      >
                        Contact ici - Instagram
                      </a>
                    </div>
                    <div className='menu-footer-tv'>
                      <a href='https://instagram.com/tracktonline'>
                        <img src='/instaSmall.png' alt='tv' />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </header>
      )}
    </>
  )
}
