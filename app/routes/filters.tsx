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

const categories: Category[] = [
    {
        name: 'Textile',
        subcategories: [
            { name: 'Tout', value: 'textile' },
            { name: 'Hoodie', value: 'hoodie' },
            { name: 'Crewneck', value: 'crewneck' },
            { name: 'Pants', value: 'pants' },
            { name: 'Short', value: 'short' },
            { name: 'Chemise', value: 'chemise' },
            { name: 'Jacket', value: 'jacket' },
            { name: 'Sous vêtement', value: 'underwear' },
        ],
    },
    {
        name: 'Sneakers',
        subcategories: [
            {
                name: 'Marques',
                value: 'brands',
                subcategories: [
                    {
                        name: 'Nike',
                        value: 'nike',
                        subcategories: [
                            {
                                name: 'Dunk high',
                                value: 'dunk-high',
                            },
                            {
                                name: 'Jordan 1',
                                value: 'jordan-1',
                            },
                        ],
                    },
                    { name: 'Adidas', value: 'adidas' },
                    { name: 'Jordan', value: 'jordan' },
                    { name: 'New Balance', value: 'new-balance' },
                    { name: 'Asics', value: 'asics' },
                    { name: 'Reebok', value: 'reebok' },
                    { name: 'Puma', value: 'puma' },
                    { name: 'Vans', value: 'vans' },
                    { name: 'Converse', value: 'converse' },
                    { name: 'Autres', value: 'others' },
                ],
            },
            {
                name: 'Couleurs',
                value: 'colors',
                subcategories: [
                    { name: 'Noir', value: 'black' },
                    { name: 'Blanc', value: 'white' },
                    { name: 'Gris', value: 'grey' },
                    { name: 'Bleu', value: 'blue' },
                    { name: 'Vert', value: 'green' },
                    { name: 'Jaune', value: 'yellow' },
                    { name: 'Orange', value: 'orange' },
                    { name: 'Rouge', value: 'red' },
                    { name: 'Rose', value: 'pink' },
                    { name: 'Violet', value: 'purple' },
                    { name: 'Marron', value: 'brown' },
                    { name: 'Beige', value: 'beige' },
                    { name: 'Autres', value: 'others' },
                ],
            },
        ],
    },
    {
        name: 'Accessoires',
        value: 'accessories',
        subcategories: [
            { name: 'Tout', value: 'all' },
            { name: 'Casquettes', value: 'caps' },
            { name: 'Ceinture', value: 'belt' },
            { name: 'Figurine', value: 'figurine' },
            { name: 'peluche', value: 'peluche' },
            { name: 'Coussins', value: 'pillow' },
            { name: 'Sous vêtements', value: 'underwear' },
            { name: 'Scarf', value: 'scarf' },
            { name: 'glove', value: 'gloves' },
        ],
    },
]

const sizes: any[] = [
    {
        name: 'Sneakers',
        subcategories: [
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
        ],
    },
    {
        name: 'Textile',
        subcategories: [
            { name: 'Tout', value: 'all' },
            { name: 'XS', value: 'xs' },
            { name: 'S', value: 's' },
            { name: 'M', value: 'm' },
            { name: 'L', value: 'l' },
            { name: 'XL', value: 'xl' },
            { name: '2L', value: 'xxl' },
            { name: '3XL', value: 'xxxl' },
        ],
    },
]

const price: any[] = [
    {
        name: 'Prix',
        subcategories: [
            { name: 'Tout', value: 'all' },
            { name: '0 - 200€', value: '0-200' },
            { name: '200 - 350€', value: '200-350' },
            { name: '350 - 500€', value: '350-500' },
            { name: '500 - 750€', value: '500-750' },
            { name: '750 - 1000€', value: '750-1000' },
            { name: '1000€ +', value: '1000+' },
        ],
    },
]

const genre: any[] = [
    {
        name: 'Mixte',
    },
    {
        name: 'Homme',
    },
    {
        name: 'Femme',
    },
]

export default function Filters() {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
    const [selectedGenres, setSelectedGenres] = useState<Category[]>([])
    const [selectedSubcategories, setSelectedSubcategories] = useState<
        Category[]
    >([])
    const [selectedSubsubcategories, setSelectedSubsubcategories] = useState<
        any[]
    >([])
    const [selectedShoes, setSelectedShoes] = useState<any[]>([])
    const [selectedSizes, setSelectedSizes] = useState<any[]>([])
    const [selectedPrices, setSelectedPrices] = useState<any[]>([])

    const handleCategoryCheckboxChange = (category: Category) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((c) => c !== category)
                : [...prevCategories, category]
        )
    }

    const handleGenreCheckboxChange = (genre: Category) => {
        setSelectedGenres((prevGenres) =>
            prevGenres.includes(genre)
                ? prevGenres.filter((g) => g !== genre)
                : [...prevGenres, genre]
        )
    }

    const handleSubcategoryCheckboxChange = (subcategory: Category) => {
        setSelectedSubcategories((prevSubcategories) =>
            prevSubcategories.includes(subcategory)
                ? prevSubcategories.filter((s) => s !== subcategory)
                : [...prevSubcategories, subcategory]
        )
    }

    const handleSubsubcategoryCheckboxChange = (subsubcategory: Category) => {
        setSelectedSubsubcategories((prevSubsubcategories) =>
            prevSubsubcategories.includes(subsubcategory)
                ? prevSubsubcategories.filter((s) => s !== subsubcategory)
                : [...prevSubsubcategories, subsubcategory]
        )
    }

    const handleSelectedShoesCheckboxChange = (shoe: any) => {
        setSelectedShoes((prevShoes) =>
            prevShoes.includes(shoe)
                ? prevShoes.filter((s) => s !== shoe)
                : [...prevShoes, shoe]
        )
    }

    const handleSizeCheckboxChange = (size: any) => {
        setSelectedSizes((prevSizes) =>
            prevSizes.includes(size)
                ? prevSizes.filter((s) => s !== size)
                : [...prevSizes, size]
        )
    }

    const handlePriceCheckboxChange = (price: any) => {
        setSelectedPrices((prevPrices) =>
            prevPrices.includes(price)
                ? prevPrices.filter((p) => p !== price)
                : [...prevPrices, price]
        )
    }

    function resetAll() {
        setSelectedCategories([])
        setSelectedSubcategories([])
        setSelectedSubsubcategories([])
        setSelectedShoes([])
        setSelectedSizes([])
        setSelectedPrices([])
    }

    function handleSearch() {
        const queryParams = []

        if (selectedGenres && selectedGenres.length > 0) {
            const genreObjects = selectedGenres.map((genre) => ({
                genre: genre?.name,
            }))
            queryParams.push(...genreObjects)
        }

        if (selectedCategories && selectedCategories.length > 0) {
            const categoryObjects = selectedCategories.map((category) => ({
                productType: category?.name,
            }))
            queryParams.push(...categoryObjects)
        }

        if (selectedSubsubcategories && selectedSubsubcategories.length > 0) {
            const subcategoryObjects = selectedSubsubcategories.map(
                (subcategory) => ({
                    productVendor: subcategory?.name,
                })
            )
            queryParams.push(...subcategoryObjects)
        }

        if (selectedShoes && selectedShoes.length > 0) {
            const shoeObjects = selectedShoes.map((shoe) => ({
                collection: shoe?.value,
            }))
            queryParams.push(...shoeObjects)
        }

        if (selectedSizes && selectedSizes.length > 0) {
            const sizeObjects = selectedSizes.map((size) => ({
                size: size?.name,
            }))
            queryParams.push(...sizeObjects)
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

    console.log(handleSearch())

    console.log(
        'genre',
        selectedGenres,
        'premier',
        selectedCategories,
        'deuxieme',
        selectedSubcategories,
        'troisieme',
        selectedSubsubcategories,
        'quatrieme',
        selectedShoes,
        'cinquieme',
        selectedSizes,
        'sixieme',
        selectedPrices
    )

    return (
        <>
            <div className='filters'>
                <div className='filters__categories'>
                    <div>
                        <div
                            style={{
                                marginBottom: '50px',
                            }}
                        >
                            <h3 className='filters__title'>Genre</h3>
                            <ul className='filters__list'>
                                {genre.map((genre) => (
                                    <li
                                        className='filters__item'
                                        key={genre.name}
                                    >
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={selectedGenres.includes(
                                                    genre
                                                )}
                                                onChange={() =>
                                                    handleGenreCheckboxChange(
                                                        genre
                                                    )
                                                }
                                            />
                                            {genre.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <h3 className='filters__title'>Catégories</h3>
                        <ul className='filters__list'>
                            {categories.map((category) => (
                                <li
                                    className='filters__item'
                                    key={category.name}
                                >
                                    <label>
                                        <input
                                            type='checkbox'
                                            checked={selectedCategories.includes(
                                                category
                                            )}
                                            onChange={() =>
                                                handleCategoryCheckboxChange(
                                                    category
                                                )
                                            }
                                        />
                                        {category.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {selectedCategories.length > 0 && (
                    <div className='filters__subcategories'>
                        {selectedCategories?.map((category: any) => (
                            <div>
                                {category?.subcategories?.length > 0 && (
                                    <h3 className='filters__title'>
                                        {category.name}
                                    </h3>
                                )}
                                <ul className='filters__list'>
                                    {category.subcategories?.map(
                                        (subcategory: any) => (
                                            <li
                                                className='filters__item'
                                                key={subcategory.name}
                                            >
                                                <label>
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedSubcategories.includes(
                                                            subcategory
                                                        )}
                                                        onChange={() =>
                                                            handleSubcategoryCheckboxChange(
                                                                subcategory
                                                            )
                                                        }
                                                    />
                                                    {subcategory.name}
                                                </label>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
                {selectedSubcategories.length > 0 && (
                    <div className='filters__subcategories'>
                        {selectedSubcategories?.map((subcategory: any) => (
                            <div>
                                {subcategory?.subcategories?.length > 0 && (
                                    <h3 className='filters__title'>
                                        {subcategory.name}
                                    </h3>
                                )}
                                <ul className='filters__list'>
                                    {subcategory.subcategories?.map(
                                        (subsubcategory: any) => (
                                            <li
                                                className='filters__item'
                                                key={subsubcategory.name}
                                            >
                                                <label>
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedSubsubcategories.includes(
                                                            subsubcategory
                                                        )}
                                                        onChange={() =>
                                                            handleSubsubcategoryCheckboxChange(
                                                                subsubcategory
                                                            )
                                                        }
                                                    />
                                                    {subsubcategory.name}
                                                </label>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
                {selectedSubsubcategories.length > 0 && (
                    <div className='filters__subcategories'>
                        {selectedSubsubcategories?.map(
                            (subsubcategory: any) => (
                                <>
                                    {subsubcategory?.subcategories?.length >
                                        0 && (
                                        <h3 className='filters__title'>
                                            {subsubcategory.name}
                                        </h3>
                                    )}
                                    <ul className='filters__list'>
                                        {subsubcategory.subcategories?.map(
                                            (subsubsubcategory: any) => (
                                                <li
                                                    className='filters__item'
                                                    key={subsubsubcategory.name}
                                                >
                                                    <label>
                                                        <input
                                                            type='checkbox'
                                                            checked={selectedShoes.includes(
                                                                subsubsubcategory
                                                            )}
                                                            onChange={() =>
                                                                handleSelectedShoesCheckboxChange(
                                                                    subsubsubcategory
                                                                )
                                                            }
                                                        />
                                                        {subsubsubcategory.name}
                                                    </label>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </>
                            )
                        )}
                    </div>
                )}
                {selectedShoes.length > 0 && (
                    <div className='filters__subcategories'>
                        {sizes?.map((subCategory: any) => (
                            <>
                                {subCategory?.subcategories?.length > 0 && (
                                    <h3 className='filters__title'>
                                        {/*{subCategory.name}*/}
                                        tailles
                                    </h3>
                                )}
                                <ul className='filters__list'>
                                    {subCategory.subcategories?.map(
                                        (subsubsubcategory: any) => (
                                            <li
                                                className='filters__item'
                                                key={subsubsubcategory.name}
                                            >
                                                <label>
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedSizes.includes(
                                                            subsubsubcategory
                                                        )}
                                                        onChange={() =>
                                                            handleSizeCheckboxChange(
                                                                subsubsubcategory
                                                            )
                                                        }
                                                    />
                                                    {subsubsubcategory.name}
                                                </label>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </>
                        ))}
                    </div>
                )}
                {selectedSizes?.length > 0 && (
                    <div className='filters__subcategories'>
                        {price?.map((subCategory: any) => (
                            <>
                                {subCategory?.subcategories?.length > 0 && (
                                    <h3 className='filters__title'>
                                        {/*{subCategory.name}*/}
                                        prix
                                    </h3>
                                )}
                                <ul className='filters__list'>
                                    {subCategory.subcategories?.map(
                                        (subsubsubcategory: any) => (
                                            <li
                                                className='filters__item'
                                                key={subsubsubcategory.name}
                                            >
                                                <label>
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedPrices.includes(
                                                            subsubsubcategory
                                                        )}
                                                        onChange={() =>
                                                            handlePriceCheckboxChange(
                                                                subsubsubcategory
                                                            )
                                                        }
                                                    />
                                                    {subsubsubcategory.name}
                                                </label>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </>
                        ))}
                    </div>
                )}
            </div>
            <div
                className={`filters-tvs ${
                    selectedShoes.length > 0 ? 'filters-tvs-full' : ''
                }`}
            >
                {selectedShoes.length > 0 && (
                    <img
                        src='/filters/blueTV.png'
                        alt='blue tv'
                        className='filters-tvs-blue'
                    />
                )}
                {selectedSubcategories.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                        }}
                        className='filters-tvs-top'
                    >
                        {selectedSubsubcategories.length > 0 && (
                            <img
                                src='/filters/orangeTV.png'
                                alt='blue tv'
                                className='filters-tvs-top-left'
                            />
                        )}
                        <img src='/filters/yellowTV.png' alt='yellow tv' />
                    </div>
                )}
                {selectedCategories.length > 0 && (
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
                        <img src='/filters/greenTV.png' alt='blue tv' />
                    </div>
                )}
                <img src='/filters/redTV.png' alt='red tv' />
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
                        }}
                    >
                        <a
                            href='#search-aside'
                            style={{
                                color: '#fff',
                            }}
                        >
                            <div className='filter-footer-container-search'>
                                <img src='/icons/search.svg' alt='search' />
                                <span>recherche manuelle</span>
                            </div>
                        </a>
                        <div
                            className='filter-footer-container-reset'
                            onClick={resetAll}
                        >
                            <img src='/icons/close.svg' alt='reset' />
                            <span>réinitialiser</span>
                        </div>
                    </div>
                    <div
                        className='filter-footer-container-search'
                        onClick={handleSearch}
                    >
                        <Link to={`/filtered${handleSearch()}`}>
                            <span>Afficher les resultats</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='filters-close'>
                <Link to='/'>
                    <img src='/icons/close.svg' alt='close' />
                </Link>
            </div>
        </>
    )
}
