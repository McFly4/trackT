import { type MetaFunction } from '@remix-run/react'
import React, { useState } from 'react'

export const meta: MetaFunction = () => {
    return [{ title: 'Filters' }]
}

interface Category {
    name: string
    title?: string // Ajout du titre ici
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
]

export default function Filters() {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
    const [selectedSubcategories, setSelectedSubcategories] = useState<
        Category[]
    >([])
    const [selectedSubsubcategories, setSelectedSubsubcategories] = useState<
        Category[]
    >([])

    const handleCategoryCheckboxChange = (category: Category) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((c) => c !== category)
                : [...prevCategories, category]
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

    console.log(
        selectedCategories?.flatMap((category) => category.subcategories)
    )

    return (
        <div className='filters'>
            <div className='filters__categories'>
                <h3 className='filters__title'>Catégories</h3>
                <ul className='filters__list'>
                    {categories.map((category) => (
                        <li className='filters__item' key={category.name}>
                            <label>
                                <input
                                    type='checkbox'
                                    checked={selectedCategories.includes(
                                        category
                                    )}
                                    onChange={() =>
                                        handleCategoryCheckboxChange(category)
                                    }
                                />
                                {category.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedCategories.length > 0 && (
                <div className='filters__subcategories'>
                    {selectedCategories?.map((category: Category) => (
                        <div>
                            <h3 className='filters__title'>{category.name}</h3>
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
                    {selectedSubcategories?.map((subcategory: Category) => (
                        <div>
                            <h3 className='filters__title'>
                                {subcategory.name}
                            </h3>
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
                        (subsubcategory: Category) => (
                            <>
                                <h3 className='filters__title'>
                                    {subsubcategory.name}
                                </h3>
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
                                                        checked={selectedSubsubcategories.includes(
                                                            subsubsubcategory
                                                        )}
                                                        onChange={() =>
                                                            handleSubsubcategoryCheckboxChange(
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
        </div>
    )
}
