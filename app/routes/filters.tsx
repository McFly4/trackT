import { Link, type MetaFunction } from '@remix-run/react'
import React, { useState } from 'react'
import { handle } from 'mdast-util-to-markdown/lib/handle'

export const meta: MetaFunction = () => {
    return [{ title: 'Filters' }]
}

// First column
// 2
const genre = [
    {
        name: 'Homme',
    },
    {
        name: 'Femme',
    },
]

//7
const category = [
    {
        name: 'Sneakers',
        value: 'sneakers',
    },
    {
        name: 'Tee-Shirts',
        value: 'T-Shirt',
    },
    {
        name: 'Hoodies',
        value: 'Sweatshirt',
    },
    {
        name: 'Casquettes',
        value: 'Casquette',
    },
    {
        name: 'Bonnets',
        value: 'Bonnet',
    },
    {
        name: 'Accessoires',
        value: 'accessories',
    },
    {
        name: 'Vestes',
        value: 'veste',
    },
]

// Second column
//13

const colorsList = [
    { name: 'Blanc', value: 'white' },
    { name: 'Rouge', value: 'red' },
    { name: 'Rose', value: 'pink' },
    { name: 'Violet', value: 'violet' },
    { name: 'Bleu navy', value: 'bleu-navy' },
    { name: 'Bleu clair', value: 'bleu-clair' },
    { name: 'vert', value: 'green' },
    { name: 'jaune', value: 'yellow' },
    { name: 'orange', value: 'orange' },
    { name: 'marron', value: 'brown' },
    { name: 'kaki', value: 'kaki' },
    { name: 'gris', value: 'grey' },
    { name: 'Noir', value: 'black' },
]

// third column
//20
const brands = [
    { name: 'Adidas', value: 'adidas' },
    {
        name: 'Audemars piguet',
        value: 'audemars',
    },
    { name: 'BearBrick', value: 'bearbrick' },
    { name: 'Birkenstock X Stussy', value: 'birkenstock-x-stussy' },
    { name: 'Bravest Studios', value: 'bravest-studios' },
    { name: 'Cactus Jack', value: 'cactus' },
    { name: 'Chrome Hearts', value: 'Chrome Hearts' },
    { name: 'Jordan', value: 'jordan' },
    { name: 'Jumpman jack', value: 'jumpman' },
    { name: 'KAWS', value: 'kaws' },
    { name: 'Kobe', value: 'kobe' },
    { name: 'Laarvee', value: 'laarvee' },
    { name: 'New Balance', value: 'new-balance' },
    { name: 'Nike', value: 'nike' },
    { name: 'Palace', value: 'palace' },
    { name: 'Spalding', value: 'spalding' },
    { name: 'Stussy', value: 'stussy' },
    { name: 'Super 7', value: 'super-7' },
    { name: 'Supreme', value: 'supreme' },
    { name: 'Yeezy', value: 'yeezy' },
]

// last column
//6
const price = [
    { name: '0 - 200€', value: '0-200' },
    { name: '200 - 350€', value: '200-350' },
    { name: '350 - 500€', value: '350-500' },
    { name: '500 - 750€', value: '500-750' },
    { name: '750 - 1000€', value: '750-1000' },
    { name: '1000€ +', value: '1000+' },
]

export default function Filters() {
    const [manwoman, setManWoman] = useState<any>([])
    const [tag, setTag] = useState<any>([])
    const [productVendor, setProductVendor] = useState<any>([])
    const [colors, setColors] = useState<any>([])
    const [collections, setCollections] = useState<any>([])
    const [prices, setPrices] = useState<any>([])

    const handleGenre = (selectedGenre: string) => {
        if (selectedGenre === 'Tout') {
            const allGenres = genre.map((g) => g.name)
            setManWoman(manwoman.length === genre.length ? [] : allGenres)
        } else {
            setManWoman((prevGenre: string[]) =>
                prevGenre.includes(selectedGenre)
                    ? prevGenre.filter((g) => g !== selectedGenre)
                    : [...prevGenre, selectedGenre]
            )
        }
    }

    const handleTags = (tag: string) => {
        if (tag === 'Tout') {
            const allTags =
                tag.length === category.length
                    ? []
                    : category.map((cat) => cat.value)
            setTag(allTags)
        } else {
            setTag((prevTags: string[]) =>
                prevTags.includes(tag)
                    ? prevTags.filter((t: string) => t !== tag)
                    : [...prevTags, tag]
            )
        }
    }

    const handleColors = (color: any) => {
        if (color === 'Tout') {
            const allColors =
                colors.length === colorsList.length
                    ? []
                    : colorsList.map((c) => c.name)
            setColors(allColors)
        } else {
            setColors((prevColors: any[]) =>
                prevColors.includes(color)
                    ? prevColors.filter((c: any) => c !== color)
                    : [...prevColors, color]
            )
        }
    }

    const handleProductVendor = (brand: any) => {
        if (brand === 'Tout') {
            const allBrands =
                productVendor.length === brands.length
                    ? []
                    : brands.map((b) => b.name)
            setProductVendor(allBrands)
        } else {
            setProductVendor((prevBrands: any[]) =>
                prevBrands.includes(brand)
                    ? prevBrands.filter((b: any) => b !== brand)
                    : [...prevBrands, brand]
            )
        }
    }

    const handlePrice = (price: any) => {
        if (price === 'Tout') {
            const allPrices =
                prices.length === price.length
                    ? []
                    : price.map((p: any) => p.name)
            setPrices(allPrices)
        } else {
            setPrices((prevPrices: any[]) =>
                prevPrices.includes(price)
                    ? prevPrices.filter((p: any) => p !== price)
                    : [...prevPrices, price]
            )
        }
    }

    function resetAll() {
        setManWoman([])
        setTag([])
        setProductVendor([])
        setColors([])
        setCollections([])
        setPrices([])
    }

    function handleSearch() {
        const queryParams = [] as any

        if (manwoman && manwoman.length > 0 && manwoman.length < 2) {
            const genreObjects = manwoman.map((genre: any) => {
                const name = genre
                if (name === 'Femme') return { manwoman: 'Femme' }

                return /*valeur par défaut*/
            })

            const filteredGenreObjects = genreObjects.filter(
                (item: any) => item !== undefined
            )

            queryParams.push(...filteredGenreObjects)
        }

        if (tag && tag.length > 0 && tag.length !== 7) {
            const tagsObjects = tag.map((tag: any) => ({ tag: tag }))
            queryParams.push(...tagsObjects)
        }

        if (colors && colors.length > 0 && colors.length !== 13) {
            const colorsObjects = colors.map((color: any) => ({
                palette: color,
            }))
            queryParams.push(...colorsObjects)
        }

        if (
            productVendor &&
            productVendor.length > 0 &&
            productVendor.length !== 20
        ) {
            const subcategoryObjects = productVendor.map(
                (subcategory: any) => ({
                    productVendor: subcategory,
                })
            )
            queryParams.push(...subcategoryObjects)
        }

        if (
            collections &&
            collections.length > 0 &&
            !collections.includes('Tout')
        ) {
            const shoeObjects = collections.map((collection: any) => ({
                collection,
            }))
            queryParams.push(...shoeObjects)
        } else {
            // Si 'Tout' est sélectionné ou si la collection est vide, ajoute 'All' par défaut
            queryParams.push({ collection: 'All' })
        }

        // Vérifie s'il y a des prix sélectionnés et s'ils ne sont pas égaux à 'Tout'
        if (prices && prices.length > 0 && !prices.includes('Tout')) {
            const priceObjects = prices.map((price: any) => ({ price }))
            queryParams.push(...priceObjects)
        }

        if (queryParams.length > 0) {
            const queryString = queryParams
                .map((param: any) =>
                    Object.entries(param)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&')
                )
                .join('&')

            return `?${queryString}`
        }

        return ''
    }

    return (
        <>
            <div className='filters'>
                <div className='filters-container'>
                    <div className='filters__categories'>
                        <div
                            style={{
                                marginBottom: '50px',
                            }}
                        >
                            <h5 className='filters__title'>Genre</h5>
                            <ul className='filters__list'>
                                <li className='filters__item' key='Tout'>
                                    <label>
                                        <input
                                            type='checkbox'
                                            onChange={() => handleGenre('Tout')}
                                            checked={
                                                manwoman.length ===
                                                    genre.length &&
                                                genre.every((gen) =>
                                                    manwoman.includes(gen.name)
                                                )
                                            }
                                        />
                                        Tout
                                    </label>
                                </li>
                                {genre.map((gen) => (
                                    <li
                                        className='filters__item'
                                        key={gen.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={manwoman.includes(
                                                    gen.name
                                                )}
                                                onChange={() =>
                                                    handleGenre(gen.name)
                                                }
                                            />
                                            {gen.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {manwoman?.length > 0 && (
                            <div>
                                <h5 className='filters__title'>Catégories</h5>
                                <ul className='filters__list'>
                                    <li className='filters__item'>
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={
                                                    tag.length ===
                                                        category.length &&
                                                    category.every((cat) =>
                                                        tag.includes(cat.value)
                                                    )
                                                }
                                                onChange={() =>
                                                    handleTags('Tout')
                                                }
                                            />
                                            Tout
                                        </label>
                                    </li>
                                    {category.map((cat) => (
                                        <li
                                            className='filters__item'
                                            key={cat.name}
                                        >
                                            <label>
                                                <input
                                                    type='checkbox'
                                                    checked={tag.includes(
                                                        cat.value
                                                    )}
                                                    onChange={() =>
                                                        handleTags(cat.value)
                                                    }
                                                />
                                                {cat.name}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {tag?.length > 0 && (
                        <div className='filters__categories'>
                            <h5 className='filters__title'>Couleurs</h5>
                            <ul className='filters__list'>
                                <li className='filters__item'>
                                    <label>
                                        <input
                                            type='checkbox'
                                            checked={
                                                colors.length ===
                                                    colorsList.length &&
                                                colorsList.every((color) =>
                                                    colors.includes(color.name)
                                                )
                                            }
                                            onChange={() =>
                                                handleColors('Tout')
                                            }
                                        />
                                        Tout
                                    </label>
                                </li>
                                {colorsList.map((color) => (
                                    <li
                                        className='filters__item'
                                        key={color.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={colors.includes(
                                                    color.value
                                                )}
                                                onChange={() =>
                                                    handleColors(color.value)
                                                }
                                            />
                                            {color.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {colors?.length > 0 && (
                        <div className='filters__categories'>
                            <h5 className='filters__title'>Marques</h5>
                            <ul className='filters__list'>
                                <li className='filters__item'>
                                    <label>
                                        <input
                                            type='checkbox'
                                            checked={
                                                productVendor.length ===
                                                    brands.length &&
                                                brands.every((brand) =>
                                                    productVendor.includes(
                                                        brand.name
                                                    )
                                                )
                                            }
                                            onChange={() =>
                                                handleProductVendor('Tout')
                                            }
                                        />
                                        Tout
                                    </label>
                                </li>
                                {brands.map((brand) => (
                                    <li
                                        className='filters__item'
                                        key={brand.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={productVendor.includes(
                                                    brand.name
                                                )}
                                                onChange={() =>
                                                    handleProductVendor(
                                                        brand.name
                                                    )
                                                }
                                            />
                                            {brand.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {productVendor?.length > 0 && (
                        <div className='filters__categories'>
                            <h5 className='filters__title'>Prix</h5>
                            <ul className='filters__list'>
                                <li className='filters__item'>
                                    <label>
                                        <input
                                            type='checkbox'
                                            checked={
                                                prices.length ===
                                                    price.length &&
                                                price.every((p) =>
                                                    prices.includes(p.name)
                                                )
                                            }
                                            onChange={() => handlePrice('Tout')}
                                        />
                                        Tout
                                    </label>
                                </li>
                                {price.map((p) => (
                                    <li className='filters__item' key={p.name}>
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={prices.includes(
                                                    p.name
                                                )}
                                                onChange={() =>
                                                    handlePrice(p.name)
                                                }
                                            />
                                            {p.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className='filters__tvs'>
                    {manwoman?.length > 0 && (
                        <img alt='tvs' src='/filters/redTV.png' />
                    )}
                    {tag?.length > 0 && (
                        <div className='filters__tvs__first'>
                            <img alt='tvs' src='/filters/lightBlueTV.png' />
                            <img alt='tvs' src='/filters/greenTV.png' />
                        </div>
                    )}
                    {colors?.length > 0 && (
                        <div className='filters__tvs__second'>
                            <img alt='tvs' src='/filters/orangeTV.png' />
                            <img alt='tvs' src='/filters/yellowTV.png' />
                        </div>
                    )}
                    {productVendor?.length > 0 && (
                        <div className='filters__tvs__third'>
                            <img alt='tvs' src='/filters/pinkTV.png' />
                            <img alt='tvs' src='/filters/blueTV.png' />
                        </div>
                    )}
                </div>
            </div>

            <div className='filters__footer'>
                <div className='filters__footer__buttons'>
                    <Link to={`/filtered${handleSearch()}`}>
                        <button
                            className={
                                manwoman?.length === 0
                                    ? 'filters-btn-disabled'
                                    : ''
                            }
                        >
                            <h5
                                style={{
                                    color:
                                        manwoman?.length === 0
                                            ? '#fff'
                                            : '#000',
                                }}
                            >
                                Afficher les résultats
                            </h5>
                        </button>
                    </Link>

                    <button>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='15.462'
                            height='16.362'
                            viewBox='0 0 15.462 16.362'
                            style={{
                                marginRight: '15px',
                            }}
                        >
                            <path
                                id='Tracé_229'
                                data-name='Tracé 229'
                                d='M11603.618,1548.148l-6.268,6.716-1.463-1.364,6.363-6.818-6.363-6.817,1.463-1.364,6.268,6.716,6.269-6.716,1.463,1.364-6.363,6.817,6.363,6.818-1.463,1.364Z'
                                transform='translate(-11595.888 -1538.501)'
                                fill='#fff'
                            />
                        </svg>

                        <h5>RÉINITIALISER</h5>
                    </button>
                </div>
            </div>
            <Link to='/'>
                <div className='filters-close'>
                    <img src='/icons/close.svg' alt='close' />
                </div>
            </Link>
        </>
    )
}
