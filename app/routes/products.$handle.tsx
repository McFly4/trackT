import React, { useRef, useState } from 'react'
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

    return defer({ product, variants, products })
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
                <img src='/product/banner.png' alt='banner' />
            </div>
            <PanelTrackt products={products} />
        </>
    )
}

function PanelTrackt({ products }: { products: any }) {
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
        <div className='trackT'>
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
    const numberOfProducts = Math.ceil(
        (productsFromCollection?.length || 0) / 2
    )
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

    console.log(productsFromCollection)
    return (
        <div className='product-image-container'>
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
            <div className='product-connexe'>
                <div className='product-connexe-header'>
                    <h2>Produits connexes</h2>
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
                    className='product-connexe-grid'
                    ref={gridRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{
                        gridTemplateColumns: `repeat(${numberOfProducts}, 1fr)`,
                    }}
                >
                    {productsFromCollection?.map((product: any) => (
                        <Link
                            key={product.title}
                            to={`/products/${product.handle}`}
                        >
                            <div className='product-connexe-1'>
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
                    ))}
                </div>
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
            <div
                className='product-main-features'
                style={{
                    marginTop: '50px',
                    maxHeight: '220px',
                }}
            >
                <h2>Caractéristiques</h2>
                <div className='product-main-features-list'>
                    {product?.metafield1?.value}
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
    metafield1: metafield(namespace: "custom", key: "features") {
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
