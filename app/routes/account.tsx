import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import type { CustomerFragment } from 'storefrontapi.generated'

export function shouldRevalidate() {
    return true
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { session, storefront } = context
    const { pathname } = new URL(request.url)
    const customerAccessToken = await session.get('customerAccessToken')
    const isLoggedIn = !!customerAccessToken?.accessToken
    const isAccountHome = pathname === '/account' || pathname === '/account/'
    const isPrivateRoute =
        /^\/account\/(orders|orders\/.*|profile|addresses|addresses\/.*)$/.test(
            pathname
        )

    if (!isLoggedIn) {
        if (isPrivateRoute || isAccountHome) {
            session.unset('customerAccessToken')
            return redirect('/account/login', {
                headers: {
                    'Set-Cookie': await session.commit(),
                },
            })
        } else {
            // public subroute such as /account/login...
            return json({
                isLoggedIn: false,
                isAccountHome,
                isPrivateRoute,
                customer: null,
            })
        }
    } else {
        // loggedIn, default redirect to the orders page
        if (isAccountHome) {
            return redirect('/account/orders')
        }
    }

    try {
        const { customer } = await storefront.query(CUSTOMER_QUERY, {
            variables: {
                customerAccessToken: customerAccessToken.accessToken,
                country: storefront.i18n.country,
                language: storefront.i18n.language,
            },
            cache: storefront.CacheNone(),
        })

        if (!customer) {
            throw new Error('Customer not found')
        }

        return json(
            { isLoggedIn, isPrivateRoute, isAccountHome, customer },
            {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
            }
        )
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('There was a problem loading account', error)
        session.unset('customerAccessToken')
        return redirect('/account/login', {
            headers: {
                'Set-Cookie': await session.commit(),
            },
        })
    }
}

export default function Acccount() {
    const { customer, isPrivateRoute, isAccountHome } =
        useLoaderData<typeof loader>()

    if (!isPrivateRoute && !isAccountHome) {
        return <Outlet context={{ customer }} />
    }

    return (
        <AccountLayout customer={customer as CustomerFragment}>
            <br />
            <br />
            <Outlet context={{ customer }} />
        </AccountLayout>
    )
}

function AccountLayout({
    customer,
    children,
}: {
    customer: CustomerFragment
    children: React.ReactNode
}) {
    const heading = customer
        ? customer.firstName
            ? `Bienvenue chez vous, ${customer.firstName}`
            : `Bienvenue chez vous.`
        : 'Account Details'

    return (
        <div className='account'>
            <AccountMenu />

            <div className='account-head'>
                <h1>{heading}</h1>
                <p className='account-head-txt'>
                    Votre espace personnel chez Trackt est votre tableau de bord
                    pour tout ce qui vous concerne. Ici, vous pouvez gérer vos
                    informations de livraison, mettre à jour vos détails de
                    contact, et personnaliser vos préférences de communication.
                    C’est l’endroit où vous pouvez garder un œil sur tout.
                    <br />
                    <br />
                    Prenez le contrôle de votre expérience Trackt et rendez-la
                    aussi unique que votre style.
                </p>
                <br />
                {children}
            </div>
        </div>
    )
}

function AccountMenu() {
    function isActiveStyle({
        isActive,
        isPending,
    }: {
        isActive: boolean
        isPending: boolean
    }) {
        return {
            fontWeight: isActive ? 'bold' : undefined,
            color: isPending ? 'grey' : 'black',
        }
    }

    return (
        <nav role='navigation' className='account-menu'>
            <img className='account-menu-bg' src='/account/nav.png' />
            <NavLink to='/account/profile' style={isActiveStyle}>
                Mon espace trackt
            </NavLink>
            <NavLink to='/account/orders' style={isActiveStyle}>
                Commandes
            </NavLink>
            <NavLink to='/account/profile' style={isActiveStyle}>
                My best item
            </NavLink>
            <NavLink to='/account/addresses' style={isActiveStyle}>
                Messagerie
            </NavLink>
            <NavLink to='/account/addresses' style={isActiveStyle}>
                Fidélité
            </NavLink>
            {/*<Logout />*/}
        </nav>
    )
}

function Logout() {
    return (
        <Form className='account-logout' method='POST' action='/account/logout'>
            &nbsp;<button type='submit'>Sign out</button>
        </Form>
    )
}

export const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    acceptsMarketing
    addresses(first: 6) {
      nodes {
        ...Address
      }
    }
    defaultAddress {
      ...Address
    }
    email
    firstName
    lastName
    numberOfOrders
    phone
  }
  fragment Address on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    country
    province
    city
    zip
    phone
  }
` as const

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/customer
const CUSTOMER_QUERY = `#graphql
  query Customer(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const
