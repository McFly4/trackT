import { CartForm, Image, Money } from '@shopify/hydrogen'
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types'
import { Link } from '@remix-run/react'
import type { CartApiQueryFragment } from 'storefrontapi.generated'
import { useVariantUrl } from '~/utils'

type CartLine = CartApiQueryFragment['lines']['nodes'][0]

type CartMainProps = {
    cart: CartApiQueryFragment | null
    layout: 'page' | 'aside'
}

export function CartMain({ layout, cart }: CartMainProps) {
    console.log(cart)

    const linesCount = Boolean(cart?.lines?.nodes?.length || 0)
    const withDiscount =
        cart &&
        Boolean(cart.discountCodes.filter((code) => code.applicable).length)
    const className = `cart-main ${withDiscount ? 'with-discount' : ''}`
    return (
        <div className={className}>
            <CartEmpty hidden={linesCount} layout={layout} />
            <CartDetails cart={cart} layout={layout} />
        </div>
    )
}

function CartDetails({ layout, cart }: CartMainProps) {
    const cartHasItems = !!cart && cart.totalQuantity > 0

    return (
        <>
            <h2
                style={{
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    marginBottom: '50px',
                }}
            >
                mes affaires
            </h2>
            <div className='cart-details'>
                <CartLines lines={cart?.lines} layout={layout} />
                {cartHasItems && (
                    <CartSummary cost={cart.cost} layout={layout}>
                        {/*<CartDiscounts discountCodes={cart.discountCodes} />*/}
                        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
                    </CartSummary>
                )}
            </div>
        </>
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
    console.log(merchandise)
    return (
        <div className='cart-line'>
            <div className='cart-line-top'>
                <Image
                    alt={title}
                    src={image?.url}
                    loading='lazy'
                    width={250}
                />
                <div className='cart-line-top-data'>
                    <div
                        style={{
                            marginBottom: '20px',
                        }}
                    >
                        <h4>Taille</h4>
                        <p>
                            {
                                selectedOptions?.filter(
                                    (option) => option.name === 'Size'
                                )?.[0]?.value
                            }
                        </p>
                    </div>
                    <div>
                        <h4>Prix</h4>
                        <CartLinePrice line={line} as='p' />
                    </div>
                </div>
            </div>
            <div className='cart-line-bottom'>
                <h3>{product.title}</h3>
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

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl: string }) {
    if (!checkoutUrl) return null

    return (
        <div className='cart-checkout'>
            <a href={checkoutUrl} target='_self'>
                <p>Passer à la caisse</p>
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
                <dt
                    style={{
                        fontSize: '18px',
                        textTransform: 'uppercase',
                    }}
                >
                    Sous-total
                </dt>
                <dd
                    style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                    }}
                >
                    {cost?.subtotalAmount?.amount ? (
                        <Money data={cost?.subtotalAmount} />
                    ) : (
                        '-'
                    )}
                </dd>
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
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
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
            ? line.cost.totalAmount
            : line.cost.compareAtAmountPerQuantity

    if (moneyV2 == null) {
        return null
    }

    return (
        <div
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
}: {
    hidden: boolean
    layout?: CartMainProps['layout']
}) {
    return (
        <div
            hidden={hidden}
            style={{
                display: hidden ? 'none' : 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <h1
                style={{
                    textTransform: 'uppercase',
                }}
            >
                Pannier vide
            </h1>
            <img
                src='/emptyCart.png'
                alt='panier vide'
                style={{
                    width: 'fit-content',
                    marginTop: '80px',
                }}
            />
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
