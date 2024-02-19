import { useLoaderData, type MetaFunction, Link } from '@remix-run/react'
import { defer, LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { getPaginationVariables, Pagination } from '@shopify/hydrogen'
import MainProduct from '~/components/Common/mainProduct'
import React from 'react'
import MarketDrag from '~/components/Common/MarketDrag'

export const meta: MetaFunction = () => {
    return [{ title: 'filtered' }]
}

export async function loader({ context, request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)

    const getcollection = searchParams.getAll('collection')
    const genre = searchParams.getAll('manwoman')
    const getColors = searchParams.getAll('colors')
    const getMaterials = searchParams.getAll('materials')
    const getTags = searchParams.getAll('tags')
    const getSize = searchParams.getAll('size')
    const getPrice = searchParams.getAll('price')
    const getProductType = searchParams.getAll('productType')
    const getProductVendor = searchParams.getAll('productVendor')
    const getNew = searchParams.getAll('new')
    const hotDeal = searchParams.getAll('hotdeal')
    const promotion = searchParams.getAll('promotion')
    const fast = searchParams.getAll('fast')
    const release = searchParams.getAll('release')

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
            value: manwoman,
        },
    }))

    const productType = getProductType.map((category: any) => ({
        productType: category,
    }))

    const tags = getTags.map((tag: any) => ({
        tags: tag,
    }))

    const colors = getColors.map((color: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'palette',
            value: color,
        },
    }))

    const materials = getMaterials.map((material: any) => ({
        productMetafield: {
            namespace: 'custom',
            key: 'materiaux',
            value: material,
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
        ...productType,
        ...tags,
        ...colors,
        ...materials,
        ...productVendor,
        ...price,
        ...stickerNew,
        ...stickerHotDeal,
        ...stickerPromotion,
        ...stickerFast,
        ...stickerRelease,
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

    return defer({ products, allFitlers })
}

export default function filtered() {
    const { products, allFitlers } = useLoaderData<typeof loader>()

    const productList = products.collections.nodes[0].products

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
                        <div className='search-img'>
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
                        <Pagination connection={productList}>
                            {({ nodes, NextLink, PreviousLink, isLoading }) => (
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
                                    <div className='panel-products-grid'>
                                        {nodes.map((product) => (
                                            <MainProduct product={product} />
                                        ))}
                                    </div>
                                    <div className='pagination'>
                                        <NextLink>
                                            <button>
                                                {isLoading
                                                    ? 'Chargement...'
                                                    : 'Plus de produits'}
                                            </button>
                                        </NextLink>
                                    </div>
                                </>
                            )}
                        </Pagination>
                        {/*<div className='panel-products-grid'>*/}
                        {/*    {productList.nodes.map((product: any) => (*/}
                        {/*        <MainProduct product={product} />*/}
                        {/*    ))}*/}
                        {/*</div>*/}
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
