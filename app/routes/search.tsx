import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { getPaginationVariables } from '@shopify/hydrogen'
import MainProduct from '~/components/Common/mainProduct'
import React, { useState } from 'react'

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
    const { searchResults } = useLoaderData<typeof loader>()
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
                    {/* <img src="/home/bg-filters.png" alt="filter" /> */}
                    <div className='filter-sticky'>
                        <h1>filtres</h1>
                        {/* <p>Modifier vos filtres</p> */}
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
                    <button>Accéder aux filtres</button>
                </div>
                <div className='hinfos'>
                    <div className='hbox'>
                        <div
                            style={{
                                backgroundColor: 'green',
                                width: '150px',
                                height: '260px',
                            }}
                        ></div>
                        <div className='htext'>
                            <h1>EXCLUSIVITÉ À VOTRE PORTÉE</h1>
                            <p>
                                « Exclusif ne signifie pas inaccessible. Sur
                                Trackt, nous vous ouvrons les portes d’un monde
                                où l’exclusivité et le style se rencontrent. Des
                                éditions limitées, des collaborations uniques,
                                et des trouvailles rares – tout est sélectionné
                                pour vous offrir une expérience de mode
                                streetwear hors du commun. Notre sélection est
                                votre passeport pour un style qui se démarque,
                                pour des pièces que tout le monde ne peut pas
                                avoir. Avec Trackt, habillez-vous dans ce qui
                                définit le futur du streetwear, aujourd’hui. »
                            </p>
                        </div>
                    </div>
                    <div
                        className='hbox'
                        style={{
                            marginLeft: '35px',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'green',
                                width: '150px',
                                height: '260px',
                            }}
                        ></div>
                        <div className='htext'>
                            <h1>EXCLUSIVITÉ À VOTRE PORTÉE</h1>
                            <p>
                                « Exclusif ne signifie pas inaccessible. Sur
                                Trackt, nous vous ouvrons les portes d’un monde
                                où l’exclusivité et le style se rencontrent. Des
                                éditions limitées, des collaborations uniques,
                                et des trouvailles rares – tout est sélectionné
                                pour vous offrir une expérience de mode
                                streetwear hors du commun. Notre sélection est
                                votre passeport pour un style qui se démarque,
                                pour des pièces que tout le monde ne peut pas
                                avoir. Avec Trackt, habillez-vous dans ce qui
                                définit le futur du streetwear, aujourd’hui. »
                            </p>
                        </div>
                    </div>
                </div>
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
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
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
    pages: search(
      query: $query,
      types: [PAGE],
      first: 10
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    articles: search(
      query: $query,
      types: [ARTICLE],
      first: 10
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
  }
` as const
