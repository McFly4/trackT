import { Link, type MetaFunction } from '@remix-run/react'
import React, { useState } from 'react'
import { handle } from 'mdast-util-to-markdown/lib/handle'

export const meta: MetaFunction = () => {
    return [{ title: 'Filters' }]
}

interface Category {
    name?: string
    title?: string
    subcategories?: Category[]
    value?: string
}

// First column

const genre = [
    {
        name: 'Tout',
        value: 'all',
    },
    {
        name: 'Mixte',
        value: 'mixte',
    },
    {
        name: 'Homme',
    },
    {
        name: 'Femme',
    },
]

const category = [
    {
        name: 'Tout',
        value: 'all',
    },
    {
        name: 'Textile',
        value: 'textile',
    },
    {
        name: 'Sneakers',
        value: 'sneakers',
    },
    {
        name: 'Accessories',
        value: 'accessories',
    },
]

// second column

const sneakers = [
    {
        name: 'Tout',
        value: 'all',
    },
    {
        name: 'Marques',
        value: 'brands',
    },
    {
        name: 'Couleurs',
        value: 'colorsList',
    },
    {
        name: 'Matière',
        value: 'materials',
    },
]

const textile = [
    { name: 'Tout', value: 'textile' },
    { name: 'Hoodie', value: 'hoodie' },
    { name: 'Crewneck', value: 'crewneck' },
    { name: 'Pants', value: 'pants' },
    { name: 'Short', value: 'short' },
    { name: 'Chemise', value: 'chemise' },
    { name: 'Jacket', value: 'jacket' },
    { name: 'Sous vêtement', value: 'underwear' },
]

const accessories = [
    { name: 'Tout', value: 'all' },
    { name: 'Casquettes', value: 'caps' },
    { name: 'Ceinture', value: 'belt' },
    { name: 'Figurine', value: 'figurine' },
    { name: 'peluche', value: 'peluche' },
    { name: 'Coussins', value: 'pillow' },
    { name: 'Sous vêtements', value: 'underwear' },
    { name: 'Scarf', value: 'scarf' },
    { name: 'glove', value: 'gloves' },
]

// third column

const brands = [
    { name: 'Tout', value: 'all' },
    { name: 'Nike', value: 'nike' },
    { name: 'Adidas', value: 'adidas' },
    { name: 'Jordan', value: 'jordan' },
    {
        name: 'Audemars piguet X Cactus Jack',
        value: 'audemars-piguet-x-cactus-jack',
    },
    { name: 'BearBrick', value: 'bearbrick' },
    { name: 'Birkenstock X Stussy', value: 'birkenstock-x-stussy' },
    { name: 'Bravest Studios', value: 'bravest-studios' },
    { name: 'Casio', value: 'casio' },
    { name: 'Chrome Hearts', value: 'Chrome Hearts' },
    { name: 'KAWS', value: 'kaws' },
    { name: 'Laarvee', value: 'laarvee' },
    { name: 'New Balance', value: 'new-balance' },
    { name: 'Nike X Dior', value: 'nike-x-dior' },
    { name: 'Nike X Supreme', value: 'nike-x-supreme' },
    { name: 'Nike X Travis Scott', value: 'nike-x-travis-scott' },
    { name: 'Palace', value: 'palace' },
    { name: 'Stone Island X Supreme', value: 'stone-island-x-supreme' },
    { name: 'Stussy', value: 'stussy' },
    { name: 'Super 7', value: 'super-7' },
    { name: 'Supreme', value: 'supreme' },
    { name: 'Yeezy', value: 'yeezy' },
]

const colorsList = [
    { name: 'Tout', value: 'all' },
    { name: 'Blanc', value: 'blanc' },
    { name: 'Rouge', value: 'rouge' },
    { name: 'Rose', value: 'rose' },
    { name: 'Violet', value: 'violet' },
    { name: 'Bleu navy', value: 'bleu-navy' },
    { name: 'Bleu clair', value: 'bleu-clair' },
    { name: 'vert', value: 'vert' },
    { name: 'jaune', value: 'jaune' },
    { name: 'orange', value: 'orange' },
    { name: 'marron', value: 'marron' },
    { name: 'kaki', value: 'kaki' },
    { name: 'gris', value: 'gris' },
    { name: 'Noir', value: 'noir' },
]

const matiere = [
    { name: 'Tout', value: 'all' },
    { name: 'Daim', value: 'daim' },
    { name: 'Cuir', value: 'cuir' },
    { name: 'velours', value: 'velours' },
    { name: 'tissu', value: 'tissu' },
]

// fourth column

const nike = [
    { name: 'Dunk high', value: 'dunk-high' },
    { name: 'Jordan 1', value: 'jordan-1' },
    { name: 'Sb Low', value: 'sb-low' },
]

const adidas = [
    { name: 'Campus', value: 'campus' },
    { name: 'Gazelle', value: 'gazelle' },
    { name: 'Stan smith', value: 'stan-smith' },
]

const clothes = [
    { name: 'supreme', value: 'supreme' },
    { name: 'palace', value: 'palace' },
    { name: 'bape', value: 'bape' },
    { name: 'cactus jack', value: 'cactus-jack' },
]

// fifth column

const sneakersSize = [
    { name: 'Tout', value: 'all' },
    { name: '36', value: 36 },
    { name: '36.5', value: 36.5 },
    { name: '37', value: 37 },
    { name: '37.5', value: 37.5 },
    { name: '38', value: 38 },
    { name: '38.5', value: 38.5 },
    { name: '39', value: 39 },
    { name: '39.5', value: 39.5 },
    { name: '40', value: 40 },
    { name: '40.5', value: 40.5 },
    { name: '41', value: 41 },
    { name: '41.5', value: 41.5 },
    { name: '42', value: 42 },
    { name: '42.5', value: 42.5 },
    { name: '43', value: 43 },
    { name: '43.5', value: 43.5 },
    { name: '44', value: 44 },
    { name: '44.5', value: 44.5 },
    { name: '45', value: 45 },
    { name: '45.5', value: 45.5 },
    { name: '46', value: 46 },
    { name: '46.5', value: 46.5 },
    { name: '47', value: 47 },
    { name: '47.5', value: 47.5 },
    { name: '48', value: 48 },
    { name: '48.5', value: 48.5 },
    { name: '49', value: 49 },
    { name: '49.5', value: 49.5 },
]

const clothesSize = [
    { name: 'Tout', value: 'all' },
    { name: 'XS', value: 'xs' },
    { name: 'S', value: 's' },
    { name: 'M', value: 'm' },
    { name: 'L', value: 'l' },
    { name: 'XL', value: 'xl' },
    { name: '2L', value: 'xxl' },
    { name: '3XL', value: 'xxxl' },
]

// last column

const price = [
    { name: 'Tout', value: 'all' },
    { name: '0 - 200€', value: '0-200' },
    { name: '200 - 350€', value: '200-350' },
    { name: '350 - 500€', value: '350-500' },
    { name: '500 - 750€', value: '500-750' },
    { name: '750 - 1000€', value: '750-1000' },
    { name: '1000€ +', value: '1000+' },
]

export default function Filters() {
    const [manwoman, setManWoman] = useState<any>([])
    const [productType, setProductType] = useState<any>([])
    const [tags, setTags] = useState<any>([])
    const [productVendor, setProductVendor] = useState<any>([])
    const [colors, setColors] = useState<any>([])
    const [materials, setMaterials] = useState<any>([])
    const [collections, setCollections] = useState<any>([])
    const [sizes, setSizes] = useState<any>([])
    const [prices, setPrices] = useState<any>([])

    // params
    const [sneakersParams, setSneakersParams] = useState<any>([])

    const handleSneakersParams = (sneakersParam: any) => {
        setSneakersParams((prevSneakersParam: any) =>
            prevSneakersParam.includes(sneakersParam)
                ? prevSneakersParam.filter((s: any) => s !== sneakersParam)
                : [...prevSneakersParam, sneakersParam]
        )
    }

    const handleGenre = (genre: any) => {
        setManWoman((prevGenre: any) =>
            prevGenre.includes(genre)
                ? prevGenre.filter((g: any) => g !== genre)
                : [...prevGenre, genre]
        )
    }

    const handleProductType = (productType: any) => {
        setProductType((prevProductType: any) =>
            prevProductType.includes(productType)
                ? prevProductType.filter((p: any) => p !== productType)
                : [...prevProductType, productType]
        )
    }

    const handleTags = (tag: any) => {
        setTags((prevTag: any) =>
            prevTag.includes(tag)
                ? prevTag.filter((t: any) => t !== tag)
                : [...prevTag, tag]
        )
    }

    const handleMaterials = (material: any) => {
        setMaterials((prevMaterial: any) =>
            prevMaterial.includes(material)
                ? prevMaterial.filter((m: any) => m !== material)
                : [...prevMaterial, material]
        )
    }

    const handleProductVendor = (productVendor: any) => {
        setProductVendor((prevProductVendor: any) =>
            prevProductVendor.includes(productVendor)
                ? prevProductVendor.filter((p: any) => p !== productVendor)
                : [...prevProductVendor, productVendor]
        )
    }

    const handleColors = (color: any) => {
        setColors((prevColor: any) =>
            prevColor.includes(color)
                ? prevColor.filter((c: any) => c !== color)
                : [...prevColor, color]
        )
    }

    const handleCollections = (collection: any) => {
        setCollections((prevCollection: any) =>
            prevCollection.includes(collection)
                ? prevCollection.filter((c: any) => c !== collection)
                : [...prevCollection, collection]
        )
    }

    const handleSizes = (size: any) => {
        setSizes((prevSize: any) =>
            prevSize.includes(size)
                ? prevSize.filter((s: any) => s !== size)
                : [...prevSize, size]
        )
    }

    const handlePrices = (price: any) => {
        setPrices((prevPrice: any) =>
            prevPrice.includes(price)
                ? prevPrice.filter((p: any) => p !== price)
                : [...prevPrice, price]
        )
    }

    function resetAll() {
        setManWoman([])
        setProductType([])
        setTags([])
        setProductVendor([])
        setColors([])
        setMaterials([])
        setCollections([])
        setSizes([])
        setPrices([])
        setSneakersParams([])
    }

    function handleSearch() {
        const queryParams = []

        if (manwoman && manwoman.length > 0) {
            const genreObjects = manwoman.map((genre: any) => {
                const name = genre?.name

                if (name === 'Homme') {
                    return {
                        manwoman: 'Homme',
                    }
                } else if (name === 'Femme') {
                    return {
                        manwoman: 'true',
                    }
                } else if (name === 'Mixte') {
                    return {
                        manwoman: 'Mixte',
                    }
                }

                return /*valeur par défaut*/
            })

            const filteredGenreObjects = genreObjects.filter(
                (item: any) => item !== undefined
            )

            queryParams.push(...filteredGenreObjects)
        }

        if (
            productType &&
            productType.length > 0 &&
            !productType.some((category: any) => category?.name === 'Tout')
        ) {
            const categoryObjects = productType.map((category: any) => ({
                productType: category?.name,
            }))

            queryParams.push(...categoryObjects)
        }

        if (
            tags &&
            tags.length > 0 &&
            !tags.some((tag: any) => tag?.name === 'Tout')
        ) {
            const tagsObjects = tags.map((tag: any) => ({
                tags: tag?.name,
            }))
            queryParams.push(...tagsObjects)
        }

        if (colors && colors.length > 0) {
            const colorsObjects = colors.map((color: any) => ({
                colors: color?.name,
            }))
            queryParams.push(...colorsObjects)
        }

        if (materials && materials.length > 0) {
            const materialsObjects = materials.map((material: any) => ({
                materials: material?.name,
            }))
            queryParams.push(...materialsObjects)
        }

        if (
            productVendor &&
            productVendor.length > 0 &&
            !productVendor.some((vendor: any) => vendor?.name === 'Tout')
        ) {
            const subcategoryObjects = productVendor.map(
                (subcategory: any) => ({
                    productVendor: subcategory?.value,
                })
            )
            queryParams.push(...subcategoryObjects)
        }

        if (
            collections &&
            collections.length > 0 &&
            !collections.some((collection: any) => collection?.name === 'Tout')
        ) {
            const shoeObjects = collections.map((shoe: any) => ({
                collection: shoe?.value,
            }))
            queryParams.push(...shoeObjects)
        } else {
            // Si 'Tout' est check ou si la collection est vide, ajoute 'All' par défaut
            queryParams.push({ collection: 'All' })
        }

        if (
            sizes &&
            sizes.length > 0 &&
            !sizes.some((size: any) => size === 'Tout')
        ) {
            const sizeObjects = sizes.map((size: any) => ({
                size: size?.name,
            }))
            queryParams.push(...sizeObjects)
        }

        if (
            prices &&
            prices.length > 0 &&
            !prices.some((price: any) => price === 'Tout')
        ) {
            const priceObjects = prices.map((price: any) => ({
                price: price?.value,
            }))
            queryParams.push(...priceObjects)
        }

        if (queryParams.length > 0) {
            const queryString = queryParams
                .map((param) =>
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
                <div>
                    <div
                        style={{
                            marginBottom: '50px',
                        }}
                    >
                        <h3 className='filters__title'>Genre</h3>
                        <ul className='filters__list'>
                            {genre.map((genre) => (
                                <li className='filters__item' key={genre.name}>
                                    <label>
                                        <input
                                            type='checkbox'
                                            checked={manwoman.includes(genre)}
                                            onChange={() => handleGenre(genre)}
                                        />
                                        {genre.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {manwoman?.length >= 1 && (
                        <>
                            <h3 className='filters__title'>Catégorie</h3>
                            <ul className='filters__list'>
                                {category.map((category: any) => (
                                    <li
                                        className='filters__item'
                                        key={category.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={productType.includes(
                                                    category
                                                )}
                                                onChange={() =>
                                                    handleProductType(category)
                                                }
                                            />
                                            {category.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
                <div>
                    {productType.some(
                        (sneakers: any) => sneakers.value === 'sneakers'
                    ) && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>Sneakers</h3>
                            <ul className='filters__list'>
                                {sneakers.map((sneakers: any) => (
                                    <li
                                        className='filters__item'
                                        key={sneakers.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={sneakersParams.includes(
                                                    sneakers
                                                )}
                                                onChange={() =>
                                                    handleSneakersParams(
                                                        sneakers
                                                    )
                                                }
                                            />
                                            {sneakers.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {productType.some(
                        (textile: any) => textile.value === 'textile'
                    ) && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>Textile</h3>
                            <ul className='filters__list'>
                                {textile.map((textile: any) => (
                                    <li
                                        className='filters__item'
                                        key={textile.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={tags.includes(textile)}
                                                onChange={() =>
                                                    handleTags(textile)
                                                }
                                            />
                                            {textile.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {productType.some(
                        (accessories: any) =>
                            accessories.value === 'accessories'
                    ) && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>Accessoires</h3>
                            <ul className='filters__list'>
                                {accessories.map((accessories: any) => (
                                    <li
                                        className='filters__item'
                                        key={accessories.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={tags.includes(
                                                    accessories
                                                )}
                                                onChange={() =>
                                                    handleTags(accessories)
                                                }
                                            />
                                            {accessories.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    {sneakersParams.some(
                        (brands: any) => brands.value === 'brands'
                    ) && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>Marques</h3>
                            <ul className='filters__list'>
                                {brands.map((brands: any) => (
                                    <li
                                        className='filters__item'
                                        key={brands.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={productVendor.includes(
                                                    brands
                                                )}
                                                onChange={() =>
                                                    handleProductVendor(brands)
                                                }
                                            />
                                            {brands.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {sneakersParams.some(
                        (colors: any) => colors.value === 'colorsList'
                    ) && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>Couleurs</h3>
                            <ul className='filters__list'>
                                {colorsList.map((c: any) => (
                                    <li className='filters__item' key={c.name}>
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={colors.includes(c)}
                                                onChange={() => handleColors(c)}
                                            />
                                            {c.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {sneakersParams.some(
                        (materials: any) => materials.value === 'materials'
                    ) && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>
                                Matière
                                <span>Sneakers</span>
                            </h3>
                            <ul className='filters__list'>
                                {matiere.map((matiere: any) => (
                                    <li
                                        className='filters__item'
                                        key={matiere.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={materials.includes(
                                                    matiere
                                                )}
                                                onChange={() =>
                                                    handleMaterials(matiere)
                                                }
                                            />
                                            {matiere.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    {productVendor.some(
                        (nike: any) => nike.value === 'nike'
                    ) && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>Nike</h3>
                            <ul className='filters__list'>
                                {nike.map((nike: any) => (
                                    <li
                                        className='filters__item'
                                        key={nike.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={collections.includes(
                                                    nike
                                                )}
                                                onChange={() =>
                                                    handleCollections(nike)
                                                }
                                            />
                                            {nike.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {productVendor.some(
                        (adidas: any) => adidas.value === 'adidas'
                    ) && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>Adidas</h3>
                            <ul className='filters__list'>
                                {adidas.map((adidas: any) => (
                                    <li
                                        className='filters__item'
                                        key={adidas.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={collections.includes(
                                                    adidas
                                                )}
                                                onChange={() =>
                                                    handleCollections(adidas)
                                                }
                                            />
                                            {adidas.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {productVendor.some(
                        (clothes: any) => clothes.value === 'clothes'
                    ) && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>Clothes</h3>
                            <ul className='filters__list'>
                                {clothes.map((clothes: any) => (
                                    <li
                                        className='filters__item'
                                        key={clothes.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={collections.includes(
                                                    clothes
                                                )}
                                                onChange={() =>
                                                    handleCollections(clothes)
                                                }
                                            />
                                            {clothes.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    {collections.length > 0 && (
                        // SIZES
                        <>
                            <div className='filters__categories'>
                                <h3 className='filters__title'>Tailles</h3>
                                <ul className='filters__list'>
                                    {collections.length > 0 && (
                                        <div>
                                            {sneakersSize.map(
                                                (sneakersSize: any) => (
                                                    <li
                                                        className='filters__item'
                                                        key={sneakersSize.name}
                                                    >
                                                        <label>
                                                            <input
                                                                type='checkbox'
                                                                checked={sizes.includes(
                                                                    sneakersSize
                                                                )}
                                                                onChange={() =>
                                                                    handleSizes(
                                                                        sneakersSize
                                                                    )
                                                                }
                                                            />
                                                            {sneakersSize.name}
                                                        </label>
                                                    </li>
                                                )
                                            )}
                                        </div>
                                    )}
                                </ul>
                            </div>
                            <div className='filters__categories'>
                                <h3 className='filters__title'>Tailles</h3>
                                <ul className='filters__list'>
                                    {productType.some(
                                        (textile: any) =>
                                            textile.value === 'textile'
                                    ) && (
                                        <div>
                                            {clothesSize.map(
                                                (clothesSize: any) => (
                                                    <li
                                                        className='filters__item'
                                                        key={clothesSize.name}
                                                    >
                                                        <label>
                                                            <input
                                                                type='checkbox'
                                                                checked={sizes.includes(
                                                                    clothesSize
                                                                )}
                                                                onChange={() =>
                                                                    handleSizes(
                                                                        clothesSize
                                                                    )
                                                                }
                                                            />
                                                            {clothesSize.name}
                                                        </label>
                                                    </li>
                                                )
                                            )}
                                        </div>
                                    )}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
                <div>
                    {sizes.length > 0 && (
                        <div className='filters__categories'>
                            <h3 className='filters__title'>Prix</h3>
                            <ul className='filters__list'>
                                {price.map((price: any) => (
                                    <li
                                        className='filters__item'
                                        key={price.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={prices.includes(price)}
                                                onChange={() =>
                                                    handlePrices(price)
                                                }
                                            />
                                            {price.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className='filters-footer'>
                <img
                    className='filters-footer-bg'
                    src='/filters/footer.png'
                    alt='footer'
                />
                <div className='filters-footer-container'>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                            }}
                        >
                            <div
                                className='filter-footer-container-search'
                                style={{
                                    opacity: manwoman.length > 0 ? 1 : 0.5,
                                    transition: 'opacity 0.s ease-in-out',
                                }}
                            >
                                <Link to={`/filtered${handleSearch()}`}>
                                    <span>Afficher les resultats</span>
                                </Link>
                            </div>
                            {manwoman.length > 0 && (
                                <div
                                    className='filter-footer-container-reset'
                                    onClick={resetAll}
                                    style={{
                                        marginLeft: '10px',
                                    }}
                                >
                                    <img src='/icons/close.svg' alt='reset' />
                                    <span>réinitialiser</span>
                                </div>
                            )}
                        </div>
                        <div
                            className='four-btns'
                            style={{
                                marginTop: 'unset',
                            }}
                        >
                            <Link to='/filters'>
                                <button>Rechercher par filtres</button>
                            </Link>

                            <Link to='/'>
                                <button>Shopping par catégories</button>
                            </Link>
                            <Link to='#search-aside'>
                                <button>
                                    <svg
                                        id='icon'
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='21.548'
                                        height='21.547'
                                        viewBox='0 0 21.548 21.547'
                                    >
                                        <path
                                            id='Tracé_219'
                                            data-name='Tracé 219'
                                            d='M988.192,241.428a8.08,8.08,0,1,1,8.08-8.08A8.089,8.089,0,0,1,988.192,241.428Zm0-13.467a5.387,5.387,0,1,0,5.387,5.387A5.393,5.393,0,0,0,988.192,227.961Z'
                                            transform='translate(-980.112 -225.268)'
                                            fill='#fff'
                                        />
                                        <path
                                            id='Tracé_220'
                                            data-name='Tracé 220'
                                            d='M997.192,243.695a1.337,1.337,0,0,1-.952-.395l-6.734-6.733a1.346,1.346,0,0,1,1.9-1.9l6.734,6.733a1.347,1.347,0,0,1-.952,2.3Z'
                                            transform='translate(-976.992 -222.148)'
                                            fill='#fff'
                                        />
                                    </svg>
                                    Rechercher manuellement
                                </button>
                            </Link>
                        </div>
                    </div>
                    {sizes?.length > 0 ? (
                        <img
                            className='filters-all-tvs'
                            src='/filters/allTvs.png'
                            alt='all tv'
                        />
                    ) : (
                        <div
                            className={`filters-tvs ${
                                collections?.length > 0
                                    ? 'filters-tvs-full'
                                    : ''
                            }`}
                        >
                            {collections.length > 0 && (
                                <img
                                    src='/filters/blueTV.png'
                                    alt='blue tv'
                                    className='filters-tvs-blue'
                                />
                            )}
                            {(sneakersParams.length > 0 ||
                                tags?.length > 0) && (
                                <div
                                    style={{
                                        display: 'flex',
                                    }}
                                    className='filters-tvs-top'
                                >
                                    {(productVendor?.length > 0 ||
                                        colors?.length > 0 ||
                                        materials?.length > 0) && (
                                        <img
                                            src='/filters/orangeTV.png'
                                            alt='blue tv'
                                            className='filters-tvs-top-left'
                                        />
                                    )}
                                    <img
                                        src='/filters/yellowTV.png'
                                        alt='yellow tv'
                                    />
                                </div>
                            )}
                            {productType?.length > 0 && (
                                <div
                                    style={{
                                        display: 'flex',
                                    }}
                                    className='filters-tvs-bottom'
                                >
                                    <img
                                        src='/filters/lightBlueTV.png'
                                        alt='yellow tv'
                                        className='filters-tvs-bottom-left'
                                    />
                                    <img
                                        src='/filters/greenTV.png'
                                        alt='blue tv'
                                    />
                                </div>
                            )}

                            {manwoman?.length > 0 && (
                                <img
                                    src='/filters/redTV.png'
                                    alt='pink tv'
                                    className='filters-tvs-right'
                                />
                            )}
                        </div>
                    )}
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
