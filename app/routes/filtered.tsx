import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { defer, LoaderFunctionArgs } from '@shopify/remix-oxygen'
import MainProduct from '~/components/Common/mainProduct'
import React from 'react'

export const meta: MetaFunction = () => {
    return [{ title: 'filtered' }]
}

export async function loader({ context, request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)
    // 3 metafields
    const genre = searchParams.getAll('genre')
    const colors = searchParams.getAll('colors')
    const materials = searchParams.getAll('materials')

    // tags 2
    const textiles = searchParams.getAll('textiles')
    const accessories = searchParams.getAll('accessories')

    // variants 2
    const size = searchParams.getAll('size')
    const price = searchParams.getAll('price')

    // normal 2
    const productType = searchParams.getAll('productType')
    const brand = searchParams.getAll('productVendor')

    // collection

    const collection = searchParams.getAll('collection')

    const formatProductType = productType.map((category: any) => ({
        productType: category,
    }))

    const formatBrandType = brand.map((brand: any) => ({
        brand: brand,
    }))

    const formatTextiles = textiles.map((textile: any) => ({
        tags: textile,
    }))

    const formatAccessories = accessories.map((accessory: any) => ({
        tags: accessory,
    }))

    const products = await context.storefront.query(FILTERS_QUERY, {
        variables: {
            first: 50,
            filters: formatProductType,
        },
    })

    return defer({ products, formatProductType, formatBrandType })
}

export default function filtered() {
    const { products } = useLoaderData<typeof loader>()
    const { formatProductType, formatBrandType } =
        useLoaderData<typeof loader>()
    console.log(formatProductType.concat(formatBrandType))

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
                        <div className='panel-products-grid'>
                            {/*{productList.map((product: any) => (*/}
                            {/*    <MainProduct product={product} />*/}
                            {/*))}*/}
                            no products yet
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

const FILTERS_QUERY = `#graphql
fragment ProductFragment on Product {
  id
  title
  handle
  tags
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
}

query FiltersQuery($first: Int!, $filters: [ProductFilter!]) {
  collection(handle: "all") {
    products(first: $first, filters: $filters) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
}

`
