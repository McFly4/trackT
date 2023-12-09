import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { Link, type MetaFunction, useLoaderData } from '@remix-run/react'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `Hydrogen ` }]
}

export async function loader({ context }: LoaderFunctionArgs) {
    const products = await context.storefront.query(HOME_PRODUCTS_QUERY)

    return json({ products })
}

export default function HomePage() {
    const { products } = useLoaderData<typeof loader>()
    const productsList =
        products.metaobjects.edges[0].node.fields[0].references.nodes

    const firstList = productsList.slice(0, 12)
    const secondList = productsList.slice(12, 16)
    const thirdList = productsList.slice(16, 20)

    return (
        <div
            style={{
                backgroundColor: '#000',
            }}
        >
            <div className='home'>
                <a href='#shop'>
                    <button className='home-btn'>Shop now</button>
                </a>
            </div>
            <div className='panel-trackt'>
                <div className='filter-trackt'>
                    {/* <img src="/home/bg-filters.png" alt="filter" /> */}
                    <div className='filter-sticky'>
                        <h1>filtres</h1>
                        {/* <p>Modifier vos filtres</p> */}
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div className='panel-container'>
                        <div className='header' id='shop'>
                            <h1>Panel Trackt</h1>
                            <p>
                                Découvrez le Panel Trackt, une sélection
                                soigneusement élaborée de ce que le streetwear a
                                de mieux à offrir. Ici, nous rassemblons des
                                pièces uniques, des tendances émergentes et des
                                collaborations exclusives, tout en un seul
                                endroit pour enrichir votre expérience de
                                shopping. Chaque visite au Panel Trackt est une
                                nouvelle aventure. Explorez, découvrez, et
                                laissez-vous inspirer. Bienvenue dans
                                l&apos;avenir du shopping streetwear!
                            </p>
                        </div>
                        <div className='panel-products-grid'>
                            {firstList.map((product: any) => (
                                <div className='product-grid'>
                                    <Link
                                        key={product.title}
                                        to={`/products/${product.handle}`}
                                    >
                                        <div className='product-img-grid'>
                                            <img
                                                src={
                                                    product.images.nodes[0].url
                                                }
                                                alt={product.title}
                                            />
                                        </div>
                                        <div className='product-info-grid'>
                                            <h3>{product.productType}</h3>
                                            <p>{product.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='panel-container second-panel'>
                        <div
                            style={{
                                padding: '60px 60px 80px 60px',
                                backgroundColor: '#1e1e1e',
                                color: '#fff',
                                width: '750px',
                            }}
                        >
                            <div
                                style={{
                                    width: '590px',
                                    height: '340px',
                                    backgroundColor: '#3950D3',
                                }}
                            ></div>
                            <h2
                                style={{
                                    color: '#3950D3',
                                    marginTop: '80px',
                                    marginBottom: '10px',
                                }}
                            >
                                AUTHENTICITÉ GARANTIE
                            </h2>
                            <p>
                                « Plongez dans l’univers Trackt, où chaque pièce
                                raconte une histoire, chaque design reflète une
                                passion. Ici, l’authenticité n’est pas juste un
                                mot à la mode - c’est notre essence. Nous curons
                                méticuleusement nos collections pour vous offrir
                                des pièces authentiques et chargées d’histoire,
                                directement issues des créateurs les plus
                                novateurs du streetwear. Chez Trackt, chaque
                                article est une promesse de qualité et
                                d’originalité. Vous ne trouverez pas juste des
                                vêtements ici, mais des expressions de l’art de
                                la rue, des pièces qui parlent de créativité et
                                d’individualité. »
                            </p>
                        </div>
                        <div
                            className='panel-products-grid'
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {secondList.map((product: any) => (
                                <div className='product-grid'>
                                    <Link
                                        key={product.title}
                                        to={`/products/${product.handle}`}
                                    >
                                        <div className='product-img-grid'>
                                            <img
                                                src={
                                                    product.images.nodes[0].url
                                                }
                                                alt={product.title}
                                            />
                                        </div>
                                        <div className='product-info-grid'>
                                            <h3>{product.productType}</h3>
                                            <p>{product.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>{' '}
                    <div
                        className='panel-container second-panel'
                        style={{
                            marginTop: '125px',
                            marginLeft: 'unset !important',
                            marginRight: '60px',
                        }}
                    >
                        <div
                            className='panel-products-grid'
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {thirdList.map((product: any) => (
                                <div className='product-grid'>
                                    <Link
                                        key={product.title}
                                        to={`/products/${product.handle}`}
                                    >
                                        <div className='product-img-grid'>
                                            <img
                                                src={
                                                    product.images.nodes[0].url
                                                }
                                                alt={product.title}
                                            />
                                        </div>
                                        <div className='product-info-grid'>
                                            <h3>{product.productType}</h3>
                                            <p>{product.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                padding: '60px 60px 80px 60px',
                                backgroundColor: '#1e1e1e',
                                color: '#fff',
                                width: '750px',
                            }}
                        >
                            <div
                                style={{
                                    width: '590px',
                                    height: '340px',
                                    backgroundColor: '#E51E1A',
                                }}
                            ></div>
                            <h2
                                style={{
                                    color: '#E51E1A',
                                    marginTop: '80px',
                                    marginBottom: '10px',
                                }}
                            >
                                AUTHENTICITÉ GARANTIE
                            </h2>
                            <p>
                                Entrez dans l’univers Trackt, où chaque
                                interaction est une expérience unique. Notre
                                équipe dédiée au support client est le cœur
                                battant de notre atelier mystérieux. Nous sommes
                                là pour vous guider, vous inspirer et répondre à
                                vos questions avec une touche personnelle.{' '}
                                <br /> <br />
                                Que vous cherchiez des conseils sur la dernière
                                tendance ou des détails sur une pièce rare,
                                notre équipe, en coulisses, travaille avec
                                passion pour vous offrir une assistance
                                sur-mesure. C’est le conseil d’un connaisseur,
                                le soutien d’un ami, le secret d’un atelier où
                                chaque question trouve sa réponse.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='hfooter'>
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
                                « Exclusif ne signifie pas inaccessible. Sur
                                Trackt, nous vous ouvrons les portes d’un monde
                                où l’exclusivité et le style se rencontrent. Des
                                éditions limitées, des collaborations uniques,
                                et des trouvailles rares – tout est sélectionné
                                pour vous offrir une expérience de mode
                                streetwear hors du commun. Notre sélection est
                                votre passeport pour un style qui se démarque,
                                pour des pièces que tout le monde ne peut pas
                                avoir. Avec Trackt, habillez-vous dans ce qui
                                définit le futur du streetwear, aujourd’hui. »
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
                                « Exclusif ne signifie pas inaccessible. Sur
                                Trackt, nous vous ouvrons les portes d’un monde
                                où l’exclusivité et le style se rencontrent. Des
                                éditions limitées, des collaborations uniques,
                                et des trouvailles rares – tout est sélectionné
                                pour vous offrir une expérience de mode
                                streetwear hors du commun. Notre sélection est
                                votre passeport pour un style qui se démarque,
                                pour des pièces que tout le monde ne peut pas
                                avoir. Avec Trackt, habillez-vous dans ce qui
                                définit le futur du streetwear, aujourd’hui. »
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const HOME_PRODUCTS_QUERY = `#graphql
query MetaObjects {
metaobjects(first: 20, type: "home_page_products") {
edges {
  node {
  fields {
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
}
` as const

// import type { V2_MetaFunction } from "@shopify/remix-oxygen";
// import { defer, type LoaderArgs } from "@shopify/remix-oxygen";
// import { Await, useLoaderData, Link } from "@remix-run/react";
// import { Suspense } from "react";
// import { Image, Money } from "@shopify/hydrogen";
// import type { FeaturedCollectionFragment, RecommendedProductsQuery } from "storefrontapi.generated";

// export const meta: V2_MetaFunction = () => {
//     return [{ title: "TrackT" }];
// };

// export async function loader({ context }: LoaderArgs) {
//     const { storefront } = context;
//     const { collections } = await storefront.query(FEATURED_COLLECTION_QUERY);
//     const featuredCollection = collections.nodes[0];
//     const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

//     return defer({ featuredCollection, recommendedProducts });
// }

// export default function Homepage() {
//     const data = useLoaderData<typeof loader>();
//     return (
//         <div className="home">
//             <FeaturedCollection collection={data.featuredCollection} />
//             <RecommendedProducts products={data.recommendedProducts} />
//         </div>
//     );
// }

// function FeaturedCollection({ collection }: { collection: FeaturedCollectionFragment }) {
//     const image = collection.image;
//     return (
//         <Link className="featured-collection" to={`/collections/${collection.handle}`}>
//             {image && (
//                 <div className="featured-collection-image">
//                     <Image data={image} sizes="100vw" />
//                 </div>
//             )}
//             <h1>{collection.title}</h1>
//         </Link>
//     );
// }

// function RecommendedProducts({ products }: { products: Promise<RecommendedProductsQuery> }) {
//     return (
//         <div className="recommended-products">
//             <h2>Recommended Products</h2>
//             <Suspense fallback={<div>Loading...</div>}>
//                 <Await resolve={products}>
//                     {({ products }) => (
//                         <div className="recommended-products-grid">
//                             {products.nodes.map((product: any) => (
//                                 <Link key={product.id} className="recommended-product" to={`/products/${product.handle}`}>
//                                     <Image data={product.images.nodes[0]} aspectRatio="1/1" sizes="(min-width: 45em) 20vw, 50vw" />
//                                     <h4>{product.title}</h4>
//                                     <small>
//                                         <Money data={product.priceRange.minVariantPrice} />
//                                     </small>
//                                 </Link>
//                             ))}
//                         </div>
//                     )}
//                 </Await>
//             </Suspense>
//             <br />
//         </div>
//     );
// }

// const FEATURED_COLLECTION_QUERY = `#graphql
//   fragment FeaturedCollection on Collection {
//     id
//     title
//     image {
//       id
//       url
//       altText
//       width
//       height
//     }
//     handle
//   }
//   query FeaturedCollection($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...FeaturedCollection
//       }
//     }
//   }
// ` as const;

// const RECOMMENDED_PRODUCTS_QUERY = `#graphql
//   fragment RecommendedProduct on Product {
//     id
//     title
//     handle
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     images(first: 1) {
//       nodes {
//         id
//         url
//         altText
//         width
//         height
//       }
//     }
//   }
//   query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     products(first: 4, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...RecommendedProduct
//       }
//     }
//   }
// ` as const;
