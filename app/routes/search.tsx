import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { getPaginationVariables } from '@shopify/hydrogen'

import { SearchForm, SearchResults, NoSearchResults } from '~/components/Search'

export const meta: MetaFunction = () => {
    return [{ title: `Hydrogen | Search` }]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)
    const variables = getPaginationVariables(request, { pageBy: 8 })
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

    const totalResults = Object.values(data).reduce((total, value) => {
        return total + value.nodes.length
    }, 0)

    const searchResults = {
        results: data,
        totalResults,
    }

    return defer({ searchTerm, searchResults })
}

export default function SearchPage() {
    const { searchTerm, searchResults } = useLoaderData<typeof loader>()

    const products = searchResults?.results?.products

    console.log(products)

    return (
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
                            Vous avez plongé dans l’univers de Trackt, et voici
                            ce que nous avons déniché pour vous. Notre sélection
                            raffinée reflète votre recherche et les filtres que
                            vous avez appliqués, vous offrant une gamme de
                            produits qui s’alignent avec votre quête de style et
                            de qualité. De la touche classique des Jordan 1 aux
                            dernières tendances streetwear, chaque pièce de
                            notre collection a été soigneusement sélectionnée
                            pour répondre à vos attentes de mode urbaine.
                        </p>
                        <button>Nouvelle recherche</button>
                    </div>
                    <div className='search-img'>
                        <img src='/randomItem.png' alt='search' />
                    </div>
                </div>
                <SearchForm searchTerm={searchTerm} />
                {!searchTerm || !searchResults.totalResults ? (
                    <NoSearchResults />
                ) : (
                    <SearchResults results={searchResults.results} />
                )}
            </div>
        </div>
    )
}

const SEARCH_QUERY = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
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
