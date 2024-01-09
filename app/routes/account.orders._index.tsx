import { Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { Money, Pagination, getPaginationVariables } from '@shopify/hydrogen'
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import type {
    CustomerOrdersFragment,
    OrderItemFragment,
} from 'storefrontapi.generated'
import React, { useRef, useState } from 'react'

export const meta: MetaFunction = () => {
    return [{ title: 'Orders' }]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { session, storefront } = context

    const customerAccessToken = await session.get('customerAccessToken')
    if (!customerAccessToken?.accessToken) {
        return redirect('/account/login')
    }

    const products = await context.storefront.query(TRACKT)

    try {
        const paginationVariables = getPaginationVariables(request, {
            pageBy: 20,
        })

        const { customer } = await storefront.query(CUSTOMER_ORDERS_QUERY, {
            variables: {
                customerAccessToken: customerAccessToken.accessToken,
                country: storefront.i18n.country,
                language: storefront.i18n.language,
                ...paginationVariables,
            },
            cache: storefront.CacheNone(),
        })

        if (!customer) {
            throw new Error('Customer not found')
        }

        return json({ customer, products })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return json({ error: error.message }, { status: 400 })
        }
        return json({ error }, { status: 400 })
    }
}

export default function Orders() {
    const { customer } = useLoaderData<{
        customer: CustomerOrdersFragment
    }>()

    const { orders, numberOfOrders } = customer
    return (
        <div className='orders'>
            <h2>Mes commandes</h2>
            <br />
            {orders.nodes.length ? (
                <OrdersTable orders={orders} />
            ) : (
                <EmptyOrders />
            )}
        </div>
    )
}

function OrdersTable(
    { orders }: Pick<CustomerOrdersFragment, 'orders'>,
    trackT: any
) {
    return (
        <div className='acccount-orders'>
            {orders?.nodes.length ? (
                <Pagination connection={orders}>
                    {({ nodes, isLoading, PreviousLink, NextLink }) => {
                        return (
                            <>
                                <PreviousLink>
                                    {isLoading ? (
                                        'Loading...'
                                    ) : (
                                        <span>↑ Load previous</span>
                                    )}
                                </PreviousLink>
                                {nodes.map((order) => {
                                    return (
                                        <OrderItem
                                            key={order.id}
                                            order={order}
                                        />
                                    )
                                })}
                                <NextLink>
                                    {isLoading ? (
                                        'Loading...'
                                    ) : (
                                        <span>Load more ↓</span>
                                    )}
                                </NextLink>
                            </>
                        )
                    }}
                </Pagination>
            ) : (
                <EmptyOrders />
            )}
        </div>
    )
}

function EmptyOrders() {
    const { products } = useLoaderData<{
        products: any
    }>()
    const gridRef = useRef<HTMLDivElement>(null)
    const [isDragging, setDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setDragging(true)
        setStartX(e.pageX - (gridRef.current?.offsetLeft || 0))
    }

    const handleMouseUp = () => {
        setDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return
        const scrollLeft = e.pageX - startX
        if (gridRef.current) {
            gridRef.current.scrollLeft = scrollLeft
        }
    }

    const scrollGrid = (direction: number) => {
        const scrollAmount = 400 // Ajustez la valeur selon votre préférence
        if (gridRef.current) {
            gridRef.current.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth',
            })
        }
    }
    return (
        <div>
            <div>
                <p>Vous n’avez pas encore passé de commande sur votre compte</p>
                <br />
                <button className='shopnow'>
                    <Link to='/'>Shop now</Link>
                </button>
            </div>
            <div
                style={{
                    marginTop: '50px',
                }}
            >
                <h2>Panel trackt</h2>
                <p
                    style={{
                        marginTop: '15px',
                    }}
                >
                    Découvrez le Panel Trackt, une sélection soigneusement
                    élaborée de ce que le streetwear a de mieux à offrir. Ici,
                    nous rassemblons des pièces uniques, des tendances
                    émergentes et des collaborations exclusives, tout en un seul
                    endroit pour enrichir votre expérience de shopping. Chaque
                    visite au Panel Trackt est une nouvelle aventure. Explorez,
                    découvrez, et laissez-vous inspirer. Bienvenue dans l’avenir
                    du shopping streetwear!
                </p>
            </div>
            <div
                className='trackT'
                style={{
                    margin: '50px 60px 0 0',
                }}
            >
                <div className='trackT-header'>
                    <h2>Panel TrackT</h2>
                    <div className='navigation-buttons'>
                        <button onClick={() => scrollGrid(-1)}>
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
                        <button onClick={() => scrollGrid(1)}>
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
                </div>
                <div
                    className='trackT-grid'
                    ref={gridRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {products?.metaobjects?.nodes[0]?.field?.references?.nodes?.map(
                        (product: any) => (
                            <Link
                                key={product.title}
                                to={`/products/${product.handle}`}
                            >
                                <div className='trackt-grid-product'>
                                    <img
                                        src={product.images.nodes[0].url}
                                        alt={product.title}
                                    />
                                </div>
                                <div className='product-connexe-2'>
                                    <h3>
                                        {product.productType.length > 30
                                            ? product.productType.slice(0, 30) +
                                              '...'
                                            : product.productType}
                                    </h3>
                                    <p>
                                        {product.title.length > 30
                                            ? product.title.slice(0, 30) + '...'
                                            : product.title}
                                    </p>
                                </div>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

function OrderItem({ order }: { order: OrderItemFragment }) {
    const numberOfProducts = order.lineItems.nodes.length
    const images = order.lineItems.nodes
    const imageCount = images?.length || 0
    const numRows = Math.ceil(imageCount / 2)
    const numCols = Math.min(imageCount, 2)
    const gridStyle = {
        display: 'grid',
        gridTemplateRows: `repeat(${numRows}, 1fr)`,
        gridTemplateColumns: `repeat(${numCols}, 1fr)`,
    }

    console.log(images?.map((image: any) => image?.variant?.image?.url))
    return (
        <Link to={`/account/orders/${btoa(order.id)}`}>
            <div className='order'>
                <div className='order-head'>
                    <div className='order-head-image' style={gridStyle}>
                        {images?.map((image, index) => (
                            <div key={index} className='order-head-image-item'>
                                <img
                                    src={image?.variant?.image?.url}
                                    alt={`Image ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='order-head-title'>
                        <p>Commande #{order.orderNumber}</p>
                    </div>
                </div>
                <div className='order-description'>
                    <div className='order-description-item'>
                        <p>Total</p>
                        <p>{order.currentTotalPrice.amount} €</p>
                    </div>
                    <div className='order-description-item'>
                        <p>Détail</p>
                        <p>
                            {numberOfProducts} Article
                            {numberOfProducts > 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className='order-description-item'>
                        <p>Date</p>
                        <p>{new Date(order.processedAt).toDateString()}</p>
                    </div>
                    <div className='order-description-item'>
                        <p>Statut</p>
                        <p>
                            {order.financialStatus === 'PAID'
                                ? 'Commandé'
                                : order.financialStatus}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    currentTotalPrice {
      amount
      currencyCode
    }
    financialStatus
    fulfillmentStatus
    id
    lineItems(first: 10) {
      nodes {
        title
        variant {
          image {
            url
            altText
            height
            width
          }
        }
      }
    }
    orderNumber
    customerUrl
    statusUrl
    processedAt
  }
` as const

export const CUSTOMER_FRAGMENT = `#graphql
  fragment CustomerOrders on Customer {
    numberOfOrders
    orders(
      sortKey: PROCESSED_AT,
      reverse: true,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...OrderItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/customer
const CUSTOMER_ORDERS_QUERY = `#graphql
  ${CUSTOMER_FRAGMENT}
  query CustomerOrders(
    $country: CountryCode
    $customerAccessToken: String!
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerOrders
    }
  }
` as const

const TRACKT = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "home") {
    nodes {
      field(key: "products") {
        references(first: 20) {
          nodes {
            ... on Product {
              title
              productType
              handle
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
` as const
