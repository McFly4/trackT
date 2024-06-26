import { defer, json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { useLoaderData, type MetaFunction, Link } from '@remix-run/react'
import { getPaginationVariables, Pagination } from '@shopify/hydrogen'
import MainProduct from '~/components/Common/mainProduct'
import React, { useState } from 'react'
import MarketDrag from '~/components/Common/MarketDrag'
import TrackT from '~/components/Common/TrackT'
import GoFilters from '~/components/Common/GoFilters'
import useWindowDimension from '~/hooks/useWindowDimension'
import SearchOptions from '~/components/Common/Modals/SearchOptions'

export const meta: MetaFunction = () => {
  return [{ title: `Trackt | Search` }]
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
  const metafieldRandom = randomList[Math.floor(Math.random() * randomList.length)]

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
  const { searchResults, searchTerm, allProducts, randomProduct, metafieldRandom } = useLoaderData<
    typeof loader
  >() as any
  const carousel = randomProduct.collections.nodes[0].products.nodes
  const all = allProducts?.collection?.products?.nodes
  const products = searchResults?.results?.products
  const [randomProducts, setRandomProducts] = useState([]) as any
  const [isRandom, setIsRandom] = useState(false)
  const useWidth = useWindowDimension()
  const width = useWidth.width || 1920

  const handleRandomizeProducts = () => {
    if (all && all.length > 0) {
      const copiedProducts = [...all]
      const shuffledProducts = copiedProducts.sort(() => Math.random() - 0.5)
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
          justifyContent: products?.nodes?.length === 0 ? 'center' : '',
        }}
      >
        <div className='search'>
          <div className='search-container'>
            {products?.nodes?.length > 0 ? (
              <>
                <div className='search-txt'>
                  <h2>SÉLECTION PERSONNALISÉE</h2>
                  <p>
                    Voici les articles qui correspondent à votre recherche. Ajustez vos critères si vous souhaitez
                    affiner vos résultats ou alors tentez la recherche ‘random’.
                  </p>
                  {width > 768 ? (
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
                    </div>
                  ) : (
                    <SearchOptions />
                  )}
                </div>
                <div className='search-img' onClick={handleRandomizeProducts}>
                  <video
                    src='/randomItem.mp4'
                    autoPlay
                    muted
                    playsInline
                    loop
                    style={{
                      width: width > 768 ? '360px' : '280px',
                    }}
                  >
                    <img src='/randomItem.png' alt='search' />
                  </video>
                </div>
              </>
            ) : (
              <div className='search-empty'>
                <div className='search-empty-top'>
                  <h3>VOTRE RECHERCHE N’A FOURNI AUCUN RÉSULTAT</h3>
                  <p>Réessayez, vous avez le choix entre plusieurs options !</p>
                </div>
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
                        alt='arrow'
                        style={{
                          marginRight: '10px',
                          width: '20px',
                        }}
                      />
                      Random item
                    </button>
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
              width > 768 ? (
                <div className='panel-products-grid'>
                  <div className='panel-products-grid'>
                    {randomProducts.map((product: any, index: number) => {
                      return <MainProduct key={index} product={product} />
                    })}
                  </div>
                </div>
              ) : (
                <div className='responsive-products-grid'>
                  {randomProducts.map((product: any, index: number) => {
                    return <MainProduct isDouble={true} key={index} product={product} />
                  })}
                </div>
              )
            ) : (
              <Pagination connection={products}>
                {({ nodes, NextLink, PreviousLink, isLoading }) => (
                  <div
                    style={{
                      paddingBottom: '50px',
                    }}
                  >
                    <PreviousLink>
                      <div>
                        <button>{isLoading ? 'Chargement...' : 'Charger les produits précédents'}</button>
                      </div>
                    </PreviousLink>
                    {width > 768 ? (
                      <div className='panel-products-grid'>
                        <div className='panel-products-grid'>
                          {nodes.map((product) => (
                            <MainProduct product={product} quantity={products?.nodes?.length} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className='responsive-products-grid'>
                        {nodes.map((product) => (
                          <MainProduct isDouble={true} product={product} quantity={products?.nodes?.length} />
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
                          {isLoading ? 'Chargement...' : 'Afficher plus de résultats'}
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

              <TrackT products={carousel} title={randomNameFunction()} />
              <MarketDrag />
            </>
          )}
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
