import { Link } from '@remix-run/react'
import React from 'react'

export function AsideCategories({
    heading,
    id = 'aside',
}: {
    children?: React.ReactNode
    heading: React.ReactNode
    id?: string
}) {
    const colors = [
        { name: 'blanc', hex: '#fff', link: '/search?q=white' },
        { name: 'rouge', hex: '#ff0000', link: '/search?q=red' },
        { name: 'rose', hex: '#ff00ff', link: '/search?q=pink' },
        { name: 'violet', hex: '#800080', link: '/search?q=purple' },
        { name: 'Bleu navy', hex: '#000080', link: '/search?q=navy' },
        { name: 'bleu clair', hex: '#add8e6', link: '/search?q=lightblue' },
        { name: 'vert', hex: '#008000', link: '/search?q=green' },
        { name: 'jaune', hex: '#ffff00', link: '/search?q=yellow' },
        { name: 'orange', hex: '#ffa500', link: '/search?q=orange' },
        { name: 'marron', hex: '#8b4513', link: '/search?q=brown' },
        { name: 'kaki', hex: '#556b2f', link: '/search?q=kaki' },
        { name: 'gris', hex: '#808080', link: '/search?q=grey' },
        { name: 'noir', hex: '#000', link: '/search?q=black' },
    ]

    const brandList = [
        { name: 'Adidas', link: '/search?q=adidas' },
        { name: 'Nike', link: '/nike' },
        { name: 'Puma', link: '/puma' },
    ]

    return (
        <div aria-modal className='overlay' id={id} role='dialog'>
            <button
                className='close-outside'
                onClick={() => {
                    history.go(-1)
                    window.location.hash = ''
                }}
            />
            <div className='categoriesAside searchAside'>
                <CloseAside />
                <main>
                    <div className='categoriesAside-container'>
                        <div className='categoriesAside-column'>
                            <div className='categoriesAside-item'>
                                <h4>Genre</h4>
                                <p>Tout voir</p>
                                <p>Homme</p>
                                <p>Femme</p>
                                <p>Mixte</p>
                            </div>
                            <div className='categoriesAside-item'>
                                <h4>Catégories</h4>
                                <p>Tous le textile</p>
                                <p>Toutes les sneakers</p>
                                <p>Tous les accessoires</p>
                            </div>
                            <div className='categoriesAside-item'>
                                <span>Accessoires</span>
                                <Link to='/accessoires'>
                                    <p>Toutes les figurines</p>
                                </Link>
                                <p>toutes les casquettes</p>
                                <p>Tous tous les bonnets</p>
                                <p>tous les sous vêtements</p>
                                <p>toutes les planches</p>
                                <p>tous le autres accessoires</p>
                            </div>
                            <div className='categoriesAside-item'>
                                <span>Textile</span>
                                <p>Tous les tee-shirt</p>
                                <p>toues les hoodies</p>
                                <p>toutes les vestes</p>
                                <p>tous les pants</p>
                                <p>tous les autres textiles</p>
                            </div>
                        </div>
                        <div className='categoriesAside-column'>
                            <div className='categoriesAside-item'>
                                <h4>Marques</h4>
                                {brandList.map((brand, index) => (
                                    <Link key={index} to={brand.link}>
                                        <p>{brand.name}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className='categoriesAside-column'>
                            <div className='categoriesAside-item'>
                                <h4>
                                    Modèles populaires <span>Nike</span>
                                </h4>
                                <p>Tous les tee-shirt</p>
                                <p>toues les hoodies</p>
                                <p>toutes les vestes</p>
                                <p>tous les pants</p>
                                <p>tous les autres textiles</p>
                            </div>
                            <div className='categoriesAside-item'>
                                <h4>
                                    Modèles populaires <span>Adidas</span>
                                </h4>
                                <p>Tous les tee-shirt</p>
                                <p>toues les hoodies</p>
                                <p>toutes les vestes</p>
                                <p>tous les pants</p>
                                <p>tous les autres textiles</p>
                            </div>
                            <div className='categoriesAside-item'>
                                <h4>
                                    Modèles populaires <span>Supreme</span>
                                </h4>
                                <p>Tous les tee-shirt</p>
                                <p>toues les hoodies</p>
                                <p>toutes les vestes</p>
                                <p>tous les pants</p>
                                <p>tous les autres textiles</p>
                            </div>
                        </div>
                        <div className='categoriesAside-column'>
                            <div className='categoriesAside-item'>
                                <h4>labels</h4>
                                <Link to='/filtered?new=true'>
                                    <div>
                                        <img
                                            src='/product/stickers/new.png'
                                            alt='new'
                                        />
                                        <p>Nouvel arrivage</p>
                                    </div>
                                </Link>
                                <Link to='/filtered?fast=true'>
                                    <div>
                                        <img
                                            src='/product/stickers/ship.png'
                                            alt='new'
                                        />
                                        <p>Chez vous en 48H</p>
                                    </div>
                                </Link>
                                <Link to='/filtered?hotdeal=true'>
                                    <div>
                                        <img
                                            src='/product/stickers/hotDeal.png'
                                            alt='new'
                                        />
                                        <p>hot deals</p>
                                    </div>
                                </Link>
                                <Link to='/filtered?release=true'>
                                    <div>
                                        <img
                                            src='/product/stickers/release.png'
                                            alt='new'
                                        />
                                        <p>Exclusive items</p>
                                    </div>
                                </Link>
                                <Link to='/filtered?soon=true'>
                                    <div>
                                        <img
                                            src='/product/stickers/soon.png'
                                            alt='new'
                                        />
                                        <p>Bientôt disponible</p>
                                    </div>
                                </Link>
                                <Link to='/filtered?promotion=true'>
                                    <div>
                                        <img
                                            src='/product/stickers/promotion.png'
                                            alt='new'
                                        />
                                        <p>En promotion</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='categoriesAside-column'>
                            <div className='categoriesAside-item'>
                                <h4>Couleurs</h4>
                                {colors.map((color, index) => (
                                    <Link key={index} to={color.link}>
                                        <div>
                                            <span
                                                style={{
                                                    backgroundColor: color.hex,
                                                    margin: 'unset',
                                                    width: '20px',
                                                    height: '20px',
                                                    padding: 'unset',
                                                }}
                                            ></span>
                                            <p
                                                style={{
                                                    marginLeft: '10px',
                                                }}
                                            >
                                                {color.name}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='categoriesAsideNav'>
                        <h5>vous pouvez également essayer ces recherches</h5>
                        <div
                            className='four-btns'
                            style={{
                                marginTop: '40px',
                            }}
                        >
                            <Link to='/filters'>
                                <button>
                                    <img
                                        src='/filters/checkbox.png'
                                        alt='check'
                                        style={{
                                            width: '20px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    Rechercher par filtres
                                </button>
                            </Link>
                            <Link to='#search-aside'>
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
                            </Link>
                            <Link to='/filtered'>
                                <button
                                    style={{
                                        backgroundImage: 'url(/random.png)',
                                        width: '260px',
                                    }}
                                >
                                    <img
                                        src='/filters/arrow-shuffle.png'
                                        alt='arrow'
                                        style={{
                                            marginRight: '10px',
                                        }}
                                    />
                                    Random item
                                </button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

function CloseAside() {
    return (
        /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
        <a className='closeSearch' href='#' onChange={() => history.go(-1)}>
            &times;
        </a>
    )
}
