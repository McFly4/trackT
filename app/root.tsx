import { useNonce } from '@shopify/hydrogen'
import { defer, type SerializeFrom, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useMatches,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Link,
} from '@remix-run/react'
import type { CustomerAccessToken } from '@shopify/hydrogen/storefront-api-types'
import favicon from '../public/favicon.ico'
import resetStyles from './styles/reset.css'
import appStyles from './styles/app.css'
import header from './styles/header.css'
import product from './styles/product.css'
import swiper from './styles/swiper.css'
import account from './styles/account.css'
import about from './styles/about.css'
import blog from './styles/blog.css'
import { Layout } from '~/components/Layout'

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({ formMethod, currentUrl, nextUrl }) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true
  }

  return false
}

export function links() {
  return [
    { rel: 'stylesheet', href: resetStyles },
    { rel: 'stylesheet', href: appStyles },
    { rel: 'stylesheet', href: header },
    { rel: 'stylesheet', href: product },
    { rel: 'stylesheet', href: swiper },
    { rel: 'stylesheet', href: account },
    { rel: 'stylesheet', href: about },
    { rel: 'stylesheet', href: blog },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
  ]
}

export const useRootLoaderData = () => {
  const [root] = useMatches()
  return root?.data as SerializeFrom<typeof loader>
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, session, cart } = context
  const customerAccessToken = await session.get('customerAccessToken')
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN

  // validate the customer access token is valid
  const { isLoggedIn, headers } = await validateCustomerAccessToken(session, customerAccessToken)

  // defer the cart query by not awaiting it
  const cartPromise = cart.get()

  // defer the footer query (below the fold)
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
    },
  })

  const footerPromise2 = storefront.query(FOOTER_QUERY2, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footerincontournables', // Adjust to your footer menu handle
    },
  })

  // await the header query (above the fold)
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  })

  const pocketItems = await storefront.query(POCKET_ITEMS)
  const logoTrackt = await storefront.query(LOGO_TRACKT)
  const rightNow = await context.storefront.query(RIGHT_NOW)
  const trendy = await context.storefront.query(TRENDY)

  return defer(
    {
      cart: cartPromise,
      footer: footerPromise,
      footer2: footerPromise2,
      header: await headerPromise,
      isLoggedIn,
      publicStoreDomain,
      pocketItems,
      logoTrackt,
      rightNow,
      trendy,
    },
    { headers }
  )
}

export default function App() {
  const nonce = useNonce()
  const data = useLoaderData<typeof loader>()

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link href='https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap' rel='stylesheet' />

        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...data}>
          <Outlet />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const rootData = useRootLoaderData()
  const nonce = useNonce()
  let errorMessage = 'Unknown error'
  let errorStatus = 500

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data
    errorStatus = error.status
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='error'>
        <video
          muted
          autoPlay
          loop
          playsInline
          style={{
            height: '90%',
          }}
        >
          <source src='/404.mp4' type='video/webm' />
          Chargement ...
        </video>
        <button>
          <Link to='/'>Back home</Link>
        </button>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```js
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 * );
 * ```
 */
async function validateCustomerAccessToken(
  session: LoaderFunctionArgs['context']['session'],
  customerAccessToken?: CustomerAccessToken
) {
  let isLoggedIn = false
  const headers = new Headers()
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return { isLoggedIn, headers }
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime()
  const dateNow = Date.now()
  const customerAccessTokenExpired = expiresAt < dateNow

  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken')
    headers.append('Set-Cookie', await session.commit())
  } else {
    isLoggedIn = true
  }

  return { isLoggedIn, headers }
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const

const FOOTER_QUERY2 = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const

const POCKET_ITEMS = `#graphql
query Collection {
  collection(handle: "PocketItems") {
    products(first: 250) {
      nodes {
        title
          productType
          handle
          vendor
          toothBrush: metafield(namespace: "custom", key: "toothbrush") {
            key
            value
          }
          ooo: metafield(namespace: "custom", key: "outofstock") {
            key
            value
          }
          new: metafield(namespace: "custom", key: "new") {
            key
            value
          }
          ship: metafield(namespace: "custom", key: "fastShip") {
            key
            value
          }
          release: metafield(namespace: "custom", key: "release") {
            key
            value
          }
          promotion: metafield(namespace: "custom", key: "promotion") {
            key
            value
          }
          hotDeal: metafield(namespace: "custom", key: "hotDeal") {
            key
            value
          }
          features: metafield(namespace: "custom", key: "features") {
            key
            value
          }
          box: metafield(namespace: "custom", key: "box_sizing") {
            key
            value
          }
          images(first: 1) {
            nodes {
              url
            }
          }
          variants(first: 1){
          nodes{
            id
            availableForSale
            price {
              amount
            }
          }
        }
      }
    }
  }
}
` as const

const LOGO_TRACKT = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "logo") {
    nodes {
      field(key: "logo") {
        reference {
          ... on Video {
            sources{
              url
            }
          }
        }
      }
    }
  }
}
` as const

const RIGHT_NOW = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "right_now") {
    nodes {
      field(key: "product") {
        references(first: 10) {
          nodes {
            ... on Product {
              id
              title
              handle
              vendor
              images(first: 1) {
                nodes {
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
`

const TRENDY = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "trendy") {
    nodes {
      field(key: "product") {
        references(first: 10) {
          nodes {
            ... on Product {
              id
              title
              handle
              vendor
              images(first: 1) {
                nodes {
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
`
