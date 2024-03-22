import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { Money, Image, flattenConnection } from '@shopify/hydrogen'
import type { OrderLineItemFullFragment } from 'storefrontapi.generated'
import React from 'react'
import dayjs from 'dayjs'

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
    const [modalOpen, setModalOpen] = React.useState(false)
    const { order, lineItems, discountValue, discountPercentage } =
        useLoaderData<typeof loader>()
    const numberOfProducts = order.lineItems.nodes.length
    const discountCode = order.discountApplications.nodes[0]?.title || 'NON'
    const cartTotalPrice = order.totalPriceV2.amount
    function toggleModal() {
        setModalOpen(!modalOpen)
    }

    return (
        <div className='account-order'>
            {modalOpen && (
                <div
                    className='dialog-overlay'
                    onClick={() => setModalOpen(false)}
                >
                    <div className='dialog'>
                        <ToggleModal
                            toggle={toggleModal}
                            cart={cartTotalPrice}
                        />
                    </div>
                </div>
            )}
            <div className='account-order-header'>
                <div>
                    <h2>commande {order.name}</h2>
                    <div className='account-order-status'>
                        <h2>Status</h2>
                        <div className='account-order'>
                            status des commandes
                        </div>
                        <div className='account-order-status__content'>
                            <p>
                                <strong>Order Status:</strong>{' '}
                                {order.fulfillmentStatus}
                            </p>
                        </div>
                    </div>

                    <p>
                        <a
                            target='_blank'
                            href={order.statusUrl}
                            rel='noreferrer'
                        >
                            View Order Status →
                        </a>
                    </p>
                </div>
                <div
                    onClick={toggleModal}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '450px',
                    }}
                >
                    {cartTotalPrice <= 250 ? (
                        <img
                            src='/cart/cartClassic.png'
                            alt='panier classic'
                            style={{
                                width: 'fit-content',
                                marginBottom: '50px',
                            }}
                        />
                    ) : cartTotalPrice <= 500 ? (
                        <img
                            src='/cart/cartPremium.png'
                            alt='panier premium'
                            style={{
                                width: 'fit-content',
                                marginBottom: '50px',
                            }}
                        />
                    ) : (
                        <img
                            src='/cart/cartExclusif.png'
                            alt='panier vide'
                            style={{
                                width: 'fit-content',
                                marginBottom: '50px',
                            }}
                        />
                    )}
                </div>
            </div>
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
                    <p>{dayjs(order.processedAt).format('DD/MM/YYYY')}</p>
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
                    <p>{order?.shippingAddress?.formatted}</p>
                </div>
                <div className='order-description-item'>
                    <p>Nom de livraison</p>
                    <p>
                        {order?.shippingAddress?.firstName}{' '}
                        {order?.shippingAddress?.lastName}
                    </p>
                </div>
            </div>
            <OrderLineRow lineItem={lineItems} />
            <div className='order-problem'>
                <h2>Un problème ?</h2>
                <p>
                    Nous savons que parfois, les plans changent. Si vous avez
                    besoin de modifier votre commande ou si vous rencontrez le
                    moindre souci, n’hésitez pas à nous contacter. Notre équipe
                    est à votre disposition pour s’assurer que votre expérience
                    d’achat chez Trackt soit aussi fluide et satisfaisante que
                    possible. Adressez-nous votre problème au mail ci-dessous,
                    et nous nous occuperons du reste !
                </p>
                <span>[Hotline Trackt]</span>
            </div>
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
            {lineItem.lineItem.map((item: any) => {
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
                                <h5>{item.variant?.product?.vendor}</h5>
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

function ToggleModal(toggle: any, { cart }: any) {
    console.log(cart)
    return (
        <div
            className='a-third-guid'
            style={{
                backgroundColor: 'unset',
                width: 'unset',
                marginBottom: 'unset',
            }}
        >
            <div className='modal-stickers-close' onClick={toggle.toggle}>
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
            <h2>OPTIONS DE LIVRAISON & RETOUR</h2>
            <p>
                Nous avons crée trois catégories d’achats pour nuancer les
                différentes options de retours et remboursement. <br />
                Repérez-les lors de vos achats pour comprendre les modalités de
                renvois/livraison et choisir ce qui vous convient le mieux.
            </p>
            <div
                className='a-third-guid-container a-third-cart'
                style={{
                    borderTop: '2px solid #ffffff60',
                }}
            >
                <div
                    className='a-third-guid-container-item'
                    style={{
                        borderRight: '2px solid #ffffff60',
                    }}
                >
                    <img src='/cart/cartClassic.png' alt='cartClassic' />
                    <p>Panier classique</p>
                    <span>0 - 250€</span>
                    <p>
                        LIVRAISON PAYANTE <br />
                        RETOURS GRATUIT <br />
                        {/*BOOSTER RETOUR* 24H (10 €)*/}
                    </p>
                    <p>Livraison 10€ - Retours 10€</p>
                </div>
                <div
                    className='a-third-guid-container-item'
                    style={{
                        borderRight: '2px solid #ffffff60',
                    }}
                >
                    <img src='/cart/cartPremium.png' alt='cartClassic' />
                    <p>Panier premium</p>
                    <span>250€ - 500€</span>
                    <p>
                        LIVRAISON PAYANTE <br />
                        RETOURS GRATUIT <br />
                        {/*BOOSTER RETOUR* 24H (20 €)*/}
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
                        POCKET ITEM SURPRISE
                    </p>
                    <p>Livraison express</p>
                </div>
            </div>
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
      vendor
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
