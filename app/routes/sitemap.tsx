import { json, LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { useLoaderData, Link } from '@remix-run/react'

export async function loader({ context }: LoaderFunctionArgs) {
    const products = await context.storefront.query(ALL_PRODUCTS_QUERY)

    return json({ products })
}

export default function SiteMap() {
    const { products } = useLoaderData<typeof loader>()
    const allProducts = products?.products?.edges

    const numDivs = 5

    const sliceSize = Math.ceil(allProducts.length / numDivs)

    const productSlices = Array.from({ length: numDivs }, (_, index) =>
        allProducts.slice(index * sliceSize, (index + 1) * sliceSize)
    )
    return (
        <div
            style={{
                marginTop: '200px',
            }}
            className='sitemap'
        >
            <h1>Sitemap</h1>
            <div className='sitemap-container'>
                <div className='sitemap-content'>
                    <p>trackt</p>
                    <p>politique</p>
                    <p>à propos de trackt</p>
                    <p>infos légales</p>
                    <p>retours & remboursements</p>
                    <br />
                    <br />
                    <p>indépendant brand</p>
                    <p>exclusivité item</p>
                    <p>hot deal</p>
                    <p>nouveautés</p>
                    <p>chez vous en 48h</p>
                    <p>en promo</p>
                </div>
                {productSlices.map((slice, index) => (
                    <div
                        key={index}
                        className='sitemap-content'
                        style={{
                            maxWidth: '280px',
                        }}
                    >
                        {slice.map((product: any, productIndex: any) => (
                            <Link
                                to={`/products/${product.node.handle}`}
                                key={productIndex}
                            >
                                <p key={productIndex}>{product.node.title}</p>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

const ALL_PRODUCTS_QUERY = `#graphql
query {
    products(first: 250) {
        edges {
            node {
                id
                title
                handle
            }
        }
    }
}`
