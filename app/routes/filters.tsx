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
                name: 'Nike',
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
            {
                name: 'Adidas',
                subcategories: [
                    {
                        name: 'Campus',
                        value: 'campus',
                    },
                    {
                        name: 'Gazelle',
                        value: 'gazelle',
                    },
                    {
                        name: 'Stan Smith',
                        value: 'stan-smith',
                    },
                ],
            },
        ],
    },
]

export default function Filters() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    const handleCheckboxChange = (category: string) => {
        setSelectedCategories((prevCategories) => {
            if (prevCategories.includes(category)) {
                return prevCategories.filter((c) => c !== category)
            } else {
                return [...prevCategories, category]
            }
        })
    }

    const renderColumn = (
        categories: Category[],
        depth: number,
        parentTitle?: string
    ) => (
        <div
            key={depth}
            style={{
                display: depth === 0 ? 'flex' : 'block',
            }}
        >
            {parentTitle && (
                <div style={{ marginRight: '8px' }}>{parentTitle}</div>
            )}

            {categories.map((category) => (
                <div className='filters-colomn' key={category.name}>
                    <label className='filters-input'>
                        <input
                            type='checkbox'
                            checked={selectedCategories.includes(category.name)}
                            onChange={() => handleCheckboxChange(category.name)}
                        />
                        {/*{category.title && (*/}
                        {/*    <span style={{ marginRight: '8px' }}>*/}
                        {/*        {category.title}*/}
                        {/*    </span>*/}
                        {/*)}*/}
                        <p>{category.name}</p>
                    </label>

                    {selectedCategories.includes(category.name) &&
                        category.subcategories &&
                        renderColumn(category.subcategories, depth + 1)}
                </div>
            ))}
        </div>
    )

    return <div className='filters'>{renderColumn(categories, 0)}</div>
}
