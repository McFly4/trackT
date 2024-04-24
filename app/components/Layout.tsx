import React, { useEffect, useRef, useState } from 'react'
import {
    Await,
    FetcherWithComponents,
    Link,
    useFetchers,
    useNavigation,
} from '@remix-run/react'
import { Suspense } from 'react'
import type {
    CartApiQueryFragment,
    FooterQuery,
    HeaderQuery,
} from 'storefrontapi.generated'
import { Aside } from '~/components/Aside'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import { CartMain } from '~/components/Cart'
import {
    NO_PREDICTIVE_SEARCH_RESULTS,
    NormalizedPredictiveSearch,
    PredictiveSearchForm,
    PredictiveSearchResults,
} from '~/components/Search'
import { AsideSearch } from './AsideSearch'
import { useLocation, useNavigate } from '@remix-run/react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'
import type { CartLineInput } from '@shopify/hydrogen/storefront-api-types'
import { CartForm } from '@shopify/hydrogen'
import { AsideCategories } from '~/components/AsideCategories'
import useWindowDimension from '~/hooks/useWindowDimension'

export type LayoutProps = {
    cart: Promise<CartApiQueryFragment | null>
    children?: React.ReactNode
    footer: Promise<FooterQuery>
    header: HeaderQuery
    isLoggedIn: boolean
    pocketItems: any
    logoTrackt: any
}

export function Layout({
    cart,
    children = null,
    footer,
    header,
    isLoggedIn,
    pocketItems,
    logoTrackt,
}: LayoutProps) {
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation()

    useEffect(() => {
        const handleLoad = () => {
            setIsLoading(false)
        }

        const handleUnload = () => {
            setIsLoading(true)
        }

        window.addEventListener('load', handleLoad)
        window.addEventListener('unload', handleUnload)

        const timeoutId = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('load', handleLoad)
            window.removeEventListener('unload', handleUnload)
        }
    }, [])

    return (
        <>
            {isLoading && (
                <div className='loading-video'>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        src='/loading.mp4'
                    ></video>
                </div>
            )}
            <CartAside cart={cart} pocketItems={pocketItems} />
            <SearchAside />
            <CategoriesAside />
            {location.pathname !== '/account/login' &&
                location.pathname !== '/filters' &&
                location.pathname !== '/account/register' &&
                location.pathname !== '/account/recover' &&
                !location.pathname.startsWith('/account/reset') && (
                    <Header
                        header={header}
                        cart={cart}
                        isLoggedIn={isLoggedIn}
                        logo={logoTrackt}
                    />
                )}
            <main>{children}</main>
            {!location.pathname.startsWith('/account') &&
                location.pathname !== '/filters' && (
                    <Suspense>
                        <Await resolve={footer}>
                            {(footer) => <Footer menu={footer.menu} />}
                        </Await>
                    </Suspense>
                )}
        </>
    )
}

function CartAside({ cart, pocketItems }: any) {
    const pocket = pocketItems.collection.products.nodes
    const swiperRef = useRef<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPocketOpen, setIsPocketOpen] = useState(false)
    const naviguate = useNavigate()

    const nexto = () => {
        swiperRef.current?.slideNext()
    }

    const previo = () => {
        swiperRef.current?.slidePrev()
    }

    const toggleModal = (data: any) => {
        setIsModalOpen(data)
    }

    const togglePocket = (data: any) => {
        setIsPocketOpen(data)
    }

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false)
        }
    }

    const handleOutsideClickPocket = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsPocketOpen(false)
        }
    }

    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash !== '#cart-aside') {
                setIsPocketOpen(false)
            }
        }

        window.addEventListener('hashchange', handleHashChange)

        handleHashChange()

        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [isModalOpen])

    return (
        <>
            {isModalOpen && (
                <div
                    className='dialog-overlay'
                    onClick={() => toggleModal(false)}
                >
                    <div className='dialog'>
                        <ToggleModal toggle={toggleModal} cart={cart} />
                    </div>
                </div>
            )}
            {isPocketOpen && (
                <div
                    className='pocket-items'
                    onClick={handleOutsideClickPocket}
                >
                    <div className='pocket-dialog'>
                        <div className='pocket-items-header'>
                            <img
                                src='/cart/pocketItems.png'
                                alt='pocketItems'
                            />
                            <p>
                                Ajouter quelques items pour atteindre la
                                couronne supérieure.
                            </p>
                        </div>
                        <TogglePocket toggle={togglePocket}>
                            <Swiper
                                modules={[Scrollbar]}
                                scrollbar={{
                                    hide: false,
                                }}
                                watchSlidesProgress={true}
                                slidesPerView={3}
                                grabCursor={true}
                                navigation={{
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                }}
                                spaceBetween={40}
                                onSwiper={(swiper) =>
                                    (swiperRef.current = swiper)
                                }
                            >
                                {pocket?.map((item: any, index: number) => (
                                    <SwiperSlide
                                        key={index}
                                        style={{
                                            padding: '40px 0',
                                        }}
                                        className={`pocket-items-product ${
                                            item.variants.nodes[0]
                                                .availableForSale
                                                ? ''
                                                : 'pocketItemOOO'
                                        }`}
                                    >
                                        <div
                                            className='pocket-items-product-img'
                                            onClick={() => {
                                                window.location.href = `/products/${item.handle}`
                                            }}
                                        >
                                            {!item.variants.nodes[0]
                                                .availableForSale && (
                                                <span>Sold out</span>
                                            )}{' '}
                                            <img
                                                src={item.images.nodes[0].url}
                                                className='pocket-items-product-img-main'
                                                style={{
                                                    objectFit:
                                                        item?.box?.value ==
                                                            '4:5' ||
                                                        item?.box?.value ==
                                                            '1:1'
                                                            ? 'contain'
                                                            : 'cover',
                                                }}
                                            />
                                            <img
                                                src={
                                                    '/cart/pocket/' +
                                                    (index % 8) +
                                                    '.png'
                                                }
                                                className='pocket-items-product-img-price'
                                            />
                                            <p>
                                                +
                                                {
                                                    item.variants.nodes[0].price.amount.split(
                                                        '.'
                                                    )[0]
                                                }
                                                €
                                            </p>
                                        </div>
                                        <div
                                            onClick={() => {
                                                window.location.href = `/products/${item.handle}`
                                            }}
                                        >
                                            <h4 className='p-title'>
                                                {item.vendor}
                                            </h4>
                                            <h6 className='p-title'>
                                                {item.title}
                                            </h6>
                                        </div>
                                        <AddToCartButton
                                            disabled={
                                                !item.variants.nodes[0]
                                                    .availableForSale
                                            }
                                            lines={[
                                                {
                                                    merchandiseId:
                                                        item.variants.nodes[0]
                                                            .id,
                                                    quantity: 1,
                                                },
                                            ]}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <NavButtons next={nexto} previous={previo} />
                        </TogglePocket>
                    </div>
                </div>
            )}
            <Aside id='cart-aside' heading=''>
                <Suspense fallback={<p>Loading cart ...</p>}>
                    <Await resolve={cart}>
                        {(cart: any) => {
                            return (
                                <CartMain
                                    cart={cart}
                                    layout='aside'
                                    isModalOpen={isModalOpen}
                                    isPocketOpen={isPocketOpen}
                                    onToggleModal={toggleModal}
                                    onTogglePocket={togglePocket}
                                    pocketItems={pocketItems}
                                />
                            )
                        }}
                    </Await>
                </Suspense>
            </Aside>
        </>
    )
}

function NavButtons({ next, previous }: any) {
    return (
        <div
            className='navigation-buttons'
            style={{
                marginTop: '30px',
                marginLeft: '30px',
            }}
        >
            <button
                onClick={previous}
                style={{
                    width: '41px',
                    height: '41px',
                }}
            >
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
            <button
                onClick={next}
                style={{
                    width: '41px',
                    height: '41px',
                }}
            >
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

function AddToCartButton({
    analytics,
    disabled,
    lines,
    onClick,
}: {
    analytics?: unknown
    disabled?: boolean
    lines: CartLineInput[]
    onClick?: () => void
}) {
    return (
        <CartForm
            route='/cart'
            inputs={{ lines }}
            action={CartForm.ACTIONS.LinesAdd}
        >
            {(fetcher: FetcherWithComponents<any>) => (
                <>
                    <input
                        name='analytics'
                        type='hidden'
                        value={JSON.stringify(analytics)}
                    />
                    <button
                        type='submit'
                        onClick={onClick}
                        disabled={disabled ?? fetcher.state !== 'idle'}
                    >
                        {fetcher.state !== 'idle'
                            ? 'Ajout ...'
                            : 'Ajouter au panier'}
                    </button>
                </>
            )}
        </CartForm>
    )
}

function CategoriesAside() {
    return <AsideCategories id='categories-aside' heading='CATEGORIES' />
}

type UseSearchReturn = NormalizedPredictiveSearch & {
    searchInputRef: React.MutableRefObject<HTMLInputElement | null>
    searchTerm: React.MutableRefObject<string>
}

function usePredictiveSearch(): UseSearchReturn {
    const fetchers = useFetchers()
    const searchTerm = useRef<string>('')
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    const searchFetcher = fetchers.find(
        (fetcher) => fetcher.data?.searchResults
    )

    if (searchFetcher?.state === 'loading') {
        searchTerm.current = (searchFetcher.formData?.get('q') || '') as string
    }

    const search = (searchFetcher?.data?.searchResults || {
        results: NO_PREDICTIVE_SEARCH_RESULTS,
        totalResults: 0,
    }) as NormalizedPredictiveSearch

    // capture the search input element as a ref
    useEffect(() => {
        if (searchInputRef.current) return
        searchInputRef.current = document.querySelector('input[type="search"]')
    }, [])

    return { ...search, searchInputRef, searchTerm }
}

function SearchAside() {
    // Déclarez une référence pour l'élément input
    const inputRef = useRef<HTMLInputElement | null>(null)
    const useWidth = useWindowDimension()
    const width = useWidth.width || 1920
    const { totalResults } = usePredictiveSearch()
    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#search-aside' && inputRef.current) {
                inputRef.current.focus()
            }
        }

        window.addEventListener('hashchange', handleHashChange)

        handleHashChange()

        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [inputRef])

    return (
        <AsideSearch id='search-aside' heading='SEARCH'>
            <div className='predictive-search'>
                <PredictiveSearchForm>
                    {({ fetchResults }) => (
                        <div>
                            <input
                                name='q'
                                onChange={fetchResults}
                                onFocus={fetchResults}
                                ref={inputRef}
                                type='search'
                                autoComplete='off'
                                id='search'
                                placeholder='Nike dunk low'
                            />
                            &nbsp;
                            <button
                                disabled={inputRef.current?.value?.length === 0}
                                onClick={() => {
                                    history.go(-1)
                                    window.location.href = `/search?q=${inputRef?.current?.value}`
                                }}
                                style={
                                    totalResults === 0
                                        ? { display: 'none' }
                                        : width > 768
                                        ? {
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              width: '500px',
                                          }
                                        : {
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              position: 'fixed',
                                              bottom: '20px',
                                              width: '80%',
                                              height: '60px',
                                              left: '0',
                                              right: '0',
                                              marginLeft: 'auto',
                                              marginRight: 'auto',
                                          }
                                }
                                className={
                                    inputRef.current?.value?.length === 0
                                        ? 'btn-disabled'
                                        : 'btn-active'
                                }
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='21.798'
                                    height='21.797'
                                    viewBox='0 0 21.798 21.797'
                                >
                                    <g id='icon' transform='translate(0 0)'>
                                        <path
                                            id='Tracé_219'
                                            data-name='Tracé 219'
                                            d='M988.286,241.616a8.174,8.174,0,1,1,8.174-8.174A8.183,8.183,0,0,1,988.286,241.616Zm0-13.623a5.449,5.449,0,1,0,5.449,5.449A5.456,5.456,0,0,0,988.286,227.993Z'
                                            transform='translate(-980.112 -225.268)'
                                            fill={
                                                inputRef.current?.value
                                                    ?.length !== 0
                                                    ? '#000'
                                                    : '#fff'
                                            }
                                        />
                                        <path
                                            id='Tracé_220'
                                            data-name='Tracé 220'
                                            d='M997.286,243.8a1.352,1.352,0,0,1-.963-.4l-6.812-6.812a1.362,1.362,0,0,1,1.926-1.926l6.812,6.812a1.362,1.362,0,0,1-.963,2.325Z'
                                            transform='translate(-976.851 -222.007)'
                                            fill={
                                                inputRef.current?.value
                                                    ?.length !== 0
                                                    ? '#000'
                                                    : '#fff'
                                            }
                                        />
                                    </g>
                                </svg>

                                <h5
                                    style={{
                                        marginLeft: '20px',
                                    }}
                                >
                                    afficher tous les resultats
                                </h5>
                            </button>
                        </div>
                    )}
                </PredictiveSearchForm>
                <PredictiveSearchResults />
            </div>
        </AsideSearch>
    )
}

function ToggleModal(toggle: any, { cart }: any) {
    return (
        <div
            className='a-third-guid'
            style={{
                backgroundColor: 'unset',
                width: 'unset',
                marginBottom: 'unset',
            }}
        >
            <div className='modal-stickers-close' onClick={toggle.toggle}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                >
                    <path
                        id='Tracé_243'
                        data-name='Tracé 243'
                        d='M16841.295-8037.292l-6.295-6.294-6.295,6.294a.988.988,0,0,1-.705.292.988.988,0,0,1-.705-.292,1,1,0,0,1,0-1.417l6.291-6.292-6.291-6.292a1,1,0,0,1,0-1.416,1,1,0,0,1,1.41,0l6.295,6.294,6.295-6.294a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.416l-6.291,6.292,6.291,6.292a1,1,0,0,1,0,1.417.988.988,0,0,1-.705.292A.988.988,0,0,1,16841.295-8037.292Z'
                        transform='translate(-16827 8053)'
                        fill='#fff'
                    />
                </svg>
            </div>
            <h2>OPTIONS DE LIVRAISON & RETOUR</h2>
            <p>
                Nous avons crée trois catégories d’achats pour nuancer les
                différentes options de retours et remboursement. <br />
                Repérez-les lors de vos achats pour comprendre les modalités de
                renvois/livraison et choisir ce qui vous convient le mieux.
            </p>
            <div
                className='a-third-guid-container a-third-cart'
                style={{
                    borderTop: '2px solid #ffffff60',
                }}
            >
                <div
                    className='a-third-guid-container-item'
                    style={{
                        borderRight: '2px solid #ffffff60',
                    }}
                >
                    <img src='/cart/cartClassic.png' alt='cartClassic' />
                    <p>Panier classique</p>
                    <span>0 - 250€</span>
                    <p>
                        LIVRAISON PAYANTE <br />
                        RETOURS PAYANTS <br />
                        {/*BOOSTER RETOUR* 24H (10 €)*/}
                    </p>
                    <p>Livraison 10€</p>
                </div>
                <div
                    className='a-third-guid-container-item'
                    style={{
                        borderRight: '2px solid #ffffff60',
                    }}
                >
                    <img src='/cart/cartPremium.png' alt='cartClassic' />
                    <p>Panier premium</p>
                    <span>250€ - 500€</span>
                    <p>
                        RÉDUCTION LIVRAISON <br />
                        RETOURS GRATUITS <br />
                        {/*BOOSTER RETOUR* 24H (20 €)*/}
                    </p>
                    <p>Livraison 5€</p>
                </div>
                <div className='a-third-guid-container-item'>
                    <img src='/cart/cartExclusif.png' alt='cartClassic' />
                    <p>Panier premium</p>
                    <span>+500€</span>
                    <p>
                        LIVRAISON GRATUITE <br />
                        RETOURS GRATUITS <br />
                        POCKET ITEM SURPRISE
                        {/*BOOSTER RETOUR* 48H (30 €)*/}
                    </p>
                    <p>Livraison express</p>
                </div>
            </div>
        </div>
    )
}

function TogglePocket({ toggle, children }: any) {
    return <div>{children}</div>
}
