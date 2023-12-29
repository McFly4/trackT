import React, { useState } from 'react'
import { Suspense } from 'react'
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import {
    Await,
    Link,
    useLoaderData,
    type MetaFunction,
    type FetcherWithComponents,
} from '@remix-run/react'
import type {
    ProductFragment,
    ProductVariantsQuery,
    ProductVariantFragment,
} from 'storefrontapi.generated'

import {
    Image,
    Money,
    VariantSelector,
    type VariantOption,
    getSelectedProductOptions,
    CartForm,
} from '@shopify/hydrogen'
import type {
    CartLineInput,
    SelectedOption,
} from '@shopify/hydrogen/storefront-api-types'
import { getVariantUrl } from '~/utils'
import { Swiper, SwiperSlide } from 'swiper/react'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `Hydrogen | ${data?.product.title ?? ''}` }]
}

export async function loader({ params, request, context }: LoaderFunctionArgs) {
    const { handle } = params
    const { storefront } = context

    const selectedOptions = getSelectedProductOptions(request).filter(
        (option) =>
            // Filter out Shopify predictive search query params
            !option.name.startsWith('_sid') &&
            !option.name.startsWith('_pos') &&
            !option.name.startsWith('_psq') &&
            !option.name.startsWith('_ss') &&
            !option.name.startsWith('_v') &&
            // Filter out third party tracking params
            !option.name.startsWith('fbclid')
    )

    if (!handle) {
        throw new Error('Expected product handle to be defined')
    }

    // await the query for the critical product data
    const { product } = await storefront.query(PRODUCT_QUERY, {
        variables: { handle, selectedOptions },
    })

    if (!product?.id) {
        throw new Response(null, { status: 404 })
    }

    const firstVariant = product.variants.nodes[0]
    const firstVariantIsDefault = Boolean(
        firstVariant.selectedOptions.find(
            (option: SelectedOption) =>
                option.name === 'Title' && option.value === 'Default Title'
        )
    )

    if (firstVariantIsDefault) {
        product.selectedVariant = firstVariant
    } else {
        // if no selected variant was returned from the selected options,
        // we redirect to the first variant's url with it's selected options applied
        if (!product.selectedVariant) {
            throw redirectToFirstVariant({ product, request })
        }
    }

    // In order to show which variants are available in the UI, we need to query
    // all of them. But there might be a *lot*, so instead separate the variants
    // into it's own separate query that is deferred. So there's a brief moment
    // where variant options might show as available when they're not, but after
    // this deffered query resolves, the UI will update.
    const variants = storefront.query(VARIANTS_QUERY, {
        variables: { handle },
    })

    return defer({ product, variants })
}

function redirectToFirstVariant({
    product,
    request,
}: {
    product: ProductFragment
    request: Request
}) {
    const url = new URL(request.url)
    const firstVariant = product.variants.nodes[0]

    return redirect(
        getVariantUrl({
            pathname: url.pathname,
            handle: product.handle,
            selectedOptions: firstVariant.selectedOptions,
            searchParams: new URLSearchParams(url.search),
        }),
        {
            status: 302,
        }
    )
}

export default function Product() {
    const { product, variants } = useLoaderData<typeof loader>()
    const { selectedVariant } = product
    return (
        <>
            <div className='product'>
                <ProductImage image={selectedVariant} product={product} />
                <ProductMain
                    selectedVariant={selectedVariant}
                    product={product}
                    variants={variants}
                />
            </div>
        </>
    )
}

function ProductImage({ image, product }: { image: any; product: any }) {
    if (!image) {
        return <div className='product-image' />
    }

    const firstImage = image?.product?.images.nodes[0].url
    const images = image?.product?.images.nodes
    const codeBar = [
        { id: 0, url: '/product/code1.png' },
        { id: 1, url: '/product/code2.png' },
        { id: 2, url: '/product/code3.png' },
        { id: 3, url: '/product/code4.png' },
    ]

    // Maintenant, codeBar est une liste d'objets avec des propriétés id et url.

    const [mainImage, setMainImage] = useState(firstImage || image.url)

    return (
        <div className='product-image'>
            <div className='product-image-title'>
                <h1>{product.vendor}</h1>
                <h2>{product.collections?.nodes[0].title}</h2>
            </div>
            <div className='product-image-main'>
                <img
                    className='product-image-main-absolute tl'
                    alt='top left'
                    src='/product/tl.png'
                />
                <img
                    className='product-image-main-absolute tr'
                    alt='top right'
                    src='/product/tr.png'
                />
                <img
                    className='product-image-main-absolute bl'
                    alt='bottom left'
                    src='/product/bl.png'
                />
                <img
                    className='product-image-main-absolute br'
                    alt='bottom right'
                    src='/product/br.png'
                />

                <Image
                    alt={image.altText as any}
                    height={image.height as any}
                    src={mainImage}
                    width={image.width as any}
                />
            </div>
            <div className='product-image-list'>
                {images.map((image: any, index: number) => (
                    <div
                        key={image.id}
                        className='product-image-list-item'
                        onClick={() => setMainImage(image.url)}
                    >
                        <img src={image.url} alt={image.altText} />
                        <img
                            src={codeBar[index].url}
                            alt='code bar'
                            className='product-image-list-item-code'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

function ProductMain({
    selectedVariant,
    product,
    variants,
}: {
    product: ProductFragment
    selectedVariant: ProductFragment['selectedVariant']
    variants: Promise<ProductVariantsQuery>
}) {
    const { title, descriptionHtml } = product
    console.log(product)
    return (
        <div className='product-main'>
            <h1>{title}</h1>
            <div className='product-main-head'>
                <ProductPrice selectedVariant={selectedVariant} />
                <Suspense
                    fallback={
                        <ProductForm
                            product={product}
                            selectedVariant={selectedVariant}
                            variants={[]}
                        />
                    }
                >
                    <Await
                        errorElement='There was a problem loading product variants'
                        resolve={variants}
                    >
                        {(data) => (
                            <ProductForm
                                product={product}
                                selectedVariant={selectedVariant}
                                variants={data.product?.variants.nodes || []}
                            />
                        )}
                    </Await>
                </Suspense>
            </div>
            <div className='product-main-features'></div>

            {/*<p>*/}
            {/*    <strong>Description</strong>*/}
            {/*</p>*/}
            {/*<div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />*/}
        </div>
    )
}

function ProductPrice({ selectedVariant }: { selectedVariant: any }) {
    const size = selectedVariant?.selectedOptions?.find(
        (option: any) => option.name === 'Size'
    )?.value

    return (
        <div className='product-price'>
            <h2>Price</h2>
            {selectedVariant?.compareAtPrice ? (
                <>
                    <p>Sale</p>
                    <br />
                    <div className='product-price-on-sale'>
                        {selectedVariant ? (
                            <Money data={selectedVariant.price} />
                        ) : null}
                        <s>
                            <Money data={selectedVariant.compareAtPrice} />
                        </s>
                    </div>
                </>
            ) : (
                selectedVariant?.price && (
                    <div className='product-price-container'>
                        <img src={`/product/size/${size}.png`} alt='price' />
                        <Money data={selectedVariant?.price} />
                    </div>
                )
            )}
            <AddToCartButton
                disabled={!selectedVariant || !selectedVariant.availableForSale}
                onClick={() => {
                    window.location.href = window.location.href + '#cart-aside'
                }}
                lines={
                    selectedVariant
                        ? [
                              {
                                  merchandiseId: selectedVariant.id,
                                  quantity: 1,
                              },
                          ]
                        : []
                }
            >
                {selectedVariant?.availableForSale
                    ? 'Ajouter au panier'
                    : 'Sold out'}
            </AddToCartButton>
        </div>
    )
}

function ProductForm({
    product,
    selectedVariant,
    variants,
}: {
    product: ProductFragment
    selectedVariant: ProductFragment['selectedVariant']
    variants: Array<ProductVariantFragment>
}) {
    return (
        <div className='product-form'>
            <VariantSelector
                handle={product.handle}
                options={product.options}
                variants={variants}
            >
                {({ option }) => (
                    <ProductOptions key={option.name} option={option} />
                )}
            </VariantSelector>
            <br />
        </div>
    )
}

function ProductOptions({ option }: { option: VariantOption }) {
    // Tri alphabétique des valeurs
    const sortedValues = option.values
        .slice()
        .sort((a, b) => a.value.localeCompare(b.value))

    const midle = Math.ceil(sortedValues.length / 2)

    return (
        <div className='product-options' key={option.name}>
            <h2>Taille</h2>
            <div className='product-options-grid'>
                <Swiper
                    slidesPerView={5}
                    grabCursor={true}
                    centeredSlides={true}
                    initialSlide={midle}
                >
                    {sortedValues.map(
                        ({ value, isAvailable, isActive, to }) => (
                            <SwiperSlide key={option.name + value}>
                                {({ isActive, isPrev, isNext }) => (
                                    <Link
                                        className='product-options-item'
                                        prefetch='intent'
                                        preventScrollReset
                                        replace
                                        to={to}
                                        style={{
                                            transition: 'all 0.3s ease',
                                            fontSize: isActive
                                                ? '40px'
                                                : isPrev || isNext
                                                ? '24px'
                                                : '15px',
                                        }}
                                    >
                                        {value}
                                    </Link>
                                )}
                            </SwiperSlide>
                        )
                    )}
                </Swiper>
            </div>
            <button className='sizes-guid'>Guide des tailles</button>
        </div>
    )
}

function AddToCartButton({
    analytics,
    children,
    disabled,
    lines,
    onClick,
}: {
    analytics?: unknown
    children: React.ReactNode
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
                        onClick={onClick}
                        disabled={disabled ?? fetcher.state !== 'idle'}
                    >
                        {children}
                    </button>
                </>
            )}
        </CartForm>
    )
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
      images(first: 5) {
        nodes {
          id
          altText
          width
          height
          url
        }
      }
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }

    
  }
` as const

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
    metafield1: metafield(namespace: "custom", key: "feature") {
      key
      value
    }
    metafield2: metafield(namespace: "custom", key: "nike") {
      key
      value
    }
    collections(first: 1){
        nodes{
            title
        }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const
