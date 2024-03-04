import React, { useEffect, useRef, useState } from 'react'
import { Await, FetcherWithComponents } from '@remix-run/react'
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
    PredictiveSearchForm,
    PredictiveSearchResults,
} from '~/components/Search'
import { AsideSearch } from './AsideSearch'
import { useLocation } from '@remix-run/react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'
import MainProduct from '~/components/Common/mainProduct'
import type { CartLineInput } from '@shopify/hydrogen/storefront-api-types'
import { CartForm } from '@shopify/hydrogen'

export type LayoutProps = {
    cart: Promise<CartApiQueryFragment | null>
    children?: React.ReactNode
    footer: Promise<FooterQuery>
    header: HeaderQuery
    isLoggedIn: boolean
    pocketItems: any
}

export function Layout({
    cart,
    children = null,
    footer,
    header,
    isLoggedIn,
    pocketItems,
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
            {location.pathname !== '/account/login' &&
                location.pathname !== '/filters' &&
                location.pathname !== '/account/register' &&
                location.pathname !== '/account/recover' &&
                !location.pathname.startsWith('/account/reset') && (
                    <Header
                        header={header}
                        cart={cart}
                        isLoggedIn={isLoggedIn}
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

    // const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    //     if (e.target === e.currentTarget) {
    //         setIsModalOpen(false)
    //     }
    // }
    //
    // const handleOutsideClickPocket = (e: React.MouseEvent<HTMLDivElement>) => {
    //     if (e.target === e.currentTarget) {
    //         setIsPocketOpen(false)
    //     }
    // }
    console.log(pocket[0]?.variants?.nodes[0]?.id)
    return (
        <>
            {isModalOpen && (
                <div
                    className='dialog-overlay'
                    onClick={() => toggleModal(false)}
                >
                    <div className='dialog'>
                        <ToggleModal toggle={toggleModal} />
                    </div>
                </div>
            )}
            {isPocketOpen && (
                <div className='dialog-overlay'>
                    <div className='dialog'>
                        <TogglePocket toggle={togglePocket}>
                            {' '}
                            <Swiper
                                modules={[Scrollbar]}
                                scrollbar={{
                                    hide: false,
                                }}
                                watchSlidesProgress={true}
                                slidesPerGroup={2}
                                slidesPerView={4}
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
                                        className='product-price'
                                    >
                                        <p>{item.title}</p>

                                        <AddToCartButton
                                            lines={[
                                                {
                                                    merchandiseId:
                                                        item.variants.nodes[0]
                                                            .id,
                                                    quantity: 1,
                                                },
                                            ]}
                                            children='Ajouter au panier' // Vous n'avez pas besoin de spécifier children comme une prop, vous pouvez le mettre directement ici
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
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
                                />
                            )
                        }}
                    </Await>
                </Suspense>
            </Aside>
        </>
    )
}

function AddToCartButton({
    analytics,
    children,
    disabled,
    lines,
    onClick,
}: {
    analytics?: unknown
    children: React.ReactNode
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
                        {children}
                    </button>
                </>
            )}
        </CartForm>
    )
}

function SearchAside() {
    // Déclarez une référence pour l'élément input
    const inputRef = useRef<HTMLInputElement | null>(null)

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
                            />
                            &nbsp;
                            <button
                                onClick={() => {
                                    history.go(-1)
                                    window.location.href = `/search?q=${inputRef?.current?.value}`
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '500px',
                                }}
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
                                            fill='#fff'
                                        />
                                        <path
                                            id='Tracé_220'
                                            data-name='Tracé 220'
                                            d='M997.286,243.8a1.352,1.352,0,0,1-.963-.4l-6.812-6.812a1.362,1.362,0,0,1,1.926-1.926l6.812,6.812a1.362,1.362,0,0,1-.963,2.325Z'
                                            transform='translate(-976.851 -222.007)'
                                            fill='#fff'
                                        />
                                    </g>
                                </svg>

                                <h5
                                    style={{
                                        marginLeft: '20px',
                                    }}
                                >
                                    afficher tout les resultats
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

function ToggleModal(toggle: any) {
    return (
        <div
            className='a-third-guid'
            style={{
                backgroundColor: 'unset',
                width: 'unset',
            }}
        >
            <h2>OPTIONS DE LIVRAISON & RETOUR</h2>
            <p>
                Nous avons crée trois catégories d’achats pour nuancer les
                différentes options de retours et remboursement. <br />
                Repérez-les lors de vos achats pour comprendre les modalités de
                renvois/livraison et choisir ce qui vous convient le mieux.
            </p>
            <div className='a-third-guid-container a-third-cart'>
                <div className='a-third-guid-container-item'>
                    <img src='/cart/cartClassic.png' alt='cartClassic' />
                    <p>Panier classique</p>
                    <span>0 - 250€</span>
                    <p>
                        LIVRAISON PAYANTE <br />
                        RETOURS GRATUIT <br />
                        BOOSTER RETOUR* 24H (10 €)
                    </p>
                    <p>Livraison 10€</p>
                </div>
                <div className='a-third-guid-container-item'>
                    <img src='/cart/cartPremium.png' alt='cartClassic' />
                    <p>Panier premium</p>
                    <span>250€ - 500€</span>
                    <p>
                        LIVRAISON PAYANTE <br />
                        RETOURS GRATUIT <br />
                        BOOSTER RETOUR* 24H (20 €)
                    </p>
                    <p>Livraison 5€</p>
                </div>
                <div className='a-third-guid-container-item'>
                    <img src='/cart/cartExclusif.png' alt='cartClassic' />
                    <p>Panier premium</p>
                    <span>+500€</span>
                    <p>
                        LIVRAISON GRATUITE <br />
                        RETOURS GRATUIT <br />
                        BOOSTER RETOUR* 48H (30 €)
                    </p>
                    <p>Livraison express</p>
                </div>
            </div>
        </div>
    )
}

function TogglePocket({ toggle, children }: any) {
    return (
        <div className='modal-stickers-overlay'>
            <div className='modal-stickers'>{children}</div>
        </div>
    )
}
