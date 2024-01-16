import MainProduct from '~/components/Common/mainProduct'

export default function TrackT(products: any) {
    const productsList = products?.products
    return (
        <div className='panel-container'>
            <div className='panel-products-grid'>
                {products?.products?.map((product: any) => (
                    <MainProduct product={product} />
                ))}
            </div>
        </div>
    )
}
