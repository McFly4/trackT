import React, { useEffect, useRef } from 'react'
import { Await } from '@remix-run/react'
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

export type LayoutProps = {
    cart: Promise<CartApiQueryFragment | null>
    children?: React.ReactNode
    footer: Promise<FooterQuery>
    header: HeaderQuery
    isLoggedIn: boolean
}

export function Layout({
    cart,
    children = null,
    footer,
    header,
    isLoggedIn,
}: LayoutProps) {
    const location = useLocation()

    return (
        <>
            <CartAside cart={cart} />
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

function CartAside({ cart }: { cart: LayoutProps['cart'] }) {
    return (
        <Aside id='cart-aside' heading=''>
            <Suspense fallback={<p>Loading cart ...</p>}>
                <Await resolve={cart}>
                    {(cart) => {
                        return <CartMain cart={cart} layout='aside' />
                    }}
                </Await>
            </Suspense>
        </Aside>
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
