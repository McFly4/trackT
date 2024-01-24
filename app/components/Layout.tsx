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
import { Link } from '@remix-run/react'
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
                location.pathname !== '/account/register' && (
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
    return (
        <AsideSearch id='search-aside' heading='SEARCH'>
            <div className='predictive-search'>
                <PredictiveSearchForm>
                    {({ fetchResults, inputRef }) => (
                        <div>
                            <input
                                name='q'
                                onChange={fetchResults}
                                onFocus={fetchResults}
                                placeholder='Search'
                                ref={inputRef}
                                type='search'
                            />
                            &nbsp;
                            <button
                                onClick={() => {
                                    history.go(-1)
                                    window.location.href = `/search?q=${inputRef?.current?.value}`
                                }}
                            >
                                <p>Rechercher</p>
                            </button>
                        </div>
                    )}
                </PredictiveSearchForm>
                <PredictiveSearchResults />
            </div>
        </AsideSearch>
    )
}
