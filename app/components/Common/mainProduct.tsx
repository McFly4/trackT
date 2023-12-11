import { Link } from '@remix-run/react'

export default function ({ product }: any) {
    return (
        <div className='product-grid'>
            <Link key={product.title} to={`/products/${product.handle}`}>
                <div className='product-img-grid'>
                    <img
                        src={product.images.nodes[0].url}
                        alt={product.title}
                    />
                </div>
                <div className='product-info-grid'>
                    <h3>
                        {product.productType.length > 30
                            ? product.productType.slice(0, 30) + '...'
                            : product.productType}
                    </h3>
                    <p>
                        {product.title.length > 30
                            ? product.title.slice(0, 30) + '...'
                            : product.title}
                    </p>
                </div>
            </Link>
        </div>
    )
}