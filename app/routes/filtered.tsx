import { useLoaderData, type MetaFunction, Link } from '@remix-run/react'
import { defer, LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { getPaginationVariables, Pagination } from '@shopify/hydrogen'
import MainProduct from '~/components/Common/mainProduct'
import React, { useState } from 'react'
import MarketDrag from '~/components/Common/MarketDrag'
import GoFilters from '~/components/Common/GoFilters'
import TrackT from '~/components/Common/TrackT'
import useWindowDimension from '~/hooks/useWindowDimension'
import SearchOptions from '~/components/Common/Modals/SearchOptions'

export const meta: MetaFunction = () => {
    return [{ title: 'filtered' }]
}

export async function loader({ context, request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)
    const allProducts = await context.storefront.query(RANDOM_ITEM)

    const getcollection = searchParams.getAll('collection')
    const genre = searchParams.getAll('manwoman')
    const getColors = searchParams.getAll('palette')
    const getTags = searchParams.getAll('tag')
    const getPrice = searchParams.getAll('price')
    const getProductVendor = searchParams.getAll('productVendor')
    const getNew = searchParams.getAll('new')
    const hotDeal = searchParams.getAll('hotdeal')
    const promotion = searchParams.getAll('promotion')
    const fast = searchParams.getAll('fast')
    const release = searchParams.getAll('release')
    const soon = searchParams.getAll('soon')

    // collection

    function formatCollection(titles: any) {
        let titleString = ''

        if (titles?.length === 0) {
            titleString = 'title:all'
        } else if (titles?.length === 1) {
            titleString = `title:${titles[0]}`
        } else {
            titleString = titles
                .map((title: any) => `title:${title}`)
                .join(' OR ')
        }

        return titleString
    }

    const collections = formatCollection(getcollection)

    const manwoman = genre.map((manwoman: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'manwoman',
            value: manwoman.charAt(0).toUpperCase() + manwoman.slice(1),
        },
    }))

    const tag = getTags.map((tag: any) => ({
        tag: tag,
    }))

    const colors = getColors.map((color: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'palette',
            value: color,
        },
    }))

    const stickerNew = getNew.map((newItem: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'new',
            value: newItem,
        },
    }))

    const stickerHotDeal = hotDeal.map((hotdeal: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'hotDeal',
            value: hotdeal,
        },
    }))

    const stickerPromotion = promotion.map((promotion: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'promotion',
            value: promotion,
        },
    }))

    const stickerFast = fast.map((fast: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'fastShip',
            value: fast,
        },
    }))

    const stickerRelease = release.map((release: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'release',
            value: release,
        },
    }))

    const stickerSoon = soon.map((soon: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'soon',
            value: soon,
        },
    }))

    const productVendor = getProductVendor.map((brand: any) => ({
        productVendor: brand,
    }))

    // const size = getSize.map((size: any) => ({
    //     size: size,
    // }))

    const price = getPrice.map((price: any) => ({
        price: price,
    }))

    // format to send to shopify

    const allFitlers = [
        ...manwoman,
        ...tag,
        ...colors,
        ...productVendor,
        ...price,
        ...stickerNew,
        ...stickerHotDeal,
        ...stickerPromotion,
        ...stickerFast,
        ...stickerRelease,
        ...stickerSoon,
    ]

    const pagination = getPaginationVariables(request, {
        pageBy: 24,
    })

    const products = await context.storefront.query(FILTERS_QUERY, {
        variables: {
            first: 250,
            filters: allFitlers,
            collections: collections,
            ...pagination,
        },
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
        products,
        allFitlers,
        allProducts,
        randomProduct,
        metafieldRandom,
    })
}

export default function filtered() {
    const {
        products,
        allFitlers,
        allProducts,
        randomProduct,
        metafieldRandom,
    } = useLoaderData<typeof loader>()
    const productList = products.collections.nodes[0].products
    const all = allProducts?.collection?.products?.nodes
    const carousel = randomProduct.collections.nodes[0].products.nodes
    const [randomProducts, setRandomProducts] = useState([]) as any
    const [isRandom, setIsRandom] = useState(false)
    const useWidth = useWindowDimension()
    const width = useWidth.width || 1920
    const handleRandomizeProducts = () => {
        if (all && all.length > 0) {
            const copiedProducts = [...all]
            const shuffledProducts = copiedProducts.sort(
                () => Math.random() - 0.5
            )
            const selectedProducts = shuffledProducts.slice(0, 20)
            setRandomProducts(selectedProducts)
            setIsRandom(true)
        }
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

    return (
        <>
            <div
                className='panel-trackt'
                style={{
                    marginTop: width > 768 ? '200px' : '140px',
                    justifyContent:
                        productList.nodes?.length === 0 ? 'center' : '',
                }}
            >
                <div className='search'>
                    <div className='search-container'>
                        {productList.nodes?.length > 0 ? (
                            <>
                                <div className='search-txt'>
                                    <h2>SÉLECTION PERSONNALISÉE</h2>
                                    <p>
                                        Voici les articles qui correspondent à
                                        votre recherche. Ajustez vos critères si
                                        vous souhaitez affiner vos résultats ou
                                        alors tentez la recherche ‘random’.
                                    </p>
                                    <div
                                        className='four-btns'
                                        style={{
                                            marginTop: '30px',
                                        }}
                                    >
                                        <Link to='/filters'>
                                            <button>
                                                <img
                                                    src='/filters/checkbox.png'
                                                    alt='check'
                                                    style={{
                                                        width: '20px',
                                                        marginRight: '10px',
                                                    }}
                                                />
                                                Rechercher par filtres
                                            </button>
                                        </Link>

                                        <a href='#categories-aside'>
                                            <button>
                                                Shopping par catégories
                                            </button>
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
                                    </div>
                                </div>
                                <div
                                    className='search-img'
                                    onClick={handleRandomizeProducts}
                                >
                                    <video
                                        src='/randomItem.mp4'
                                        autoPlay
                                        muted
                                        playsInline
                                        loop
                                        style={{
                                            width:
                                                width > 768 ? '360px' : '250px',
                                        }}
                                    >
                                        <img
                                            src='/randomItem.png'
                                            alt='search'
                                        />
                                    </video>
                                </div>
                            </>
                        ) : (
                            <div className='search-empty'>
                                <div className='search-empty-top'>
                                    <h3>
                                        VOTRE RECHERCHE N’A FOURNI AUCUN
                                        RÉSULTAT
                                    </h3>
                                    <p>
                                        Réessayez, vous avez le choix entre
                                        plusieurs options !
                                    </p>
                                </div>
                                {width > 768 ? (
                                    <div className='four-btns'>
                                        <Link to='/filters'>
                                            <button>
                                                <img
                                                    src='/filters/checkbox.png'
                                                    alt='check'
                                                    style={{
                                                        width: '20px',
                                                        marginRight: '10px',
                                                    }}
                                                />
                                                Rechercher par filtres
                                            </button>
                                        </Link>

                                        <a href='#categories-aside'>
                                            <button>
                                                Shopping par catégories
                                            </button>
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
                                                    alt='arrow'
                                                    style={{
                                                        marginRight: '10px',
                                                    }}
                                                />
                                                Random item
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    <SearchOptions />
                                )}
                            </div>
                        )}
                    </div>
                    <div
                        style={{
                            marginTop: '70px',
                            marginLeft: 'unset',
                            paddingLeft: 'unset !important',
                            marginBottom: width > 768 ? '' : '50px',
                        }}
                        className='panel-container'
                    >
                        {isRandom ? (
                            width > 768 ? (
                                <div className='panel-products-grid'>
                                    <div className='panel-products-grid'>
                                        {randomProducts.map(
                                            (product: any, index: number) => {
                                                return (
                                                    <MainProduct
                                                        key={index}
                                                        product={product}
                                                    />
                                                )
                                            }
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className='responsive-products-grid'>
                                    {randomProducts.map(
                                        (product: any, index: number) => {
                                            return (
                                                <MainProduct
                                                    key={index}
                                                    product={product}
                                                    isDouble={true}
                                                />
                                            )
                                        }
                                    )}
                                </div>
                            )
                        ) : (
                            <Pagination connection={productList}>
                                {({
                                    nodes,
                                    NextLink,
                                    PreviousLink,
                                    isLoading,
                                }) => (
                                    <>
                                        <PreviousLink>
                                            <div>
                                                <button>
                                                    {isLoading
                                                        ? 'Chargement...'
                                                        : 'Charger les produits précédents'}
                                                </button>
                                            </div>
                                        </PreviousLink>
                                        {width > 768 ? (
                                            <div className='panel-products-grid'>
                                                <div className='panel-products-grid'>
                                                    {nodes.map((product) => (
                                                        <MainProduct
                                                            product={product}
                                                            quantity={
                                                                products?.nodes
                                                                    ?.length
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='responsive-products-grid'>
                                                {nodes.map((product) => (
                                                    <MainProduct
                                                        product={product}
                                                        isDouble={true}
                                                        quantity={
                                                            products?.nodes
                                                                ?.length
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        <div className='pagination'>
                                            <NextLink>
                                                <button
                                                    style={{
                                                        color: '#000',
                                                    }}
                                                >
                                                    {isLoading
                                                        ? 'Chargement...'
                                                        : 'Plus de produits'}
                                                </button>
                                            </NextLink>
                                        </div>
                                    </>
                                )}
                            </Pagination>
                        )}
                        {/*<div className='panel-products-grid'>*/}
                        {/*    {productList.nodes.map((product: any) => (*/}
                        {/*        <MainProduct product={product} />*/}
                        {/*    ))}*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
            {productList.nodes?.length > 0 && (
                <div
                    className='hfooter'
                    style={{
                        backgroundColor: '#000',
                    }}
                >
                    {width > 768 ? <GoFilters /> : <SearchOptions />}
                    {width > 768 && (
                        <>
                            <div
                                style={{
                                    width: '100%',
                                    height: '10px',
                                    backgroundColor: '#121212',
                                    marginBottom: '60px',
                                }}
                            ></div>
                            <video
                                src='/product/banner.mp4'
                                autoPlay
                                muted
                                playsInline
                                loop
                            />
                            <TrackT
                                products={carousel}
                                title={randomNameFunction()}
                            />
                            <MarketDrag />
                        </>
                    )}
                </div>
            )}
        </>
    )
}

const FILTERS_QUERY = `#graphql
fragment ProductFragment on Product {
  id
  title
  vendor
  handle
  description
  productType
  tags
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
  colors: metafield(namespace: "custom", key: "palette") {
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
  manwoman: metafield(namespace: "custom", key: "manwoman") {
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
  collections(query: $collections, first: 10) {
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

const RANDOM_ITEM = `#graphql
query Collection {
  collection(handle: "all") {
    products(first: 250) {
      nodes {
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
          box_sizing: metafield(namespace: "custom", key: "box_sizing") {
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
` as const
