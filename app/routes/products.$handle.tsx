import React, { useRef, useState, useEffect } from 'react'
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
import MainProduct from '~/components/Common/mainProduct'
import TrackT from '~/components/Common/TrackT'
import { Scrollbar, Grid } from 'swiper/modules'

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

    const products = await context.storefront.query(TRACKT)

    return defer({
        product,
        variants,
        products,
    })
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
    const { product, variants, products } = useLoaderData<typeof loader>()
    const { selectedVariant } = product
    const productsList =
        products?.metaobjects?.nodes[0]?.field?.references?.nodes

    // useEffect(() => {
    //     if (typeof window === 'undefined') {
    //         return
    //     }
    //
    //     const MAX_ITEMS = 15
    //
    //     const productList = localStorage.getItem('productList') as any
    //
    //     const productListArray = productList
    //         ? JSON.parse(productList)
    //         : ([] as any)
    //
    //     if (productListArray.includes(product.id)) {
    //         return
    //     }
    //
    //     const updatedProductList = [
    //         product.id,
    //         ...productListArray.slice(0, MAX_ITEMS - 1),
    //     ]
    //
    //     localStorage.setItem('productList', JSON.stringify(updatedProductList))
    // }, [product.id])

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
            <div className='productBanner'>
                <video width='100%' height='auto' autoPlay muted loop>
                    <source src='/product/banner.mp4' type='video/mp4' />
                    <img src='/product/banner.png' alt='banner' />
                </video>
            </div>

            <TrackT products={productsList} />
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
    const productsFromCollection = product?.collections?.nodes[0].products.nodes
    const swiperRef = useRef<any>(null)

    const nexto = () => {
        swiperRef.current?.slideNext()
    }

    const previo = () => {
        swiperRef.current?.slidePrev()
    }

    return (
        <div className='product-image-container'>
            <div className='product-image'>
                <div className='product-image-title'>
                    <h1>{product.vendor}</h1>
                    <h2>
                        {product.collections?.nodes[0].title === 'All'
                            ? ''
                            : product.collections?.nodes[0].title}
                    </h2>
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
            <div
                className='trackT'
                style={{
                    margin: 'unset',
                    marginTop: '50px',
                }}
            >
                <div className='trackT-header'>
                    <h2>Panel trackt</h2>
                    <div className='navigation-buttons'>
                        <button onClick={previo}>
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
                        <button onClick={nexto}>
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
                <Swiper
                    modules={[Scrollbar, Grid]}
                    grid={{
                        rows: 2,
                        fill: 'row',
                    }}
                    scrollbar={{
                        hide: false,
                    }}
                    watchSlidesProgress={true}
                    slidesPerView={2}
                    grabCursor={true}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    spaceBetween={40}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {productsFromCollection?.map(
                        (product: any, index: number) => (
                            <SwiperSlide
                                key={index}
                                style={{
                                    padding: '40px 0',
                                }}
                            >
                                <MainProduct product={product} />
                            </SwiperSlide>
                        )
                    )}
                </Swiper>
            </div>
        </div>
    )
}

function ProductMain({
    selectedVariant,
    product,
    variants,
}: {
    product: any
    selectedVariant: ProductFragment['selectedVariant']
    variants: Promise<ProductVariantsQuery>
}) {
    const { title, descriptionHtml } = product

    const mapping = {
        hotDeal: product.hotDeal,
        new: product.new,
        ooo: product.ooo,
        promotion: product.promotion,
        release: product.release,
        ship: product.ship,
    } as any

    const stickersData = Object.keys(mapping).reduce((acc: any, key: any) => {
        if (mapping[key]) {
            acc.push({ key })
        }
        return acc
    }, [])

    // @ts-ignore
    return (
        <div className='product-main'>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <h1>{title}</h1>
                <div>
                    {stickersData.map((item: any, index: any) => (
                        <StickerComponent
                            key={index}
                            keyName={item.key}
                            offset={index * 20}
                        />
                    ))}
                </div>
            </div>
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
            <div
                className='product-main-features'
                style={{
                    marginTop: '50px',
                    maxHeight: '220px',
                }}
            >
                <h2>Caractéristiques</h2>
                <div className='product-main-features-list'>
                    {product?.daterelease && (
                        <p>Date de sortie : {product?.daterelease?.value}</p>
                    )}

                    {product?.colors && (
                        <p>
                            Palette de couleurs :{' '}
                            {
                                JSON.parse(product?.colors?.value).map(
                                    (color: any) => color + ' '
                                ) as any
                            }
                        </p>
                    )}

                    {product?.materials && <p>{product?.materials?.value}</p>}
                </div>
            </div>
            <div
                className='product-main-features'
                style={{
                    marginTop: '10px',
                }}
            >
                <h2
                    style={{
                        paddingBottom: '25px',
                    }}
                >
                    Description
                </h2>
                <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            </div>
        </div>
    )
}

function StickerComponent({ keyName, offset }: any) {
    const stickerPath = `/product/stickers/${keyName}.png`

    const style = {
        marginRight: `-50px`,
    }
    return (
        <img
            className='product-sticker'
            src={stickerPath}
            alt={keyName}
            style={style}
        />
    )
}

function ProductPrice({ selectedVariant }: { selectedVariant: any }) {
    const size = selectedVariant?.selectedOptions?.find(
        (option: any) => option.name === 'Size'
    )?.value

    return (
        <div className='product-price'>
            <h2>Price</h2>
            {selectedVariant?.availableForSale ? (
                selectedVariant?.compareAtPrice ? (
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
                            {size === undefined ? (
                                <img src='/product/size/os.png' alt='price' />
                            ) : size == 'UNIVERSEL' ? (
                                <img src={`/product/size/os.png`} alt='price' />
                            ) : (
                                <img
                                    src={
                                        `/product/size/${size}.png` ??
                                        `/product/size/49.png`
                                    }
                                    alt='price'
                                />
                            )}

                            <Money data={selectedVariant?.price} />
                        </div>
                    )
                )
            ) : (
                <div className='product-price-container'>
                    <img src='/product/stickers/ooo.png' alt='out of stock' />
                </div>
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

    const handleSlideChange = (swiper: any) => {
        const activeIndex = swiper.activeIndex
        const link = document.getElementById(`product-link-${activeIndex}`)

        if (link) {
            setTimeout(() => {
                link.click()
            }, 50)
        }
    }

    return (
        <div className='product-options' key={option.name}>
            <h2>Taille</h2>
            <div className='product-options-grid'>
                <Swiper
                    slidesPerView={5}
                    grabCursor={true}
                    centeredSlides={true}
                    initialSlide={midle}
                    className='product-swiper'
                    slideToClickedSlide={true}
                    onSlideChange={handleSlideChange}
                >
                    {sortedValues.map(
                        ({ value, isAvailable, isActive, to }, index) => (
                            <SwiperSlide key={option.name + value}>
                                {({ isActive, isPrev, isNext }) => (
                                    <Link
                                        id={`product-link-${index}`}
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
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                    }}
                >
                    <img src='/product/sizeSelector.png' alt='size selector' />
                </div>
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
    productType
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
        materials: metafield(namespace: "custom", key: "materiaux") {
        key
        value
      }
        daterelease: metafield(namespace: "custom", key: "date") {
        key
        value
      }
      colors: metafield(namespace: "custom", key: "palette") {
        key
        value
      }
    collections(first: 1){
        nodes{
            title
            id
              products(first: 25){
                nodes{
                  title
                  handle
                  productType
                  vendor
                  images(first: 1){
                    nodes{
                      url
                    }
                  }
                }
              }
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
