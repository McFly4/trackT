import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { Money, Image, flattenConnection } from '@shopify/hydrogen'
import type { OrderLineItemFullFragment } from 'storefrontapi.generated'
import React from 'react'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `Order ${data?.order?.name}` }]
}

export async function loader({ params, context }: LoaderFunctionArgs) {
    const { session, storefront } = context

    if (!params.id) {
        return redirect('/account/orders')
    }

    const orderId = atob(params.id)
    const customerAccessToken = await session.get('customerAccessToken')

    if (!customerAccessToken) {
        return redirect('/account/login')
    }

    const { order } = await storefront.query(CUSTOMER_ORDER_QUERY, {
        variables: { orderId },
    })

    if (!order || !('lineItems' in order)) {
        throw new Response('Order not found', { status: 404 })
    }

    const lineItems = flattenConnection(order.lineItems)
    const discountApplications = flattenConnection(order.discountApplications)

    const firstDiscount = discountApplications[0]?.value

    const discountValue =
        firstDiscount?.__typename === 'MoneyV2' && firstDiscount

    const discountPercentage =
        firstDiscount?.__typename === 'PricingPercentageValue' &&
        firstDiscount?.percentage

    return json({
        order,
        lineItems,
        discountValue,
        discountPercentage,
    })
}

export default function OrderRoute() {
    const { order, lineItems, discountValue, discountPercentage } =
        useLoaderData<typeof loader>()
    const numberOfProducts = order.lineItems.nodes.length
    const discountCode = order.discountApplications.nodes[0]?.title || 'NON'

    return (
        <div className='account-order'>
            <h2>commande {order.name}</h2>
            <div className='account-order-status'>
                <h2>Status</h2>
                <div className='account-order-status__content'>
                    <p>
                        <strong>Order Status:</strong> {order.fulfillmentStatus}
                    </p>
                </div>
            </div>

            <p>
                <a target='_blank' href={order.statusUrl} rel='noreferrer'>
                    View Order Status →
                </a>
            </p>
            <div className='orders-informations'>
                <div className='order-description-item'>
                    <p>Total</p>
                    <p>{order.totalPriceV2.amount} €</p>
                </div>
                <div className='order-description-item'>
                    <p>Détail</p>
                    <p>
                        {numberOfProducts} Article
                        {numberOfProducts > 1 ? 's' : ''}
                    </p>
                </div>
                <div className='order-description-item'>
                    <p>Date commande</p>
                    <p>{new Date(order.processedAt).toDateString()}</p>
                </div>
                <div className='order-description-item'>
                    <p>Status</p>
                    <p>
                        {order.financialStatus === 'PAID'
                            ? 'Commandé'
                            : order.financialStatus}
                    </p>
                </div>
                <div className='order-description-item'>
                    <p>codes promo</p>
                    <p>{discountCode}</p>
                </div>
                <div className='order-description-item'>
                    <p>Adresse de livraison</p>
                    <p>{order.shippingAddress.formatted}</p>
                </div>
                <div className='order-description-item'>
                    <p>Nom de livraison</p>
                    <p>
                        {order.shippingAddress.firstName}{' '}
                        {order.shippingAddress.lastName}
                    </p>
                </div>
            </div>
            <OrderLineRow lineItem={lineItems} />
        </div>
    )
}

function OrderLineRow(lineItem: any) {
    return (
        <div className='order-products'>
            <div className='order-products-header'>
                <h2>Articles commandés</h2>
                <button>options</button>
            </div>
            {lineItem.lineItem.map((item: OrderLineItemFullFragment) => {
                return (
                    <div className='order-product'>
                        <div className='order-head'>
                            <div className='order-head-image'>
                                <img
                                    src={item?.variant?.image?.url}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </div>
                            <div className='order-head-description'>
                                <p>{item.title}</p>
                            </div>
                        </div>
                        <div
                            className='order-description'
                            style={{
                                justifyContent: 'unset',
                            }}
                        >
                            <div className='order-description-item'>
                                <p>Taille</p>
                                <p>{item?.variant?.title.split('/')[0]}</p>
                            </div>
                            <div
                                className='order-description-item'
                                style={{
                                    marginLeft: '100px',
                                }}
                            >
                                <p>Prix</p>
                                <p>{item.originalTotalPrice.amount} €</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Order
const CUSTOMER_ORDER_QUERY = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment AddressFull on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    formatted
    id
    lastName
    name
    phone
    province
    provinceCode
    zip
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...OrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment OrderLineProductVariant on ProductVariant {
    id
    image {
      altText
      height
      url
      id
      width
    }
    price {
      ...OrderMoney
    }
    product {
      handle
    }
    sku
    title
  }
  fragment OrderLineItemFull on OrderLineItem {
    title
    quantity
    discountAllocations {
      allocatedAmount {
        ...OrderMoney
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    originalTotalPrice {
      ...OrderMoney
    }
    discountedTotalPrice {
      ...OrderMoney
    }
    variant {
      ...OrderLineProductVariant
    }
  }
  fragment Order on Order {
    id
    name
    orderNumber
    statusUrl
    processedAt
    fulfillmentStatus
    totalTaxV2 {
      ...OrderMoney
    }
    totalPriceV2 {
      ...OrderMoney
    }
    subtotalPriceV2 {
      ...OrderMoney
    }
    shippingAddress {
      ...AddressFull
    }
    discountApplications(first: 100) {
      nodes {
        ...DiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...OrderLineItemFull
      }
    }
  }
  query Order(
    $country: CountryCode
    $language: LanguageCode
    $orderId: ID!
  ) @inContext(country: $country, language: $language) {
    order: node(id: $orderId) {
      ... on Order {
        ...Order
      }
    }
  }
` as const
