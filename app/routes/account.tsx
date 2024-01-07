import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import type { CustomerFragment } from 'storefrontapi.generated'
import { useLocation } from '@remix-run/react'

export function shouldRevalidate() {
    return true
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { session, storefront } = context
    const { pathname } = new URL(request.url)
    const navImages = await storefront.query(NAV_IMAGES)
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
                navImages,
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
            { isLoggedIn, isPrivateRoute, isAccountHome, customer, navImages },
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
    const { customer, isPrivateRoute, isAccountHome, navImages } =
        useLoaderData<typeof loader>()

    if (!isPrivateRoute && !isAccountHome) {
        return <Outlet context={{ customer }} />
    }

    return (
        <AccountLayout
            images={navImages}
            customer={customer as CustomerFragment}
        >
            <br />
            <br />
            <Outlet context={{ customer }} />
        </AccountLayout>
    )
}

function AccountLayout({
    customer,
    children,
    images,
}: {
    customer: CustomerFragment
    children: React.ReactNode
    images: any
}) {
    const heading = customer
        ? customer.firstName
            ? `Bienvenue chez vous, ${customer.firstName}`
            : `Bienvenue chez vous.`
        : 'Account Details'

    const location = useLocation()

    return (
        <div className='account'>
            <AccountMenu images={images} />
            <div className='account-head'>
                {location.pathname === '/account/profile' && (
                    <>
                        <h1>{heading}</h1>
                        <p className='account-head-txt'>
                            Votre espace personnel chez Trackt est votre tableau
                            de bord pour tout ce qui vous concerne. Ici, vous
                            pouvez gérer vos informations de livraison, mettre à
                            jour vos détails de contact, et personnaliser vos
                            préférences de communication. C’est l’endroit où
                            vous pouvez garder un œil sur tout.
                            <br />
                            <br />
                            Prenez le contrôle de votre expérience Trackt et
                            rendez-la aussi unique que votre style.
                        </p>
                        <br />
                    </>
                )}

                {children}
            </div>
        </div>
    )
}

function AccountMenu(images: any) {
    function isActiveStyle({
        isActive,
        isPending,
    }: {
        isActive: boolean
        isPending: boolean
    }) {
        return {
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : undefined,
            backdropFilter: isActive ? 'blur(10px)' : undefined,
        }
    }
    const allImages =
        images?.images?.metaobjects?.edges[0]?.node?.fields[0]?.references
            ?.nodes

    function randomImage() {
        if (allImages && allImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * allImages.length)
            const randomImageObject = allImages[randomIndex]
            if (
                randomImageObject &&
                randomImageObject.image &&
                randomImageObject.image.url
            ) {
                return randomImageObject.image.url
            } else {
                return '/account/nav.png'
            }
        } else {
            return '/account/nav.png'
        }
    }

    const randomImageUrl = randomImage()

    return (
        <nav role='navigation' className='account-menu' onClick={randomImage}>
            <img className='account-menu-bg' src={randomImageUrl} />
            <NavLink to='/account/profile' style={isActiveStyle}>
                <p>Mon espace trackt</p>
            </NavLink>
            <NavLink to='/account/orders' style={isActiveStyle}>
                <p>Commandes</p>
            </NavLink>
            <NavLink to='/account/profile' style={isActiveStyle}>
                <p> My best item</p>
            </NavLink>
            <NavLink to='/account/addresses' style={isActiveStyle}>
                <p>Messagerie</p>
            </NavLink>
            <NavLink to='/account/addresses' style={isActiveStyle}>
                <p>Fidélité</p>
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

const NAV_IMAGES = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "account") {
    edges {
      node {
        fields {
          references(first: 20) {
            nodes {
              ... on  MediaImage{
                image{
                  url
                }
              }
            }
          }
        }
      }
    }
  }
}
` as const
