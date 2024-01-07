import { Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { Money, Pagination, getPaginationVariables } from '@shopify/hydrogen'
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import type {
    CustomerOrdersFragment,
    OrderItemFragment,
} from 'storefrontapi.generated'

export const meta: MetaFunction = () => {
    return [{ title: 'Orders' }]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { session, storefront } = context

    const customerAccessToken = await session.get('customerAccessToken')
    if (!customerAccessToken?.accessToken) {
        return redirect('/account/login')
    }

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

        return json({ customer })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return json({ error: error.message }, { status: 400 })
        }
        return json({ error }, { status: 400 })
    }
}

export default function Orders() {
    const { customer } = useLoaderData<{ customer: CustomerOrdersFragment }>()
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

function OrdersTable({ orders }: Pick<CustomerOrdersFragment, 'orders'>) {
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
        </div>
    )
}

function OrderItem({ order }: { order: OrderItemFragment }) {
    return (
        <>
            <fieldset>
                <Link to={`/account/orders/${order.id}`}>
                    <strong>#{order.orderNumber}</strong>
                </Link>
                <p>{new Date(order.processedAt).toDateString()}</p>
                <p>{order.financialStatus}</p>
                <p>{order.fulfillmentStatus}</p>
                <Money data={order.currentTotalPrice} />
                <Link to={`/account/orders/${btoa(order.id)}`}>
                    View Order →
                </Link>
            </fieldset>
            <br />
        </>
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
