import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { useLoaderData, type MetaFunction, Link } from '@remix-run/react'
import { getPaginationVariables } from '@shopify/hydrogen'
import MainProduct from '~/components/Common/mainProduct'
import React, { useState } from 'react'
import MarketDrag from '~/components/Common/MarketDrag'

export const meta: MetaFunction = () => {
    return [{ title: `Hydrogen | Search` }]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)
    const variables = getPaginationVariables(request, { pageBy: 50 })
    const searchTerm = String(searchParams.get('q') || '')

    if (!searchTerm) {
        return {
            searchResults: { results: null, totalResults: 0 },
            searchTerm,
        }
    }

    console.log('variables', variables)

    const data = await context.storefront.query(SEARCH_QUERY, {
        variables: {
            query: searchTerm,
            ...variables,
        },
    })

    if (!data) {
        throw new Error('No search data returned from Shopify API')
    }

    const searchResults = {
        results: data,
    }

    return defer({ searchTerm, searchResults })
}

export default function SearchPage() {
    const { searchResults, searchTerm } = useLoaderData<typeof loader>()
    const products = searchResults?.results?.products?.nodes
    const [productList, setProductList] = useState(products?.slice(0, 12))
    function shuffleProducts() {
        const shuffledProducts = [...products]
        shuffledProducts.sort(() => Math.random() - 0.5)
        setProductList(shuffledProducts?.slice(0, 12))
    }

    return (
        <>
            <div className='panel-trackt'>
                <div className='filter-trackt'>
                    <div className='filter-sticky'>
                        <Link to='/filters'>
                            <h1>filtres</h1>
                        </Link>
                    </div>
                </div>
                <div className='search'>
                    <div className='search-container'>
                        <div className='search-txt'>
                            <h1>VOTRE RECHERCHE PERSONNALISÉE CHEZ TRACKT</h1>
                            <p>
                                Vous avez plongé dans l’univers de Trackt, et
                                voici ce que nous avons déniché pour vous. Notre
                                sélection raffinée reflète votre recherche et
                                les filtres que vous avez appliqués, vous
                                offrant une gamme de produits qui s’alignent
                                avec votre quête de style et de qualité. De la
                                touche classique des Jordan 1 aux dernières
                                tendances streetwear, chaque pièce de notre
                                collection a été soigneusement sélectionnée pour
                                répondre à vos attentes de mode urbaine.
                            </p>
                            <a href='#search-aside'>
                                <button>Nouvelle recherche</button>
                            </a>
                        </div>
                        <div className='search-img' onClick={shuffleProducts}>
                            <img src='/randomItem.png' alt='search' />
                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: '70px',
                            marginLeft: 'unset',
                        }}
                        className='panel-container'
                    >
                        <div className='panel-products-grid'>
                            {productList.map((product: any) => (
                                <MainProduct product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className='hfooter'
                style={{
                    backgroundColor: '#000',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: '#121212',
                    }}
                ></div>
                <div className='gofilters'>
                    <h1>Pas encore trouvé votre perle rare ?</h1>
                    <p>
                        Nous avons une multitude de styles et de pièces uniques,
                        mais nous savons que parfois, vous cherchez quelque
                        chose de très spécifique. <br />
                        Si vous n’avez pas encore trouvé exactement ce que vous
                        voulez dans notre Panel Trackt, nous sommes là pour vous
                        aider.
                    </p>
                    <div className='gofilters-btn'>
                        <img src='/home/btn.png' alt='btn' />
                        <p>accéder aux filtres</p>
                    </div>
                </div>

                <MarketDrag />
            </div>
        </>
    )
}

const SEARCH_QUERY = `#graphql
  fragment SearchProduct on Product {
    __typename
      title
      productType
      handle
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
  query search(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $query: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query,
      unavailableProducts: HIDE,
      types: [PRODUCT],
      first: $first,
      sortKey: RELEVANCE,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...on Product {
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
