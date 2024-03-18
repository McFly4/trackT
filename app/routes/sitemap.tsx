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
                    <Link to='/'>
                        <p>trackt</p>
                    </Link>
                    <Link to='/politics'>
                        <p>politique</p>
                    </Link>
                    <Link to='/about'>
                        <p>à propos de trackt</p>
                    </Link>
                    <Link to='/politics'>
                        <p>infos légales</p>
                    </Link>
                    <Link to='/retours'>
                        <p>retours & remboursements</p>
                    </Link>
                    <br />
                    <br />
                    <p>indépendant brand</p>
                    <Link to='/filtered?release=true'>
                        <p>exclusive item</p>
                    </Link>
                    <Link to='/filtered?hotdeal=true'>
                        <p>hot deal</p>
                    </Link>
                    <Link to='/filtered?new=true'>
                        <p>nouveautés</p>
                    </Link>
                    <Link to='/filtered?fast=true'>
                        <p>chez vous en 24h</p>
                    </Link>
                    <Link to='/filtered?promotion=true'>
                        <p>en promo</p>
                    </Link>
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
