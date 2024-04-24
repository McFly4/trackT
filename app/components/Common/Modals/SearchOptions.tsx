import React, { useState } from 'react'
import { Link } from '@remix-run/react'
import useWindowDimensions from '~/hooks/useWindowDimension'

export default function SearchOptions() {
    const [searchOptions, setSearchOptions] = useState(false)
    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920

    return (
        <div className='searchOptions'>
            {width > 768 ? (
                <button
                    className='searchOptionsButton'
                    onClick={() => {
                        setSearchOptions(true)
                    }}
                >
                    Options de recherche
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='14.792'
                        height='14.792'
                        viewBox='0 0 14.792 14.792'
                        style={{
                            marginLeft: '10px',
                        }}
                    >
                        <g
                            id='Groupe_2148'
                            data-name='Groupe 2148'
                            transform='translate(1 1)'
                        >
                            <path
                                id='Ligne_230'
                                data-name='Ligne 230'
                                d='M-.755,11.292a.745.745,0,0,1-.745-.745V-.755A.745.745,0,0,1-.755-1.5.745.745,0,0,1-.01-.755v11.3A.745.745,0,0,1-.755,11.292Z'
                                transform='translate(7.151 1.5)'
                                fill='#fff'
                                stroke='#fff'
                                stroke-linecap='round'
                                stroke-width='2'
                            />
                            <path
                                id='Ligne_231'
                                data-name='Ligne 231'
                                d='M.745,12.792A.745.745,0,0,1,0,12.046V.745a.745.745,0,1,1,1.49,0v11.3A.745.745,0,0,1,.745,12.792Z'
                                transform='translate(12.792 5.651) rotate(90)'
                                fill='#fff'
                                stroke='#fff'
                                stroke-linecap='round'
                                stroke-width='2'
                            />
                        </g>
                    </svg>
                </button>
            ) : (
                <div className='icon'>
                    <img src='/icons/heart.svg' alt='heart' />
                </div>
            )}
            {searchOptions && (
                <div
                    className='responsive-modal'
                    style={{
                        justifyContent: 'center',
                    }}
                >
                    <button
                        className='responsive-modal-close'
                        onClick={() => setSearchOptions(false)}
                        style={{
                            position: 'unset',
                        }}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                        >
                            <path
                                id='Tracé_467'
                                data-name='Tracé 467'
                                d='M16841.295-8037.292l-6.295-6.294-6.295,6.294a.988.988,0,0,1-.705.292.988.988,0,0,1-.705-.292,1,1,0,0,1,0-1.417l6.291-6.292-6.291-6.292a1,1,0,0,1,0-1.416,1,1,0,0,1,1.41,0l6.295,6.294,6.295-6.294a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.416l-6.291,6.292,6.291,6.292a1,1,0,0,1,0,1.417.988.988,0,0,1-.705.292A.988.988,0,0,1,16841.295-8037.292Z'
                                transform='translate(-16827 8053)'
                                fill='#fff'
                            />
                        </svg>
                    </button>
                    <div
                        className='four-btns'
                        style={{
                            justifyContent: 'unset',
                        }}
                    >
                        <Link
                            to='/filters'
                            onClick={() => setSearchOptions(false)}
                        >
                            <button>
                                <img
                                    src='/filters/checkbox.png'
                                    alt='checkbox'
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '10px',
                                        opacity: '1 !important',
                                    }}
                                />
                                Rechercher par filtres
                            </button>
                        </Link>
                        <a
                            href='#categories-aside'
                            onClick={() => setSearchOptions(false)}
                        >
                            <button>Shopping par catégories</button>
                        </a>
                        <a
                            href='#search-aside'
                            onClick={() => setSearchOptions(false)}
                        >
                            <button>
                                <svg
                                    id='icon'
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='21.548'
                                    height='21.547'
                                    viewBox='0 0 21.548 21.547'
                                    style={{
                                        marginRight: '10px',
                                    }}
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
                        </a>
                        <Link
                            to='/filtered'
                            onClick={() => setSearchOptions(false)}
                        >
                            <button>
                                <img
                                    src='/filters/arrow-shuffle.png'
                                    alt='arrow-shuffle'
                                    style={{
                                        marginRight: '10px',
                                        opacity: '1 !important',
                                        width: '20px',
                                    }}
                                />
                                Random item
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
