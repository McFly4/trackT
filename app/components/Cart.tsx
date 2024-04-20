import { CartForm, Image, Money } from '@shopify/hydrogen'
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types'
import type { CartApiQueryFragment } from 'storefrontapi.generated'
import { useVariantUrl } from '~/utils'
import React, { useState } from 'react'
import { FetcherWithComponents, Link } from '@remix-run/react'
import useWindowDimension from '~/hooks/useWindowDimension'
import Crowns from '~/components/Common/Modals/Crowns'
import type { CartLineInput } from '@shopify/hydrogen/storefront-api-types'

type CartLine = CartApiQueryFragment['lines']['nodes'][0]

type CartMainProps = {
    cart: CartApiQueryFragment | null
    layout: 'page' | 'aside'
}

export function CartMain({
    layout,
    cart,
    isModalOpen,
    isPocketOpen,
    onToggleModal,
    onTogglePocket,
    pocketItems,
}: any) {
    const linesCount = Boolean(cart?.lines?.nodes?.length || 0)
    const withDiscount =
        cart &&
        Boolean(
            cart.discountCodes.filter((code: any) => code.applicable).length
        )
    const className = `cart-main ${withDiscount ? 'with-discount' : ''}`
    const cartHasItems = !!cart && cart.totalQuantity > 0
    const cartTotalPrice = cart?.cost?.totalAmount?.amount as any
    const [isValid, setIsValid] = useState(false)
    const [crown, setCrown] = useState(false)
    const [openPocket, setOpenPocket] = useState(false)
    const useWidth = useWindowDimension()
    const width = useWidth.width || 1920
    const pocketProducts = pocketItems?.collection?.products?.nodes.slice(0, 19)
    const toggleModal = () => {
        onToggleModal(!isModalOpen)
    }

    const toggleResponsivePocket = () => {
        setOpenPocket(!openPocket)
    }

    const togglePocket = () => {
        onTogglePocket(!isPocketOpen)
        setIsValid(true)
    }

    const openCrown = () => {
        setCrown(true)
    }

    const closeCrown = () => {
        setCrown(false)
    }

    return (
        <>
            {crown && <Crowns isOpen={openCrown} onClose={closeCrown} />}
            {openPocket && (
                <div className='res-pocket'>
                    <h2>Pocket items</h2>
                    <p>
                        Ajoutez quelques items pour atteindre la couronne
                        supérieure.
                    </p>
                    <div className='res-pocket-items'>
                        {pocketProducts?.map((item: any, index: number) => (
                            <div
                                key={index}
                                style={{
                                    padding: '15px',
                                    position: 'relative',
                                }}
                                className={`pocket-items-product ${
                                    item.variants.nodes[0].availableForSale
                                        ? ''
                                        : 'pocketItemOOO'
                                }`}
                            >
                                <AddToCartButton
                                    disabled={
                                        !item.variants.nodes[0].availableForSale
                                    }
                                    lines={[
                                        {
                                            merchandiseId:
                                                item.variants.nodes[0].id,
                                            quantity: 1,
                                        },
                                    ]}
                                />
                                <div
                                    className='pocket-items-product-img'
                                    onClick={() => {
                                        window.location.href = `/products/${item.handle}`
                                    }}
                                >
                                    {!item.variants.nodes[0]
                                        .availableForSale && (
                                        <span>Sold out</span>
                                    )}{' '}
                                    <img
                                        src={item.images.nodes[0].url}
                                        className='pocket-items-product-img-main'
                                        style={{
                                            objectFit:
                                                item?.box?.value == '4:5' ||
                                                item?.box?.value == '1:1'
                                                    ? 'contain'
                                                    : 'cover',
                                        }}
                                    />
                                    <img
                                        src={
                                            '/cart/pocket/' +
                                            (index % 8) +
                                            '.png'
                                        }
                                        className='pocket-items-product-img-price'
                                    />
                                    <p>
                                        +
                                        {
                                            item.variants.nodes[0].price.amount.split(
                                                '.'
                                            )[0]
                                        }
                                        €
                                    </p>
                                </div>
                                <div
                                    style={{
                                        width: '150px',
                                    }}
                                >
                                    <h4 className='p-title'>
                                        {item.vendor?.length > 20
                                            ? item.vendor.slice(0, 19) + '...'
                                            : item.vendor}
                                    </h4>
                                    <h6 className='p-title'>
                                        {item.title?.length > 18
                                            ? item.title.slice(0, 18) + '...'
                                            : item.title}
                                    </h6>
                                </div>
                                {/*<AddToCartButton*/}
                                {/*    disabled={*/}
                                {/*        !item.variants.nodes[0].availableForSale*/}
                                {/*    }*/}
                                {/*    lines={[*/}
                                {/*        {*/}
                                {/*            merchandiseId:*/}
                                {/*                item.variants.nodes[0].id,*/}
                                {/*            quantity: 1,*/}
                                {/*        },*/}
                                {/*    ]}*/}
                                {/*/>*/}
                            </div>
                        ))}
                    </div>
                    <div className='res-pocket-footer'>
                        {cartTotalPrice <= 250 ? (
                            <img
                                src='/cart/cartClassic.png'
                                alt='panier classic'
                            />
                        ) : cartTotalPrice <= 500 ? (
                            <img
                                src='/cart/cartPremium.png'
                                alt='panier premium'
                            />
                        ) : (
                            <img
                                src='/cart/cartExclusif.png'
                                alt='panier vide'
                            />
                        )}
                        <div className='res-pocket-footer-prices'>
                            <h5>SOUS-TOTAL</h5>
                            <h2>{cartTotalPrice} €</h2>
                        </div>
                        <ResponsiveCheckout checkoutUrl={cart.checkoutUrl} />
                    </div>
                </div>
            )}

            <div className={className}>
                <CartEmpty
                    hidden={linesCount}
                    layout={layout}
                    isModalOpen={isModalOpen}
                    toggle={width > 768 ? toggleModal : ''}
                />
                {linesCount && (
                    <div
                        onClick={width > 768 ? toggleModal : openCrown}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: width > 768 ? '450px' : '100%',
                        }}
                    >
                        {cartTotalPrice <= 250 ? (
                            <img
                                src='/cart/cartClassic.png'
                                alt='panier classic'
                                style={{
                                    width:
                                        width > 768 ? 'fit-content' : '150px',
                                    marginBottom: width > 768 ? '50px' : '30px',
                                }}
                            />
                        ) : cartTotalPrice <= 500 ? (
                            <img
                                src='/cart/cartPremium.png'
                                alt='panier premium'
                                style={{
                                    width:
                                        width > 768 ? 'fit-content' : '150px',
                                    marginBottom: width > 768 ? '50px' : '30px',
                                }}
                            />
                        ) : (
                            <img
                                src='/cart/cartExclusif.png'
                                alt='panier vide'
                                style={{
                                    width:
                                        width > 768 ? 'fit-content' : '150px',
                                    marginBottom: width > 768 ? '50px' : '30px',
                                }}
                            />
                        )}
                        <h4
                            style={{
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                marginBottom: '50px',
                            }}
                        >
                            mes affaires
                        </h4>
                    </div>
                )}
                <div className='cart-details'>
                    <CartLines lines={cart?.lines} layout={layout} />
                    {cartHasItems && (
                        <CartSummary cost={cart.cost} layout={layout}>
                            {/*<CartDiscounts discountCodes={cart.discountCodes} />*/}
                            {isValid ? (
                                <CartCheckoutActions
                                    checkoutUrl={cart.checkoutUrl}
                                />
                            ) : (
                                <div
                                    onClick={
                                        width > 768
                                            ? togglePocket
                                            : toggleResponsivePocket
                                    }
                                >
                                    <div className='cart-checkout'>
                                        <a>
                                            <h6>Passer à la caisse</h6>
                                        </a>
                                        <br />
                                    </div>
                                </div>
                            )}
                        </CartSummary>
                    )}
                </div>
            </div>
        </>
    )
}

function AddToCartButton({
    analytics,
    disabled,
    lines,
    onClick,
}: {
    analytics?: unknown
    disabled?: boolean
    lines: CartLineInput[]
    onClick?: () => void
}) {
    return (
        <CartForm
            route='/cart'
            inputs={{ lines }}
            action={CartForm.ACTIONS.LinesAdd}
        >
            {(fetcher: FetcherWithComponents<any>) => (
                <>
                    <input
                        name='analytics'
                        type='hidden'
                        value={JSON.stringify(analytics)}
                    />
                    <button
                        type='submit'
                        className='res-pocket-items-add'
                        onClick={onClick}
                        disabled={disabled ?? fetcher.state !== 'idle'}
                    >
                        <img src='/icons/plus.svg' alt='add' />
                    </button>
                </>
            )}
        </CartForm>
    )
}

function CartLines({
    lines,
    layout,
}: {
    layout: CartMainProps['layout']
    lines: CartApiQueryFragment['lines'] | undefined
}) {
    if (!lines) return null
    return (
        <div aria-labelledby='cart-lines'>
            <ul>
                {lines.nodes.map((line) => (
                    <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
            </ul>
        </div>
    )
}

function CartLineItem({
    layout,
    line,
}: {
    layout: CartMainProps['layout']
    line: CartLine
}) {
    const { id, merchandise } = line
    const { product, title, image, selectedOptions } = merchandise
    const lineItemUrl = useVariantUrl(product.handle, selectedOptions)
    return (
        <div className='cart-line'>
            <div className='cart-line-top'>
                <Image
                    alt={title}
                    src={image?.url}
                    loading='lazy'
                    width={250}
                    style={{
                        objectFit: 'contain',
                        backgroundColor: '#fff',
                    }}
                    onClick={() => {
                        window.location.href = lineItemUrl
                    }}
                />
                <div className='cart-line-top-data'>
                    <div
                        style={{
                            marginBottom: '20px',
                        }}
                    >
                        <h6>Taille</h6>
                        <h4>
                            {
                                selectedOptions?.filter(
                                    (option) =>
                                        option.name === 'Size' ||
                                        option.name === 'Taille' ||
                                        option.name === 'size'
                                )?.[0]?.value
                            }
                        </h4>
                    </div>
                    <div>
                        <h6>Prix</h6>
                        <CartLinePrice line={line} as='p' />
                    </div>
                </div>
            </div>
            <div className='cart-line-bottom'>
                <h6>{product.title}</h6>
                <CartLineQuantity line={line} />
            </div>
            <div
                style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: '#212121',
                    marginTop: '35px',
                    marginBottom: '50px',
                }}
            ></div>
        </div>
    )
}

function ResponsiveCheckout({ checkoutUrl }: { checkoutUrl: string }) {
    if (!checkoutUrl) return null

    return (
        <a
            href={checkoutUrl}
            target='_self'
            style={{
                textAlign: 'center',
            }}
        >
            <button>RÉCAPITULATIF ET PAIEMENT</button>
        </a>
    )
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl: string }) {
    if (!checkoutUrl) return null

    return (
        <div className='cart-checkout'>
            <a href={checkoutUrl} target='_self'>
                <h6>Valider le panier</h6>
            </a>
            <br />
        </div>
    )
}

export function CartSummary({
    cost,
    layout,
    children = null,
}: {
    children?: React.ReactNode
    cost: CartApiQueryFragment['cost']
    layout: CartMainProps['layout']
}) {
    const className =
        layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside'

    return (
        <div aria-labelledby='cart-summary' className={className}>
            <dl className='cart-subtotal'>
                <h5
                    style={{
                        fontSize: '18px',
                        textTransform: 'uppercase',
                    }}
                >
                    Sous-total
                </h5>
                <h3>
                    {cost?.subtotalAmount?.amount ? (
                        <Money data={cost?.subtotalAmount} />
                    ) : (
                        '-'
                    )}
                </h3>
            </dl>
            {children}
        </div>
    )
}

function CartLineRemoveButton({ lineIds }: { lineIds: string[] }) {
    return (
        <CartForm
            route='/cart'
            action={CartForm.ACTIONS.LinesRemove}
            inputs={{ lineIds }}
        >
            <button
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 'unset !important',
                }}
                type='submit'
            >
                <p
                    style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        color: 'red',
                    }}
                >
                    supprimer
                </p>
            </button>
        </CartForm>
    )
}

function CartLineQuantity({ line }: { line: CartLine }) {
    if (!line || typeof line?.quantity === 'undefined') return null
    const { id: lineId, quantity } = line
    const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0))
    const nextQuantity = Number((quantity + 1).toFixed(0))

    return (
        <div className='cart-line-quantiy'>
            {/*<small>Quantity: {quantity} &nbsp;&nbsp;</small>*/}
            {/*<CartLineUpdateButton*/}
            {/*    lines={[{ id: lineId, quantity: prevQuantity }]}*/}
            {/*>*/}
            {/*    <button*/}
            {/*        aria-label='Decrease quantity'*/}
            {/*        disabled={quantity <= 1}*/}
            {/*        name='decrease-quantity'*/}
            {/*        value={prevQuantity}*/}
            {/*    >*/}
            {/*        <span>&#8722; </span>*/}
            {/*    </button>*/}
            {/*</CartLineUpdateButton>*/}
            {/*&nbsp;*/}
            {/*<CartLineUpdateButton*/}
            {/*    lines={[{ id: lineId, quantity: nextQuantity }]}*/}
            {/*>*/}
            {/*    <button*/}
            {/*        aria-label='Increase quantity'*/}
            {/*        name='increase-quantity'*/}
            {/*        value={nextQuantity}*/}
            {/*    >*/}
            {/*        <span>&#43;</span>*/}
            {/*    </button>*/}
            {/*</CartLineUpdateButton>*/}
            {/*&nbsp;*/}
            <CartLineRemoveButton lineIds={[lineId]} />
        </div>
    )
}

function CartLinePrice({
    line,
    priceType = 'regular',
    ...passthroughProps
}: {
    line: CartLine
    priceType?: 'regular' | 'compareAt'
    [key: string]: any
}) {
    if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null

    const moneyV2 =
        priceType === 'regular'
            ? line.cost.amountPerQuantity
            : line.cost.compareAtAmountPerQuantity

    if (moneyV2 == null) {
        return null
    }

    return (
        <div
            className='cart-line-price'
            style={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Money
                withoutCurrency
                withoutTrailingZeros
                {...passthroughProps}
                data={moneyV2}
            />{' '}
            €
        </div>
    )
}

export function CartEmpty({
    hidden = false,
    layout = 'aside',
    isModalOpen,
    toggle,
}: {
    hidden: any
    layout?: any
    toggle?: any
    isModalOpen: any
}) {
    const useWidth = useWindowDimension()
    const width = useWidth.width || 1920
    const toggleModal = () => {
        toggle(!isModalOpen)
    }
    const [crown, setCrown] = useState(false)

    const openCrown = () => {
        setCrown(true)
    }

    const closeCrown = () => {
        setCrown(false)
    }

    return (
        <div
            hidden={hidden}
            style={{
                display: hidden ? 'none' : 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                marginLeft: width > 768 ? '85px' : '0',
            }}
        >
            {crown && <Crowns isOpen={openCrown} onClose={closeCrown} />}

            <div onClick={width > 768 ? toggleModal : openCrown}>
                <img
                    src='/cart/cartEmpty.png'
                    alt='panier vide'
                    style={{
                        width: 'fit-content',
                        marginBottom: '50px',
                    }}
                />
            </div>
            <h1
                style={{
                    textTransform: 'uppercase',
                    fontSize: width > 768 ? '' : '35px',
                }}
            >
                Panier vide
            </h1>
        </div>
    )
}

function CartDiscounts({
    discountCodes,
}: {
    discountCodes: CartApiQueryFragment['discountCodes']
}) {
    const codes: string[] =
        discountCodes
            ?.filter((discount) => discount.applicable)
            ?.map(({ code }) => code) || []

    return (
        <div>
            {/* Have existing discount, display it with a remove option */}
            <dl hidden={!codes.length}>
                <div>
                    <dt>Discount(s)</dt>
                    <UpdateDiscountForm>
                        <div className='cart-discount'>
                            <code>{codes?.join(', ')}</code>
                            &nbsp;
                            <button>Remove</button>
                        </div>
                    </UpdateDiscountForm>
                </div>
            </dl>

            {/* Show an input to apply a discount */}
            <UpdateDiscountForm discountCodes={codes}>
                <div>
                    <input
                        type='text'
                        name='discountCode'
                        placeholder='Discount code'
                    />
                    &nbsp;
                    <button type='submit'>Apply</button>
                </div>
            </UpdateDiscountForm>
        </div>
    )
}

function UpdateDiscountForm({
    discountCodes,
    children,
}: {
    discountCodes?: string[]
    children: React.ReactNode
}) {
    return (
        <CartForm
            route='/cart'
            action={CartForm.ACTIONS.DiscountCodesUpdate}
            inputs={{
                discountCodes: discountCodes || [],
            }}
        >
            {children}
        </CartForm>
    )
}

function CartLineUpdateButton({
    children,
    lines,
}: {
    children: React.ReactNode
    lines: CartLineUpdateInput[]
}) {
    return (
        <CartForm
            route='/cart'
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{ lines }}
        >
            {children}
        </CartForm>
    )
}
