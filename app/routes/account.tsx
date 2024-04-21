import React, { useState, useEffect } from 'react'
import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import type { CustomerFragment } from 'storefrontapi.generated'
import { useLocation } from '@remix-run/react'
import useWindowDimensions from '~/hooks/useWindowDimension'

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
        /^\/account\/(orders|orders\/.*|profile|addresses|mybestitem|addresses\/.*)$/.test(
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

function Acccount() {
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

export default React.memo(Acccount)

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
    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920
    const [isOpen, setIsOpen] = useState(false)

    const toggleDialog = () => {
        setIsOpen(!isOpen)
    }

    const handleOutsideClick = (event: any) => {
        if (event.target === event.currentTarget) {
            toggleDialog()
        }
    }

    return (
        <div className='account'>
            {width > 768 ? (
                <AccountMenu images={images} />
            ) : (
                <AccountMenuResponsive images={images} />
            )}
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
                        <div className='logout' onClick={toggleDialog}>
                            <img src='/account/exit.png' alt='logout' />
                        </div>
                        {isOpen && (
                            <div
                                className='dialog-overlay'
                                onClick={handleOutsideClick}
                            >
                                <div className='dialog'>
                                    <div className='modal-stickers'>
                                        <div
                                            className='modal-stickers-close'
                                            onClick={toggleDialog}
                                        >
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
                                    </div>
                                    <div className='logout-modal'>
                                        <h2>
                                            VOUS ALLEZ VOUS DÉCONNECTER DE
                                            TRACKT
                                        </h2>
                                        <p>
                                            Merci de votre visite sur TrackT !
                                            Vous pourrez retrouver votre espace
                                            perso lors de votre connexion sur
                                            TrackT.
                                        </p>
                                        <div className='modal-content-buttons'>
                                            <Form
                                                method='POST'
                                                action='/account/logout'
                                            >
                                                <button type='submit'>
                                                    se déconnecter
                                                </button>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {children}
            </div>
        </div>
    )
}

function AccountMenuResponsive(images: any) {
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
    const [imageURL, setImageURL] = useState('/account/nav.png')
    const [expanded, setExpanded] = useState(false)

    const toggleExpanded = () => {
        setExpanded(!expanded)
    }

    const location = useLocation()

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

    useEffect(() => {
        setImageURL(randomImage())
    }, [location])

    return (
        <div
            className='responsive-menu'
            style={{
                backgroundImage: `url(${imageURL})`,
                height: expanded ? '100vh' : '75px',
            }}
        >
            {expanded ? (
                <div className='responsive-menu-expanded'>
                    <NavLink to='/account/profile' style={isActiveStyle}>
                        <p>
                            Mon espace trackt
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='17.064'
                                height='10.268'
                                viewBox='0 0 17.064 10.268'
                            >
                                <path
                                    id='Tracé_445'
                                    data-name='Tracé 445'
                                    d='M-13626.686,22648.77l-6.809-6.822a1.72,1.72,0,0,1-.506-1.225,1.709,1.709,0,0,1,.506-1.219,1.745,1.745,0,0,1,2.436-.008l5.592,5.6,5.59-5.594a1.723,1.723,0,0,1,2.436,0,1.7,1.7,0,0,1,.506,1.219,1.712,1.712,0,0,1-.506,1.225l-6.8,6.814a1.732,1.732,0,0,1-1.225.506A1.74,1.74,0,0,1-13626.686,22648.77Z'
                                    transform='translate(13634 -22639)'
                                    fill='#fff'
                                />
                            </svg>
                        </p>
                    </NavLink>
                    <NavLink to='/account/orders' style={isActiveStyle}>
                        <p>Commandes</p>
                    </NavLink>
                    <NavLink to='/account/mybestitem' style={isActiveStyle}>
                        <p> My best item</p>
                    </NavLink>
                    <NavLink to='/account/addresses' style={isActiveStyle}>
                        <p>Adresses</p>
                    </NavLink>
                </div>
            ) : (
                <div
                    className='responsive-menu-unexpanded'
                    onClick={toggleExpanded}
                >
                    <h6>
                        Mon epsace trackt
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='17.064'
                            height='10.268'
                            viewBox='0 0 17.064 10.268'
                            style={{
                                marginLeft: '10px',
                            }}
                        >
                            <path
                                id='Tracé_445'
                                data-name='Tracé 445'
                                d='M-13626.686,22648.77l-6.809-6.822a1.72,1.72,0,0,1-.506-1.225,1.709,1.709,0,0,1,.506-1.219,1.745,1.745,0,0,1,2.436-.008l5.592,5.6,5.59-5.594a1.723,1.723,0,0,1,2.436,0,1.7,1.7,0,0,1,.506,1.219,1.712,1.712,0,0,1-.506,1.225l-6.8,6.814a1.732,1.732,0,0,1-1.225.506A1.74,1.74,0,0,1-13626.686,22648.77Z'
                                transform='translate(13634 -22639)'
                                fill='#fff'
                            />
                        </svg>
                    </h6>
                </div>
            )}
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
            backgroundColor:
                isActive && !isHovered ? 'rgba(255, 255, 255, 0.1)' : undefined,
            backdropFilter: isActive && !isHovered ? 'blur(10px)' : undefined,
        }
    }

    const location = useLocation()

    const allImages =
        images?.images?.metaobjects?.edges[0]?.node?.fields[0]?.references
            ?.nodes

    const [imageURL, setImageURL] = useState('/account/nav.png')
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }
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

    useEffect(() => {
        setImageURL(randomImage())
    }, [location])

    return (
        <nav
            role='navigation'
            className='account-menu'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img className='account-menu-bg' src={imageURL} />
            <NavLink to='/account/profile' style={isActiveStyle}>
                <p>Mon espace trackt</p>
            </NavLink>
            <NavLink to='/account/orders' style={isActiveStyle}>
                <p>Commandes</p>
            </NavLink>
            <NavLink to='/account/mybestitem' style={isActiveStyle}>
                <p> My best item</p>
            </NavLink>
            <NavLink to='/account/addresses' style={isActiveStyle}>
                <p>Adresses</p>
            </NavLink>
            <a href='/about'>
                <p
                    style={{
                        opacity: 0.3,
                    }}
                >
                    Messagerie
                </p>
                <img src='/coming.png' alt='coming soon' />
            </a>
            <a href='/about'>
                <p
                    style={{
                        opacity: 0.3,
                    }}
                >
                    Fidélité
                </p>
                <img
                    src='/coming.png'
                    alt='coming soon'
                    style={{
                        right: '75px',
                    }}
                />
            </a>
        </nav>
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
