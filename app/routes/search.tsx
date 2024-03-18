import { defer, json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { useLoaderData, type MetaFunction, Link } from '@remix-run/react'
import { getPaginationVariables, Pagination } from '@shopify/hydrogen'
import MainProduct from '~/components/Common/mainProduct'
import React, { useState } from 'react'
import MarketDrag from '~/components/Common/MarketDrag'
import TrackT from '~/components/Common/TrackT'
import GoFilters from '~/components/Common/GoFilters'

export const meta: MetaFunction = () => {
    return [{ title: `Hydrogen | Search` }]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const allProducts = await context.storefront.query(RANDOM_ITEM)

    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)
    const pagination = getPaginationVariables(request, {
        pageBy: 24,
    })

    const searchTerm = String(searchParams.get('q') || '')

    if (!searchTerm) {
        return {
            searchResults: { results: null, totalResults: 0 },
            searchTerm,
        }
    }

    const data = await context.storefront.query(SEARCH_QUERY, {
        variables: {
            query: searchTerm,
            first: 250,
            ...pagination,
        },
    })

    if (!data) {
        throw new Error('No search data returned from Shopify API')
    }

    const searchResults = {
        results: data,
    }

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
        searchTerm,
        searchResults,
        allProducts,
        randomProduct,
        metafieldRandom,
    })
}

export default function SearchPage() {
    const {
        searchResults,
        searchTerm,
        allProducts,
        randomProduct,
        metafieldRandom,
    } = useLoaderData<typeof loader>() as any
    const carousel = randomProduct.collections.nodes[0].products.nodes
    const carouselName = metafieldRandom
    const all = allProducts?.collection?.products?.nodes
    const products = searchResults?.results?.products
    const [randomProducts, setRandomProducts] = useState([]) as any
    const [isRandom, setIsRandom] = useState(false)

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

    return (
        <>
            <div
                className='panel-trackt'
                style={{
                    marginTop: '200px',
                    justifyContent:
                        products?.nodes?.length === 0 ? 'center' : '',
                }}
            >
                <div className='search'>
                    <div className='search-container'>
                        {products?.nodes?.length > 0 ? (
                            <>
                                <div className='search-txt'>
                                    <h1>SÉLECTION PERSONNALISÉE</h1>
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
                                                Rechercher par filtres
                                            </button>
                                        </Link>

                                        <Link to='/'>
                                            <button>
                                                Shopping par catégories
                                            </button>
                                        </Link>
                                        <Link to='#search-aside'>
                                            <button>
                                                <svg
                                                    id='icon'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width='21.548'
                                                    height='21.547'
                                                    viewBox='0 0 21.548 21.547'
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
                                        </Link>
                                    </div>
                                </div>
                                <div
                                    className='search-img'
                                    onClick={handleRandomizeProducts}
                                >
                                    <img src='/randomItem.png' alt='search' />
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
                                <div className='four-btns'>
                                    <Link to='/filters'>
                                        <button>Rechercher par filtres</button>
                                    </Link>

                                    <button>Shopping par catégories</button>
                                    <Link to='#search-aside'>
                                        <button>
                                            <svg
                                                id='icon'
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='21.548'
                                                height='21.547'
                                                viewBox='0 0 21.548 21.547'
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
                                    </Link>
                                    <Link to='/filtered'>
                                        <button>Random item</button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                    <div
                        style={{
                            marginTop: '70px',
                            marginLeft: 'unset',
                            paddingLeft: 'unset !important',
                        }}
                        className='panel-container'
                    >
                        {isRandom ? (
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
                            <Pagination connection={products}>
                                {({
                                    nodes,
                                    NextLink,
                                    PreviousLink,
                                    isLoading,
                                }) => (
                                    <div
                                        style={{
                                            paddingBottom: '50px',
                                        }}
                                    >
                                        <PreviousLink>
                                            <div>
                                                <button>
                                                    {isLoading
                                                        ? 'Chargement...'
                                                        : 'Charger les produits précédents'}
                                                </button>
                                            </div>
                                        </PreviousLink>
                                        <div className='panel-products-grid'>
                                            <div className='panel-products-grid'>
                                                {nodes.map((product) => (
                                                    <MainProduct
                                                        product={product}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className='pagination'>
                                            <NextLink>
                                                <button>
                                                    {isLoading
                                                        ? 'Chargement...'
                                                        : 'Afficher plus de résultats'}
                                                </button>
                                            </NextLink>
                                        </div>
                                    </div>
                                )}
                            </Pagination>
                        )}
                    </div>
                </div>
            </div>
            {products?.nodes?.length > 0 && (
                <div
                    className='hfooter'
                    style={{
                        backgroundColor: '#000',
                    }}
                >
                    <GoFilters />
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
                    <TrackT products={carousel} title={carouselName} />
                    <MarketDrag />
                </div>
            )}
        </>
    )
}

const SEARCH_QUERY = `#graphql
fragment SearchProduct on Product {
  __typename
  title
  productType
  handle
  vendor
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
  box: metafield(namespace: "custom", key: "box_sizing") {
    key
    value
  }
 soon: metafield(namespace: "custom", key: "soon") {
    key
    value
  }
  variants(first: 1) {
    nodes {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
}

query search($country: CountryCode, $endCursor: String, $first: Int, $language: LanguageCode, $last: Int, $query: String!, $startCursor: String) @inContext(country: $country, language: $language) {
  products: search(
    query: $query
    types: [PRODUCT]
    first: $first
    sortKey: RELEVANCE
    last: $last
    before: $startCursor
    after: $endCursor
  ) {
    nodes {
      ... on Product {
        ...SearchProduct
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
` as const

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
