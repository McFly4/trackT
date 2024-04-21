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
import { Transition } from 'react-transition-group'

import {
    Image,
    Money,
    VariantSelector,
    type VariantOption,
    getSelectedProductOptions,
    CartForm,
    getPaginationVariables,
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
import MarketDrag from '~/components/Common/MarketDrag'
import { Mousewheel, Pagination } from 'swiper/modules'
import GoFilters from '~/components/Common/GoFilters'
import useWindowDimensions from '~/hooks/useWindowDimension'
import Crowns from '~/components/Common/Modals/Crowns'
import Labels from '~/components/Common/Modals/Labels'
import Size from '~/components/Common/Modals/Size'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `TrackT | ${data?.product.title ?? ''}` }]
}

export async function loader({ params, request, context }: LoaderFunctionArgs) {
    const { handle } = params
    const { storefront } = context
    const pagination = getPaginationVariables(request, {
        pageBy: 24,
    })
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

    const randomList = ['hotDeal', 'soon', 'fastShip', 'release']
    const metafieldRandom =
        randomList[Math.floor(Math.random() * randomList.length)]

    const randomProduct = await context.storefront.query(FILTERS_QUERY, {
        variables: {
            first: 30,
            filters: [
                {
                    productMetafield: {
                        namespace: 'custom',
                        key: metafieldRandom,
                        value: 'true',
                    },
                },
            ],
            collections: 'title:all',
            ...pagination,
        },
    })
    return defer({
        product,
        variants,
        randomProduct,
        metafieldRandom,
    })
}

function redirectToFirstVariant({
    product,
    request,
}: {
    product: ProductFragment
    request: Request
}) {
    const url = new URL(request?.url)
    const firstVariant = product.variants.nodes[0]

    return redirect(
        getVariantUrl({
            pathname: url.pathname,
            handle: product.handle,
            selectedOptions: firstVariant.selectedOptions,
            searchParams: new URLSearchParams(url?.search),
        }),
        {
            status: 302,
        }
    )
}

export default function Product() {
    const { product, variants, randomProduct, metafieldRandom } =
        useLoaderData<typeof loader>()
    const { selectedVariant } = product
    const [stickers, setStickers] = useState(false)
    const [tobasket, setTobasket] = useState(false)
    const random = randomProduct.collections.nodes[0].products.nodes
    const windowDimensions = useWindowDimensions()
    const width = windowDimensions.width || 1920
    const parsedColors = JSON.parse(product.colors?.value) as any
    const [showText1, setShowText1] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [crownsOpen, setCronwsOpen] = React.useState(false)
    const [labelsOpen, setLabelsOpen] = React.useState(false)
    const [size, setSize] = React.useState(false)

    const openLabels = () => {
        setLabelsOpen(true)
    }

    const closeLabels = () => {
        setLabelsOpen(false)
    }

    const openCronws = () => {
        setCronwsOpen(true)
    }

    const closeCrowns = () => {
        setCronwsOpen(false)
    }

    const openSize = () => {
        setSize(true)
    }

    const closeSize = () => {
        setSize(false)
    }
    function randomNameFunction() {
        if (metafieldRandom === 'hotDeal') {
            return 'Hot Deal'
        } else if (metafieldRandom === 'soon') {
            return 'Bientôt disponible'
        } else if (metafieldRandom === 'fastShip') {
            return 'Chez vous en 48h'
        } else if (metafieldRandom === 'release') {
            return 'Exclusive Items'
        }
    }

    function toggleAddedToCart() {
        setTobasket(!tobasket)
    }

    const productsFromCollection =
        product?.collections?.nodes?.length > 1
            ? product?.collections?.nodes?.find(
                  (collection: any) => collection.title !== 'All'
              )?.products.nodes
            : product?.collections?.nodes[0].products.nodes

    const toggleExpand = () => {
        setExpanded(!expanded)
    }

    const mapping = {
        hotDeal: product.hotDeal,
        new: product.new,
        ooo: product.ooo,
        promotion: product.promotion,
        release: product.release,
        ship:
            selectedVariant.title === 'One Size'
                ? product.ship
                : selectedVariant?.weight >= 1 && product.ship,
        soon: product.soon,
    } as any

    const stickersData = Object.keys(mapping).reduce((acc: any, key: any) => {
        if (mapping[key]) {
            acc.push({ key })
        }
        return acc
    }, [])

    const toothBrush = product?.toothBrush?.value
    function calculateHeight(length: any) {
        if (length === 1) return '250px'
        else if (length >= 2 && length <= 6) {
            return `${250 + (length - 1) * 50}px`
        } else {
            return ''
        }
    }

    function toggleFromChild() {
        setTobasket(false)
    }

    const [scrollPosition, setScrollPosition] = useState(0)

    useEffect(() => {
        function handleScroll() {
            const position = window.scrollY
            setScrollPosition(position)
        }

        // Ajoute un écouteur d'événement pour le défilement lors du montage du composant
        window.addEventListener('scroll', handleScroll)

        // Nettoie l'écouteur d'événement lors du démontage du composant
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, []) // le tableau vide indique que cet effet ne dépend d'aucune valeur, il ne se déclenchera donc qu'une fois au montage du composant

    return (
        <>
            {crownsOpen && <Crowns isOpen={openCronws} onClose={closeCrowns} />}
            {labelsOpen && <Labels isOpen={openLabels} onClose={closeLabels} />}
            {size && <Size isOpen={openSize} onClose={closeSize} />}
            <div
                style={{
                    marginTop: width > 768 ? '300px' : '170px',
                }}
            >
                {width < 768 && scrollPosition < 1000 && (
                    <div
                        className={`product-menu ${expanded ? 'expanded' : ''}`}
                        style={{
                            height: expanded
                                ? calculateHeight(stickersData?.length)
                                : '',
                        }}
                    >
                        <button
                            onClick={toggleExpand}
                            className='button-expand'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='15.999'
                                height='16'
                                viewBox='0 0 15.999 16'
                            >
                                <path
                                    id='Union_14'
                                    data-name='Union 14'
                                    d='M147.111,486.711a1,1,0,0,1-1-1v-5.5h-5.5a1,1,0,0,1-1-1v-1a1,1,0,0,1,1-1h5.5v-5.5a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1v5.5h5.5a1,1,0,0,1,1,1v1a1,1,0,0,1-1,1h-5.5v5.5a1,1,0,0,1-1,1Z'
                                    transform='translate(-139.612 -470.711)'
                                    fill='#fff'
                                />
                            </svg>
                        </button>
                        {expanded && (
                            <div className='expanded-buttons'>
                                <span></span>
                                {stickersData?.map(
                                    (item: any, index: number) => (
                                        <div
                                            key={index}
                                            className='product-menu-stickers'
                                            onClick={openLabels}
                                        >
                                            <img
                                                src={`/product/stickers/${item.key}.png`}
                                                alt={item.key}
                                                style={{
                                                    width: '43px',
                                                    height: '39px',
                                                    paddingBottom: '18px',
                                                }}
                                            />
                                        </div>
                                    )
                                )}
                                {toothBrush === 'Small' ? (
                                    <div
                                        className='product-menu-stickers'
                                        onClick={openSize}
                                    >
                                        <img
                                            src='/about/little_toothbrush.png'
                                            alt='little toothbrush'
                                            style={{
                                                width: '35px',
                                                height: '65px',
                                            }}
                                        />
                                    </div>
                                ) : toothBrush === 'Medium' ? (
                                    <div
                                        className='product-menu-stickers'
                                        onClick={openSize}
                                    >
                                        <img
                                            src='/about/medium_toothbrush.png'
                                            alt='medium toothbrush'
                                            style={{
                                                width: '35px',
                                                height: '65px',
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className='product-menu-stickers'
                                        onClick={openSize}
                                    >
                                        <img
                                            src='/about/over_toothbrush.png'
                                            alt='over toothbrush'
                                            style={{
                                                width: '35px',
                                                height: '65px',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <BreadCrumb product={product} />
                <div className='product'>
                    <ProductImage image={selectedVariant} product={product} />
                    {width > 768 && (
                        <ProductMain
                            selectedVariant={selectedVariant}
                            product={product}
                            variants={variants}
                        />
                    )}
                </div>
            </div>
            {width > 768 ? (
                <>
                    <TrackT
                        products={productsFromCollection}
                        title='Produits connexes'
                    />
                    <div className='productBanner'>
                        <video
                            width='100%'
                            height='auto'
                            autoPlay
                            muted
                            loop
                            playsInline
                        >
                            <source
                                src='/product/banner.mp4'
                                type='video/mp4'
                            />
                            <img src='/product/banner.png' alt='banner' />
                        </video>
                    </div>
                    <TrackT products={random} title={randomNameFunction()} />
                    <MarketDrag />

                    <div
                        className='gofilters'
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            marginBottom: '200px',
                        }}
                    >
                        <h1>Pas encore trouvé votre perle rare ?</h1>
                        <p>
                            Nous avons une multitude de styles et de pièces
                            uniques, mais nous savons que parfois, vous cherchez
                            quelque chose de très spécifique. <br />
                            Si vous n’avez pas encore trouvé exactement ce que
                            vous voulez dans notre Panel Trackt, nous sommes là
                            pour vous aider.
                        </p>
                        <div className='gofilters-btn'>
                            <div className='four-btns'>
                                <Link to='/filters'>
                                    <button>
                                        <img
                                            src='/filters/checkbox.png'
                                            alt='checkbox'
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                marginRight: '10px',
                                                opacity: '1 !important',
                                            }}
                                        />
                                        Rechercher par filtres
                                    </button>
                                </Link>
                                <a href='#categories-aside'>
                                    <button>Shopping par catégories</button>
                                </a>
                                <a href='#search-aside'>
                                    <button>
                                        <svg
                                            id='icon'
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='21.548'
                                            height='21.547'
                                            viewBox='0 0 21.548 21.547'
                                            style={{
                                                marginRight: '10px',
                                            }}
                                        >
                                            <path
                                                id='Tracé_219'
                                                data-name='Tracé 219'
                                                d='M988.192,241.428a8.08,8.08,0,1,1,8.08-8.08A8.089,8.089,0,0,1,988.192,241.428Zm0-13.467a5.387,5.387,0,1,0,5.387,5.387A5.393,5.393,0,0,0,988.192,227.961Z'
                                                transform='translate(-980.112 -225.268)'
                                                fill='#fff'
                                            />
                                            <path
                                                id='Tracé_220'
                                                data-name='Tracé 220'
                                                d='M997.192,243.695a1.337,1.337,0,0,1-.952-.395l-6.734-6.733a1.346,1.346,0,0,1,1.9-1.9l6.734,6.733a1.347,1.347,0,0,1-.952,2.3Z'
                                                transform='translate(-976.992 -222.148)'
                                                fill='#fff'
                                            />
                                        </svg>
                                        Rechercher manuellement
                                    </button>
                                </a>
                                <Link to='/filtered'>
                                    <button>
                                        <img
                                            src='/filters/arrow-shuffle.png'
                                            alt='arrow-shuffle'
                                            style={{
                                                marginRight: '10px',
                                                opacity: '1 !important',
                                                width: '25px',
                                            }}
                                        />
                                        Random item
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='product-desc'>
                        <div className='product-caracteristics'>
                            <h4
                                style={{
                                    marginBottom: '20px',
                                }}
                            >
                                Caractéristiques
                            </h4>
                            {product?.daterelease && (
                                <p>
                                    Date de sortie :{' '}
                                    {product?.daterelease?.value}
                                </p>
                            )}

                            {product?.colors && (
                                <p>
                                    couleurs :
                                    {parsedColors?.map(
                                        (color: any) => color + ' '
                                    )}
                                </p>
                            )}

                            {product?.materials && (
                                <p>{product?.materials?.value}</p>
                            )}
                        </div>
                        <div className='product-description'>
                            <h4
                                style={{
                                    marginBottom: '20px',
                                }}
                            >
                                Description
                            </h4>
                            {!showText1 ? (
                                <div>{product.description.slice(0, 80)}...</div>
                            ) : (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: product.descriptionHtml,
                                    }}
                                />
                            )}
                            <button
                                className='responsive-btn-show'
                                onClick={() => setShowText1(!showText1)}
                            >
                                {showText1 ? '-' : '+'}
                            </button>
                        </div>
                    </div>

                    <>
                        <TrackT
                            products={productsFromCollection}
                            title='Produits connexes'
                        />
                        <div className='productBanner'>
                            <video
                                width='100%'
                                height='auto'
                                autoPlay
                                muted
                                loop
                                playsInline
                            >
                                <source
                                    src='/product/banner.mp4'
                                    type='video/mp4'
                                />
                                <img src='/product/banner.png' alt='banner' />
                            </video>
                        </div>
                        <TrackT
                            products={random}
                            title={randomNameFunction()}
                        />
                        <MarketDrag />

                        <div
                            className='gofilters'
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                marginBottom: '200px',
                                textAlign: 'center',
                            }}
                        >
                            <h1
                                style={{
                                    marginBottom: '10px',
                                }}
                            >
                                Pas encore trouvé votre perle rare ?
                            </h1>
                            <p>
                                Nous avons une multitude de styles et de pièces
                                uniques, mais nous savons que parfois, vous
                                cherchez quelque chose de très spécifique.{' '}
                                <br />
                                Si vous n’avez pas encore trouvé exactement ce
                                que vous voulez dans notre Panel Trackt, nous
                                sommes là pour vous aider.
                            </p>
                            <div className='gofilters-btn'>
                                <div className='four-btns'>
                                    <Link to='/filters'>
                                        <button>
                                            <img
                                                src='/filters/checkbox.png'
                                                alt='checkbox'
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '10px',
                                                    opacity: '1 !important',
                                                }}
                                            />
                                            Rechercher par filtres
                                        </button>
                                    </Link>
                                    <a href='#categories-aside'>
                                        <button>Shopping par catégories</button>
                                    </a>
                                    <a href='#search-aside'>
                                        <button>
                                            <svg
                                                id='icon'
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='21.548'
                                                height='21.547'
                                                viewBox='0 0 21.548 21.547'
                                                style={{
                                                    marginRight: '10px',
                                                }}
                                            >
                                                <path
                                                    id='Tracé_219'
                                                    data-name='Tracé 219'
                                                    d='M988.192,241.428a8.08,8.08,0,1,1,8.08-8.08A8.089,8.089,0,0,1,988.192,241.428Zm0-13.467a5.387,5.387,0,1,0,5.387,5.387A5.393,5.393,0,0,0,988.192,227.961Z'
                                                    transform='translate(-980.112 -225.268)'
                                                    fill='#fff'
                                                />
                                                <path
                                                    id='Tracé_220'
                                                    data-name='Tracé 220'
                                                    d='M997.192,243.695a1.337,1.337,0,0,1-.952-.395l-6.734-6.733a1.346,1.346,0,0,1,1.9-1.9l6.734,6.733a1.347,1.347,0,0,1-.952,2.3Z'
                                                    transform='translate(-976.992 -222.148)'
                                                    fill='#fff'
                                                />
                                            </svg>
                                            Rechercher manuellement
                                        </button>
                                    </a>
                                    <Link to='/filtered'>
                                        <button>
                                            <img
                                                src='/filters/arrow-shuffle.png'
                                                alt='arrow-shuffle'
                                                style={{
                                                    marginRight: '10px',
                                                    opacity: '1 !important',
                                                }}
                                            />
                                            Random item
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                </>
            )}
            {width < 768 && (
                <>
                    {tobasket && (
                        <div className='responsive-modal'>
                            <button
                                className='responsive-modal-close'
                                onClick={toggleAddedToCart}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='16'
                                    height='16'
                                    viewBox='0 0 16 16'
                                >
                                    <path
                                        id='Tracé_467'
                                        data-name='Tracé 467'
                                        d='M16841.295-8037.292l-6.295-6.294-6.295,6.294a.988.988,0,0,1-.705.292.988.988,0,0,1-.705-.292,1,1,0,0,1,0-1.417l6.291-6.292-6.291-6.292a1,1,0,0,1,0-1.416,1,1,0,0,1,1.41,0l6.295,6.294,6.295-6.294a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.416l-6.291,6.292,6.291,6.292a1,1,0,0,1,0,1.417.988.988,0,0,1-.705.292A.988.988,0,0,1,16841.295-8037.292Z'
                                        transform='translate(-16827 8053)'
                                        fill='#fff'
                                    />
                                </svg>
                            </button>
                            <ProductPrice
                                selectedVariant={selectedVariant}
                                soon={product.soon}
                                setBasket={toggleFromChild}
                            />
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
                                            variants={
                                                data.product?.variants.nodes ||
                                                []
                                            }
                                        />
                                    )}
                                </Await>
                            </Suspense>
                        </div>
                    )}
                    {!tobasket && scrollPosition < 1000 && (
                        <div className='choose-size'>
                            <h6 onClick={() => setTobasket(!tobasket)}>
                                Choisir ma taille
                            </h6>
                        </div>
                    )}
                    {scrollPosition > 1000 && (
                        <div className='product-header-sticky'>
                            <div className='product-header-sticky-product'>
                                <img
                                    src={product?.selectedVariant?.image?.url}
                                    alt={product?.vendor}
                                />
                                <div className='product-header-sticky-product-info'>
                                    <p>{product.vendor}</p>
                                    <p>{product.title}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {width < 768 && stickers && (
                <div className='responsive-modal'>
                    <button
                        className='responsive-modal-close'
                        onClick={() => setStickers(!stickers)}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                        >
                            <path
                                id='Tracé_467'
                                data-name='Tracé 467'
                                d='M16841.295-8037.292l-6.295-6.294-6.295,6.294a.988.988,0,0,1-.705.292.988.988,0,0,1-.705-.292,1,1,0,0,1,0-1.417l6.291-6.292-6.291-6.292a1,1,0,0,1,0-1.416,1,1,0,0,1,1.41,0l6.295,6.294,6.295-6.294a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.416l-6.291,6.292,6.291,6.292a1,1,0,0,1,0,1.417.988.988,0,0,1-.705.292A.988.988,0,0,1,16841.295-8037.292Z'
                                transform='translate(-16827 8053)'
                                fill='#fff'
                            />
                        </svg>
                    </button>
                    <div className='stickers-responsive'>
                        <h4>Labels trackt</h4>
                        <div className='stickers-responsive-item'>
                            <img
                                src='/product/stickers/release.png'
                                alt='release'
                            />
                            <p>
                                Accédez à la crème de la crème avec nos sorties
                                « Exclusive item ». Ces articles premium
                                définissent les standards du streetwear haut de
                                gamme.
                            </p>
                        </div>
                        <div className='stickers-responsive-item'>
                            <img
                                src='/product/stickers/ship.png'
                                alt='release'
                            />
                            <p>
                                Livraison immédiate, cette sélection est dédiée
                                aux articles expédiés en 48H puisque nous
                                possédons l’article dans nos locaux.
                            </p>
                        </div>
                        <div className='stickers-responsive-item'>
                            <img
                                src='/product/stickers/hotDeal.png'
                                alt='release'
                            />
                            <p>
                                Offres incontournables, sélectionnées pour leur
                                style audacieux et leurs prix avantageux. Des
                                opportunités éphémères à saisir rapidement pour
                                les amateurs de streetwear.
                            </p>
                        </div>
                        <div className='stickers-responsive-item'>
                            <img
                                src='/product/stickers/new.png'
                                alt='release'
                            />
                            <p>
                                Soyez à l’avant-garde avec les dernières
                                nouveautés du streetwear. Ces articles
                                fraîchement arrivés sont prêts à définir les
                                prochaines tendances urbaines.
                            </p>
                        </div>
                        <div className='stickers-responsive-item'>
                            <img
                                src='/product/stickers/soon.png'
                                alt='release'
                            />
                            <p>
                                Disponibles à la vente dans un avenir proche.
                                Gardez un œil sur notre site pour ne pas manquer
                                leur lancement !
                            </p>
                        </div>
                        <div className='stickers-responsive-item'>
                            <img
                                src='/product/stickers/ooo.png'
                                alt='release'
                            />
                            <p>
                                Ces articles prisés sont actuellement en rupture
                                de stock, victimes de leur succès dans l’univers
                                du streetwear. Inscrivez-vous pour être alerté
                                de leur retour.
                            </p>
                        </div>
                        <div className='stickers-responsive-item'>
                            <img
                                src='/product/stickers/promotion.png'
                                alt='release'
                            />
                            <p>
                                Profitez de promotions exclusives pour enrichir
                                votre collection de streetwear. Des pièces
                                uniques et des réductions alléchantes vous
                                attendent.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function BreadCrumb({ product }: { product: any }) {
    const isMixte = product?.manwoman
        ? (JSON.parse(product?.manwoman?.value) as any)
        : 'Homme'
    const type = product?.productType
    const vendor = product?.vendor
    const productName = product?.title
    const colors = JSON.parse(product?.colors?.value) as any
    const firstColor = colors?.[0] ?? 'white'
    const collection =
        product?.collections?.nodes?.length > 1
            ? product?.collections?.nodes?.find(
                  (collection: any) => collection.title !== 'All'
              )?.title
            : product?.collections?.nodes[0]?.title

    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920
    return (
        <div
            className='breadcrumb'
            style={{
                backgroundColor:
                    firstColor === 'blue-cyan'
                        ? '#ADD8E6 '
                        : firstColor === 'black'
                        ? '#fff'
                        : firstColor === 'brown'
                        ? '#582900'
                        : firstColor === 'kaki'
                        ? '#4d5832'
                        : firstColor === 'blue-navy'
                        ? '#1d3047'
                        : firstColor === 'blue-clair'
                        ? '#77B5FE'
                        : firstColor,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    paddingLeft: '80px',
                }}
                className='breadcrumb-container'
            >
                <p>
                    <Link
                        to={
                            isMixte === 'Homme'
                                ? '/filtered'
                                : '/filtered?manwoman=' + isMixte
                        }
                    >
                        {isMixte}
                    </Link>{' '}
                    &gt; <Link to={'/search?q=' + type}>{type}</Link> &gt;{' '}
                    <Link to={'/search?q=' + vendor}>
                        {width > 768
                            ? vendor
                            : vendor?.length > 15
                            ? vendor.slice(0, 15) + '...'
                            : vendor}
                    </Link>{' '}
                    &gt;{' '}
                    <Link to={'/search?q=' + collection}>
                        {width > 768
                            ? collection
                            : collection?.length > 15
                            ? collection.slice(0, 15) + '...'
                            : collection}
                    </Link>{' '}
                    &gt;{' '}
                    <Link to={'/products/' + product.handle}>
                        {width > 768
                            ? productName
                            : productName?.length > 10
                            ? productName.slice(0, 10) + '...'
                            : productName}
                    </Link>
                </p>
                <div className='breadcrumb-colors'>
                    {colors?.map((color: any, index: number) => (
                        <Link to={'/filtered?palette=' + color} key={index}>
                            <div
                                key={index}
                                className='breadcrumb-color'
                                style={{
                                    backgroundColor:
                                        color === 'brown'
                                            ? '#582900'
                                            : color === 'blue-navy'
                                            ? '#1d3047'
                                            : color === 'kaki'
                                            ? '#4d5832'
                                            : color === 'blue-cyan'
                                            ? '#ADD8E6'
                                            : color === 'blue-clair'
                                            ? '#77B5FE'
                                            : color,
                                }}
                            ></div>
                        </Link>
                    ))}
                </div>
            </div>
            {width > 768 && (
                <div
                    style={{
                        paddingRight: '50px',
                    }}
                >
                    <p>Ajouter aux favoris</p>
                </div>
            )}
        </div>
    )
}

function ProductImage({ image, product }: { image: any; product: any }) {
    if (!image) {
        return <div className='product-image' />
    }
    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920
    const firstImage = image?.product?.images.nodes[0]?.url
    const images = image?.product?.images.nodes
    const codeBar = [
        { id: 0, url: '/product/code1.png' },
        { id: 1, url: '/product/code2.png' },
        { id: 2, url: '/product/code3.png' },
        { id: 3, url: '/product/code4.png' },
    ]

    // Maintenant, codeBar est une liste d'objets avec des propriétés id et url.

    const [mainImage, setMainImage] = useState(firstImage || image?.url)

    const productsFromCollection =
        product?.collections?.nodes?.length > 1
            ? product?.collections?.nodes?.find(
                  (collection: any) => collection.title !== 'All'
              )?.products.nodes
            : product?.collections?.nodes[0].products.nodes

    const swiperRef = useRef<any>(null)

    const nexto = () => {
        swiperRef.current?.slideNext()
    }

    const previo = () => {
        swiperRef.current?.slidePrev()
    }

    useEffect(() => {
        setMainImage(firstImage)
    }, [firstImage])

    return (
        <div className='product-image-container'>
            <div className='product-image'>
                <div className='product-image-title'>
                    <Link to={'/search?q=' + product.vendor}>
                        <h1
                            style={{
                                marginBottom: width > 768 ? '' : '5px',
                            }}
                        >
                            {product.vendor}
                        </h1>
                    </Link>
                    <Link
                        to={'/search?q=' + product.collections?.nodes[0].title}
                    >
                        <h2>
                            {product.collections?.nodes[0].title === 'All'
                                ? ''
                                : product.collections?.nodes[0].title}
                        </h2>
                    </Link>
                    {width < 768 && (
                        <p className='product-image-name'>{product.title}</p>
                    )}
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

                    <img
                        alt={image.altText as any}
                        src={mainImage}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }}
                    />
                </div>
                <div
                    className='product-image-list'
                    style={{
                        justifyContent:
                            images.length <= 2 ? 'flex-start' : 'space-between',
                    }}
                >
                    {images.map((image: any, index: number) => (
                        <div
                            key={image?.id}
                            className='product-image-list-item'
                            onClick={() => setMainImage(image?.url)}
                        >
                            <div
                                style={{
                                    width:
                                        images.length === 3 ? '240px' : '100%',
                                    height:
                                        images.length === 3 ? '160px' : '115px',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <img src={image?.url} alt={image.altText} />
                            </div>
                            {width > 768 && (
                                <img
                                    src={codeBar[index]?.url}
                                    alt='code bar'
                                    className='product-image-list-item-code'
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {/*<div*/}
            {/*    className='trackT'*/}
            {/*    style={{*/}
            {/*        margin: 'unset',*/}
            {/*        marginTop: '50px',*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <div className='trackT-header'>*/}
            {/*        <h2>Produits connexes</h2>*/}
            {/*        <div className='navigation-buttons'>*/}
            {/*            <button onClick={previo}>*/}
            {/*                <svg*/}
            {/*                    xmlns='http://www.w3.org/2000/svg'*/}
            {/*                    width='7.574'*/}
            {/*                    height='13.928'*/}
            {/*                    viewBox='0 0 7.574 13.928'*/}
            {/*                >*/}
            {/*                    <path*/}
            {/*                        id='Tracé_416'*/}
            {/*                        data-name='Tracé 416'*/}
            {/*                        d='M-20862.068-17757.791a.61.61,0,0,1-.432-.18.612.612,0,0,1,0-.861l5.924-5.924-5.924-5.924a.612.612,0,0,1,0-.861.611.611,0,0,1,.863,0l6.355,6.354a.614.614,0,0,1,0,.863l-6.355,6.354A.61.61,0,0,1-20862.068-17757.791Z'*/}
            {/*                        transform='translate(20862.678 17771.719)'*/}
            {/*                        fill='#fff'*/}
            {/*                    />*/}
            {/*                </svg>*/}
            {/*            </button>*/}
            {/*            <button onClick={nexto}>*/}
            {/*                <svg*/}
            {/*                    xmlns='http://www.w3.org/2000/svg'*/}
            {/*                    width='7.574'*/}
            {/*                    height='13.928'*/}
            {/*                    viewBox='0 0 7.574 13.928'*/}
            {/*                >*/}
            {/*                    <path*/}
            {/*                        id='Tracé_416'*/}
            {/*                        data-name='Tracé 416'*/}
            {/*                        d='M-20862.068-17757.791a.61.61,0,0,1-.432-.18.612.612,0,0,1,0-.861l5.924-5.924-5.924-5.924a.612.612,0,0,1,0-.861.611.611,0,0,1,.863,0l6.355,6.354a.614.614,0,0,1,0,.863l-6.355,6.354A.61.61,0,0,1-20862.068-17757.791Z'*/}
            {/*                        transform='translate(20862.678 17771.719)'*/}
            {/*                        fill='#fff'*/}
            {/*                    />*/}
            {/*                </svg>*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <Swiper*/}
            {/*        modules={[Scrollbar, Grid]}*/}
            {/*        grid={{*/}
            {/*            rows: 2,*/}
            {/*            fill: 'row',*/}
            {/*        }}*/}
            {/*        scrollbar={{*/}
            {/*            hide: false,*/}
            {/*        }}*/}
            {/*        watchSlidesProgress={true}*/}
            {/*        breakpoints={*/}
            {/*            {*/}
            {/*                0: {*/}
            {/*                    slidesPerView: 1,*/}
            {/*                },*/}
            {/*                768: {*/}
            {/*                    slidesPerView: 2,*/}
            {/*                },*/}
            {/*                1800: {*/}
            {/*                    slidesPerView: 3,*/}
            {/*                },*/}
            {/*            } as any*/}
            {/*        }*/}
            {/*        slidesPerView={3}*/}
            {/*        grabCursor={true}*/}
            {/*        navigation={{*/}
            {/*            nextEl: '.swiper-button-next',*/}
            {/*            prevEl: '.swiper-button-prev',*/}
            {/*        }}*/}
            {/*        spaceBetween={40}*/}
            {/*        onSwiper={(swiper) => (swiperRef.current = swiper)}*/}
            {/*        className='trackT-swiper'*/}
            {/*    >*/}
            {/*        {productsFromCollection?.map(*/}
            {/*            (product: any, index: number) => (*/}
            {/*                <SwiperSlide key={index}>*/}
            {/*                    <MainProduct*/}
            {/*                        product={product}*/}
            {/*                        stickers={false}*/}
            {/*                        isCarousel={true}*/}
            {/*                    />*/}
            {/*                </SwiperSlide>*/}
            {/*            )*/}
            {/*        )}*/}
            {/*    </Swiper>*/}
            {/*</div>*/}
        </div>
    )
}

function ProductMain({
    selectedVariant,
    product,
    variants,
}: {
    product: any
    selectedVariant: any
    variants: Promise<ProductVariantsQuery>
}) {
    const windowDimensions = useWindowDimensions()
    const width = windowDimensions.width || 1920
    const { title, descriptionHtml } = product
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenToothbrush, setIsModalOpenToothbrush] = useState(false)
    const parsedColors = JSON.parse(product.colors?.value) as any
    function toggleModalToothbrush() {
        setIsModalOpenToothbrush(!isModalOpenToothbrush)
    }

    function toggleModal() {
        setIsModalOpen(!isModalOpen)
    }

    const handleOutsideClick = (event: any) => {
        if (event.target === event.currentTarget) {
            setIsModalOpen(false)
            setIsModalOpenToothbrush(false)
        }
    }

    const mapping = {
        hotDeal: product.hotDeal,
        new: product.new,
        ooo: product.ooo,
        promotion: product.promotion,
        release: product.release,
        ship:
            selectedVariant.title === 'One Size'
                ? product.ship
                : selectedVariant?.weight >= 1 && product.ship,
        soon: product.soon,
    } as any

    const stickersData = Object.keys(mapping).reduce((acc: any, key: any) => {
        if (mapping[key]) {
            acc.push({ key })
        }
        return acc
    }, [])

    return (
        <div className='product-main'>
            {isModalOpen && (
                <div className='dialog-overlay' onClick={handleOutsideClick}>
                    <div className='dialog'>
                        <ToggleModal toggle={toggleModal} />
                    </div>
                </div>
            )}
            {isModalOpenToothbrush && (
                <div className='dialog-overlay' onClick={handleOutsideClick}>
                    <div className='dialog'>
                        <ToggleModalToothbrush toggle={toggleModalToothbrush} />
                    </div>
                </div>
            )}

            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <div className='product-main-title'>
                    <h1>{title}</h1>
                    {width > 768 && (
                        <div className='product-main-stickers'>
                            <div className='stickers-container'>
                                {stickersData &&
                                    stickersData
                                        .reduce(
                                            (
                                                acc: any,
                                                item: any,
                                                index: any
                                            ) => {
                                                if (index % 2 === 0) {
                                                    acc.push([item])
                                                } else {
                                                    acc[acc.length - 1].push(
                                                        item
                                                    )
                                                }
                                                return acc
                                            },
                                            []
                                        )
                                        .map((pair: any, pairIndex: any) => (
                                            <div
                                                key={pairIndex}
                                                className='pair-container'
                                            >
                                                {pair.map(
                                                    (item: any, index: any) => (
                                                        <div
                                                            key={index}
                                                            onClick={
                                                                toggleModal
                                                            }
                                                        >
                                                            <img
                                                                src={`/product/stickers/${item.key}.png`}
                                                                alt={item.key}
                                                                style={{
                                                                    width: '70px',
                                                                    height: '60px',
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ))}
                            </div>

                            {product?.toothBrush?.value && (
                                <div onClick={toggleModalToothbrush}>
                                    {product?.toothBrush?.value === 'Small' ||
                                    product?.toothBrush?.value === 'SMALL' ? (
                                        <img
                                            src='/about/little_toothbrush.png'
                                            alt='little toothbrush'
                                            className='toothbrush'
                                        />
                                    ) : product?.toothBrush?.value ===
                                          'Medium' ||
                                      product?.toothBrush?.value ===
                                          'MEDIUM' ? (
                                        <img
                                            src='/about/medium_toothbrush.png'
                                            alt='medium toothbrush'
                                            className='toothbrush'
                                        />
                                    ) : (
                                        <img
                                            src='/about/over_toothbrush.png'
                                            alt='big toothbrush'
                                            className='toothbrush'
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className='product-main-head'>
                {width > 768 && (
                    <ProductPrice
                        selectedVariant={selectedVariant}
                        soon={product.soon}
                    />
                )}
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
                            couleurs :
                            {parsedColors?.map((color: any) => color + ' ')}
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

function ToggleModalToothbrush(toggle: any) {
    const { product } = useLoaderData<typeof loader>()

    const value = product?.toothBrush?.value

    return (
        <div className='modal-stickers-overlay'>
            <div className='modal-stickers'>
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
                <div className='modal-stickers-header'>
                    <h2>Guide des tailles</h2>
                    <p
                        style={{
                            width: '80%',
                            margin: 'auto',
                        }}
                    >
                        Nous avons classifié nos articles en trois catégories
                        distinctes pour mieux vous aider à choisir vos tailles :
                        Little, Medium et Over. Repérez ces différentes options
                        pour trouver la coupe qui vous convient le mieux.
                    </p>
                </div>
                <div className='modal-stickers-body modal-toothbrush'>
                    <div
                        className='modal-stickers-body-item '
                        style={
                            value && {
                                backgroundColor:
                                    value === 'Small'
                                        ? 'unset'
                                        : 'rgb(0 0 0 / 40%)',
                            }
                        }
                    >
                        <img src='/about/little_toothbrush.png' alt='little' />
                        <h4>Little</h4>
                        <p>
                            Adapté à ceux qui aiment un style structuré. Coupe
                            sérée.
                        </p>
                    </div>
                    <div
                        className='modal-stickers-body-item'
                        style={
                            value && {
                                backgroundColor:
                                    value === 'Medium'
                                        ? 'unset'
                                        : 'rgb(0 0 0 / 40%)',
                            }
                        }
                    >
                        <img src='/about/medium_toothbrush.png' alt='medium' />
                        <h4>Medium</h4>
                        <p>
                            Conçu pour ceux qui cherchent l’équilibre. Sizing
                            universel.
                        </p>
                    </div>
                    <div
                        className='modal-stickers-body-item'
                        style={
                            value && {
                                backgroundColor:
                                    value === 'Over'
                                        ? 'unset'
                                        : 'rgb(0 0 0 / 40%)',
                            }
                        }
                    >
                        <img src='/about/over_toothbrush.png' alt='over' />
                        <h4>Over</h4>
                        <p>
                            Destiné à ceux qui privilégient l’espace et la
                            liberté de mouvement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ToggleModal(toggle: any) {
    const { product } = useLoaderData<typeof loader>()

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

    const isHotDeal = stickersData.find((item: any) => item.key === 'hotDeal')
    const isNew = stickersData.find((item: any) => item.key === 'new')
    const isOoo = stickersData.find((item: any) => item.key === 'ooo')
    const isPromotion = stickersData.find(
        (item: any) => item.key === 'promotion'
    )
    const isRelease = stickersData.find((item: any) => item.key === 'release')
    const isShip = stickersData.find((item: any) => item.key === 'ship')

    return (
        <div className='modal-stickers-overlay'>
            <div className='modal-stickers'>
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
                <div className='modal-stickers-header'>
                    <h3>Labels trackt</h3>
                    <p
                        style={{
                            width: '90%',
                            margin: 'auto',
                        }}
                    >
                        Nos pastilles sont là pour vous guider en un clin d’œil
                        ! Chacune d’elles est un repère visuel qui révèle une
                        caractéristique clé du produit,. Utilisez ces
                        indicateurs pour naviguer dans notre collection et
                        dénicher les pièces qui correspondent à vos critères
                        spécifiques. C’est simple, rapide et cela rend votre
                        expérience d’achat chez Trackt encore plus intuitive et
                        personnalisée.
                    </p>
                </div>
                <div className='modal-stickers-body'>
                    <div
                        className='modal-stickers-body-item'
                        style={{
                            opacity: isRelease ? '1' : '0.2',
                        }}
                    >
                        <img
                            src='/product/stickers/release.png'
                            alt='release'
                        />
                        <p>
                            Accédez à la crème de la crème avec nos sorties
                            « Exclusive item ». Ces articles premium définissent
                            les standards du streetwear haut de gamme.
                        </p>
                    </div>
                    <div
                        className='modal-stickers-body-item'
                        style={{
                            opacity: isHotDeal ? '1' : '0.2',
                        }}
                    >
                        <img
                            src='/product/stickers/hotDeal.png'
                            alt='hotDeal'
                        />
                        <p>
                            Offres incontournables, sélectionnées pour leur
                            style audacieux et leurs prix avantageux. Des
                            opportunités éphémères à saisir rapidement pour les
                            amateurs de streetwear.
                        </p>
                    </div>

                    <div
                        className='modal-stickers-body-item'
                        style={{
                            opacity: isNew ? '1' : '0.2',
                        }}
                    >
                        <img src='/product/stickers/new.png' alt='new' />
                        <p>
                            Soyez à l’avant-garde avec les dernières nouveautés
                            du streetwear. Ces articles fraîchement arrivés sont
                            prêts à définir les prochaines tendances urbaines.
                        </p>
                    </div>
                    <div
                        className='modal-stickers-body-item'
                        style={{
                            opacity: isShip ? '1' : '0.2',
                        }}
                    >
                        <img src='/product/stickers/ship.png' alt='ship' />
                        <p>
                            Livraison immédiate, cette sélection est dédiée aux
                            articles expédiés en 48H puisque nous possédons
                            l’article dans nos locaux.
                        </p>
                    </div>

                    <div
                        className='modal-stickers-body-item'
                        style={{
                            opacity: isPromotion ? '1' : '0.2',
                        }}
                    >
                        <img
                            src='/product/stickers/promotion.png'
                            alt='promotion'
                        />
                        <p>
                            Profitez de promotions exclusives pour enrichir
                            votre collection de streetwear. Des pièces uniques
                            et des réductions alléchantes vous attendent.
                        </p>
                    </div>
                    <div
                        className='modal-stickers-body-item'
                        style={{
                            opacity: isOoo ? '1' : '0.2',
                        }}
                    >
                        <img
                            src='/product/stickers/ooo.png'
                            alt='ooo'
                            className='img-ooo'
                        />
                        <p>
                            Ces articles prisés sont actuellement en rupture de
                            stock, victimes de leur succès dans l’univers du
                            streetwear. Inscrivez-vous pour être alerté de leur
                            retour.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProductPrice({ selectedVariant, setBasket }: any) {
    const size = selectedVariant?.selectedOptions?.find(
        (option: any) =>
            option.name === 'Size' ||
            option.name === 'Taille' ||
            option.name === 'Title'
    )?.value
    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920

    function handleCloseBasket() {
        setTimeout(() => {
            setBasket(true)
            window.location.href = window.location.href + '#cart-aside'
        }, 1000)
    }

    return (
        <div className='product-price'>
            <h2>Price</h2>
            {selectedVariant?.soon?.value === 'true' ? (
                <div className='product-price-container'>
                    <img
                        src='/product/stickers/soon2x.png'
                        alt='soon'
                        className='img-ooo'
                    />
                    <span className='soon'>soon</span>
                </div>
            ) : selectedVariant?.availableForSale ? (
                selectedVariant?.compareAtPrice ? (
                    <>
                        <p>Sale</p>

                        <br />
                        <div className='product-price-on-sale' style={{}}>
                            {selectedVariant ? (
                                <Money data={selectedVariant?.price} />
                            ) : null}
                            <s>
                                <Money data={selectedVariant?.compareAtPrice} />
                            </s>
                        </div>
                    </>
                ) : (
                    selectedVariant?.price && (
                        <div className='product-price-container'>
                            {size == undefined ||
                            size == 'OS' ||
                            size == 'One Size' ||
                            size == 'UNIVERSEL' ? (
                                <img
                                    src='/product/size/os.png'
                                    alt='price'
                                    className='product-size-os'
                                    style={{
                                        width: '250px !important',
                                        height: '250px !important',
                                    }}
                                />
                            ) : (
                                <img
                                    src={
                                        `/product/size/${
                                            size.toLowerCase()?.split(' ')[0]
                                        }.png` || `/product/size/default.png` // Utilisation de l'image par défaut si l'image spécifiée n'est pas trouvée
                                    }
                                    alt='price'
                                    style={{
                                        width: 'unset !important',
                                        height: 'unset !important',
                                    }}
                                />
                            )}

                            <Money
                                style={{
                                    bottom:
                                        size?.split(' ')[0] == '43' ||
                                        size?.split(' ')[0] == '40' ||
                                        size?.split(' ')[0] == '38' ||
                                        size?.split(' ')[0] == '36'
                                            ? '10%'
                                            : '',
                                }}
                                data={selectedVariant?.price}
                            />
                        </div>
                    )
                )
            ) : (
                <div className='product-price-container'>
                    <img
                        src='/product/stickers/ooo.png'
                        alt='out of stock'
                        className='img-ooo'
                    />
                    <span>sold out</span>
                </div>
            )}
            <AddToCartButton
                disabled={
                    !selectedVariant ||
                    !selectedVariant?.availableForSale ||
                    selectedVariant?.soon?.value === 'true'
                }
                lines={
                    selectedVariant
                        ? [
                              {
                                  merchandiseId: selectedVariant?.id,
                                  quantity: 1,
                              },
                          ]
                        : []
                }
                onClick={() => {
                    width > 768
                        ? (window.location.href =
                              window.location.href + '#cart-aside')
                        : handleCloseBasket()
                }}
            >
                Ajouter au panier
            </AddToCartButton>
        </div>
    )
}

function ProductForm({
    product,
    selectedVariant,
    variants,
}: {
    product: any
    selectedVariant: any
    variants: any
}) {
    const variantName = selectedVariant?.selectedOptions[0].value
    const [isModalOpenToothbrush, setIsModalOpenToothbrush] = useState(false)
    const isSoon = product?.soon?.value

    function toggleModalToothbrush() {
        setIsModalOpenToothbrush(!isModalOpenToothbrush)
    }

    function handleOutsideClick(event: any) {
        if (event.target === event.currentTarget) {
            setIsModalOpenToothbrush(false)
        }
    }

    return (
        <div className='product-form'>
            {isModalOpenToothbrush && (
                <div className='dialog-overlay' onClick={handleOutsideClick}>
                    <div className='dialog'>
                        <ToggleModalToothbrush toggle={toggleModalToothbrush} />
                    </div>
                </div>
            )}
            <VariantSelector
                handle={product.handle}
                options={product.options}
                variants={variants}
            >
                {({ option }) => (
                    <ProductOptions
                        key={option.name}
                        option={option}
                        variants={variants}
                    />
                )}
            </VariantSelector>
            {variants?.length <= 1 && (
                <div
                    className='product-options'
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <h2
                        style={{
                            marginBottom: 'unset',
                        }}
                    >
                        Taille
                    </h2>
                    <div>
                        {variantName === 'Default Title' ||
                        variantName === 'UNIVERSEL' ? (
                            <h4>OS</h4>
                        ) : (
                            <h4>{variantName}</h4>
                        )}
                    </div>
                    <button
                        className='sizes-guid'
                        onClick={toggleModalToothbrush}
                        style={{
                            color: '#000 !important',
                        }}
                    >
                        Guide des tailles
                    </button>
                </div>
            )}
        </div>
    )
}

function ProductOptions({ option, variants }: any) {
    const [crownsOpen, setCronwsOpen] = React.useState(false)

    const openCronws = () => {
        setCronwsOpen(true)
    }

    const closeCrowns = () => {
        setCronwsOpen(false)
    }

    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920
    const [isModalOpenToothbrush, setIsModalOpenToothbrush] = useState(false)
    const defaultSize =
        typeof window !== 'undefined'
            ? localStorage.getItem('selectedShoeSize')
            : null
    const defaultClotheSize =
        typeof window !== 'undefined'
            ? localStorage.getItem('selectedClothesSize')
            : null
    const isSoon = variants[0]?.product?.soon?.value
    function toggleModalToothbrush() {
        setIsModalOpenToothbrush(!isModalOpenToothbrush)
    }

    function handleOutsideClick(event: any) {
        if (event.target === event.currentTarget) {
            setIsModalOpenToothbrush(false)
        }
    }
    const sortedValues = option.values.slice().sort((a: any, b: any) => {
        const isNumeric = (value: any) => /^\d+(\.\d+)?$/.test(value)
        if (isNumeric(a.value) && isNumeric(b.value)) {
            // Si les deux valeurs sont numériques, inversez l'ordre du tri
            return parseFloat(a.value) - parseFloat(b.value)
        } else {
            return a
        }
    })

    function findIndexByValue(arr: any, targetValue: any) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value === targetValue) {
                return i // Retourne l'index de l'objet trouvé
            }
        }
        return -1 // Retourne -1 si la valeur n'est pas trouvée
    }
    const selectedSize = findIndexByValue(sortedValues, defaultSize)
    const selectedClotheSize = findIndexByValue(sortedValues, defaultClotheSize)
    const handleSlideChange = (swiper: any) => {
        const activeIndex = swiper.activeIndex
        const link = document.getElementById(`product-link-${activeIndex}`)

        if (link) {
            setTimeout(() => {
                link.click()
            }, 50)
        }
    }

    const swiperRef = useRef<any>(null)

    const nexto = () => {
        swiperRef.current?.slideNext()
    }

    const previo = () => {
        swiperRef.current?.slidePrev()
    }

    const sizeType = option?.values[0]?.value

    return (
        <div className='product-options' key={option.name}>
            {isModalOpenToothbrush && (
                <div className='dialog-overlay' onClick={handleOutsideClick}>
                    <div className='dialog'>
                        <ToggleModalToothbrush toggle={toggleModalToothbrush} />
                    </div>
                </div>
            )}
            <h2>Taille</h2>
            <div className='product-options-grid'>
                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    slidesPerView={5}
                    grabCursor={true}
                    mousewheel={true}
                    modules={[Mousewheel, Pagination]}
                    centeredSlides={true}
                    initialSlide={
                        /^\d+(\.\d+)?$/.test(sizeType)
                            ? selectedSize
                            : selectedClotheSize
                    }
                    className='product-swiper'
                    slideToClickedSlide={true}
                    onSlideChange={handleSlideChange}
                    spaceBetween={-40}
                >
                    {sortedValues.map(
                        (
                            { value, isAvailable, isActive, to }: any,
                            index: any
                        ) => (
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
                                            opacity:
                                                isSoon === 'true'
                                                    ? 0.2
                                                    : isAvailable
                                                    ? 1
                                                    : 0.2,
                                        }}
                                    >
                                        {value.split(' ') ? (
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    color:
                                                        variants?.find(
                                                            (variant: any) =>
                                                                variant
                                                                    .selectedOptions[0]
                                                                    ?.value ===
                                                                value
                                                        )?.weight === 1
                                                            ? '#a422f7'
                                                            : '#fff',
                                                }}
                                            >
                                                {value?.split(' ')[0]}
                                                <span
                                                    style={{
                                                        fontSize: '12px',
                                                        position: 'absolute',
                                                        top: '0',
                                                        color: variants?.find(
                                                            (variant: any) =>
                                                                variant
                                                                    .selectedOptions[0]
                                                                    ?.value ===
                                                                value
                                                        )?.availableForSale
                                                            ? 'white'
                                                            : 'red',
                                                    }}
                                                >
                                                    {value?.split(' ')[1]}
                                                </span>
                                            </div>
                                        ) : (
                                            <p>{value}</p>
                                        )}
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
                    <NavButtons next={nexto} previous={previo} />
                </div>
            </div>
            <button
                onClick={width > 768 ? toggleModalToothbrush : openCronws}
                className='sizes-guid'
                style={{
                    color: '#000 !important',
                }}
            >
                Guide des tailles
            </button>
            {crownsOpen && <Crowns isOpen={openCronws} onClose={closeCrowns} />}
        </div>
    )
}

function NavButtons({ next, previous }: any) {
    return (
        <div className='navigation-buttons'>
            <button onClick={previous}>
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
            <button onClick={next}>
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
                        style={{
                            opacity: disabled ? 0.5 : 1,
                            color: '#000 !important',
                        }}
                        className='add-to-cart'
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
    weight
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
      soon: metafield(namespace: "custom", key: "soon") {
        key
        value
      }
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
  manwoman: metafield(namespace: "custom", key: "manwoman") {
    key
    value
  }
  box: metafield(namespace: "custom", key: "box_sizing") {
    key
    value
  }
  soon: metafield(namespace: "custom", key: "soon") {
    key
    value
  }
  collections(first: 5) {
    nodes {
      title
      id
      products(first: 25) {
        nodes {
          title
          handle
          productType
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
          manwoman: metafield(namespace: "custom", key: "manwoman") {
            key
            value
          }
          box: metafield(namespace: "custom", key: "box_sizing") {
            key
            value
          }
          soon: metafield(namespace: "custom", key: "soon") {
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

const FILTERS_QUERY = `#graphql
fragment ProductFragment on Product {
  id
  title
  vendor
  handle
  description
  options {
    name
    values
  }
  images(first: 1) {
    nodes {
      url
    }
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
  colors: metafield(namespace: "custom", key: "couleurs") {
    key
    value
  }
  box_sizing: metafield(namespace: "custom", key: "box_sizing") {
    key
    value
  }
 soon: metafield(namespace: "custom", key: "soon") {
    key
    value
  }
  box: metafield(namespace: "custom", key: "box_sizing"){
    key
    value
   }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
}

query FiltersQuery($first: Int!, $filters: [ProductFilter!], $collections: String, $startCursor: String, $endCursor: String) {
  collections(query: $collections, first: 1) {
  nodes {
    products(
      first: $first
      filters: $filters
      before: $startCursor
      after: $endCursor
    ) {
      nodes {
        ...ProductFragment
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
}
}
`
