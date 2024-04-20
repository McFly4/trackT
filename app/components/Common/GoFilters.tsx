import { Link } from '@remix-run/react'
import React from 'react'
import useWindowDimension from '~/hooks/useWindowDimension'

export default function GoFilters() {
    const useWidth = useWindowDimension()
    const width = useWidth.width || 1920
    return (
        <div className='gofilters'>
            <h1>Pas encore trouvé votre perle rare ?</h1>
            <p>
                Nous avons une multitude de styles et de pièces uniques, mais
                nous savons que parfois, vous cherchez quelque chose de très
                spécifique. {width > 768 && <br />}
                Si vous n’avez pas encore trouvé exactement ce que vous voulez,
                vous avez le choix entre plusieurs options.
            </p>
            <div className='gofilters-btn'>
                <div className='four-btns'>
                    <Link to='/filters'>
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
                    <a href='#categories-aside'>
                        <button>Shopping par catégories</button>
                    </a>
                    <a href='#search-aside'>
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
                    <Link to='/filtered'>
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
        </div>
    )
}
