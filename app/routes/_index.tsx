import { json, redirect, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { useLoaderData, Link, type MetaFunction } from "@remix-run/react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `Hydrogen ` }];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const products = await context.storefront.query(HOME_PRODUCTS_QUERY);

    return json({ products });
}

export default function HomePage() {
    const { products } = useLoaderData<typeof loader>();
    const productsList = products.metaobjects.edges[0].node.fields[0].references.nodes;
    console.log(productsList);
    return (
        <div
            style={{
                backgroundColor: "#000",
            }}
        >
            <div className="home">
                <button className="home-btn">Shop now</button>
            </div>
            <div className="panel-trackt">
                <div className="filter-trackt">
                    {/* <img src="/home/bg-filters.png" alt="filter" /> */}
                    <div className="filter-sticky">
                        <h1>filtres</h1>
                        {/* <p>Modifier vos filtres</p> */}
                    </div>
                </div>
                <div className="panel-container">
                    <div className="header">
                        <h1>Panel Trackt</h1>
                        <p>
                            Découvrez le Panel Trackt, une sélection soigneusement élaborée de ce que le streetwear a de mieux à offrir. Ici, nous rassemblons des pièces
                            uniques, des tendances émergentes et des collaborations exclusives, tout en un seul endroit pour enrichir votre expérience de shopping. Chaque
                            visite au Panel Trackt est une nouvelle aventure. Explorez, découvrez, et laissez-vous inspirer. Bienvenue dans l&apos;avenir du shopping
                            streetwear!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const HOME_PRODUCTS_QUERY = `#graphql
query MetaObjects {
    metaobjects(first: 10, type: "home_page_products") {
      edges {
        node {
          fields {
            references(first: 10) {
              nodes {
                ... on Product {
                	title 
                    productType
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
` as const;

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
