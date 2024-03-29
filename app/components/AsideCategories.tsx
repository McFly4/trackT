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
        { name: 'Audemars Piguet', link: '/search?q=audemars' },
        { name: 'Bearbrick', link: '/search?q=bearbrick' },
        { name: 'Birkenstock', link: '/search?q=birkenstock' },
        { name: 'Bravest studios', link: '/search?q=bravest' },
        { name: 'Cactus Jack Nike', link: '/search?q=cactus' },
        { name: 'Chrome Hearts', link: '/search?q=chrome' },
        { name: 'Jordan', link: '/search?q=jordan' },
        { name: 'Jumpman Jack', link: '/search?q=jumpman' },
        { name: 'Kaws', link: '/search?q=kaws' },
        { name: 'Kobe ', link: '/search?q=kobe' },
        { name: 'Larvee', link: '/search?q=larvee' },
        { name: ' Nke', link: '/search?q=nike' },
        { name: 'Palace', link: '/search?q=palace' },
        { name: 'Spalding', link: '/search?q=spalding' },
        { name: 'Super 7', link: '/search?q=super7' },
        { name: 'supreme', link: '/search?q=supreme' },
        { name: 'Stussy', link: '/search?q=stussy' },
        { name: 'Yeezy', link: '/search?q=yeezy' },
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
                                <p
                                    onClick={() => {
                                        window.location.href = '/filtered'
                                    }}
                                >
                                    Tout voir
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/filtered?manwoman'
                                    }}
                                >
                                    Homme
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/filtered?manwoman=true'
                                    }}
                                >
                                    Femme
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href = '/filtered'
                                    }}
                                >
                                    Mixte
                                </p>
                            </div>
                            <div className='categoriesAside-item'>
                                <h4>Catégories</h4>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=Clothing'
                                    }}
                                >
                                    Tous le textile
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=sneakers'
                                    }}
                                >
                                    Toutes les sneakers
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=accessoires'
                                    }}
                                >
                                    Tous les accessoires
                                </p>
                            </div>
                            <div className='categoriesAside-item'>
                                <span>Accessoires</span>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=figurines'
                                    }}
                                >
                                    Toutes les figurines
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=casquette'
                                    }}
                                >
                                    toutes les casquettes
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=bonnet'
                                    }}
                                >
                                    Tous les bonnets
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=clothing'
                                    }}
                                >
                                    tous les sous vêtements
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=Skateboards'
                                    }}
                                >
                                    toutes les planches
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=accessoires'
                                    }}
                                >
                                    tous le autres accessoires
                                </p>
                            </div>
                            <div className='categoriesAside-item'>
                                <span>Textile</span>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=t-shirt'
                                    }}
                                >
                                    Tous les tee-shirt
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=hoodie'
                                    }}
                                >
                                    tous les hoodies
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=jacket'
                                    }}
                                >
                                    toutes les vestes
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href = '/search?q=pants'
                                    }}
                                >
                                    tous les pants
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=clothing'
                                    }}
                                >
                                    tous les autres textiles
                                </p>
                            </div>
                        </div>
                        <div className='categoriesAside-column'>
                            <div className='categoriesAside-item'>
                                <h4>Marques</h4>
                                {brandList.map((brand, index) => (
                                    <p
                                        key={index}
                                        onClick={() =>
                                            (window.location.href = brand.link)
                                        }
                                    >
                                        {brand.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className='categoriesAside-column'>
                            <div className='categoriesAside-item'>
                                <span>Nike</span>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=jordan 3'
                                    }}
                                >
                                    Jordan 3
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=jordan 4'
                                    }}
                                >
                                    Jordan 4
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=jordan 5'
                                    }}
                                >
                                    Jordan 5
                                </p>

                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=sb dunk low'
                                    }}
                                >
                                    SB dunk low
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=dunk low'
                                    }}
                                >
                                    dunk low
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href = '/search?q=nike'
                                    }}
                                >
                                    tous les nikes
                                </p>
                            </div>
                            <div className='categoriesAside-item'>
                                <span>Adidas</span>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=yeezy slide'
                                    }}
                                >
                                    yeezy slide
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=yeezy boost'
                                    }}
                                >
                                    yeezy boost
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=adidas'
                                    }}
                                >
                                    toutes les adidas{' '}
                                </p>
                            </div>
                            <div className='categoriesAside-item'>
                                <span>Supreme</span>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=box logo'
                                    }}
                                >
                                    box logo
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=collab'
                                    }}
                                >
                                    collab
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=skateboard'
                                    }}
                                >
                                    Planches de skate
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href = '/search?q=toy'
                                    }}
                                >
                                    funny toy
                                </p>
                                <p
                                    onClick={() => {
                                        window.location.href =
                                            '/search?q=supreme'
                                    }}
                                >
                                    Tous supreme
                                </p>
                            </div>
                        </div>
                        <div className='categoriesAside-column'>
                            <div className='categoriesAside-item'>
                                <h4>labels</h4>

                                <div
                                    onClick={() => {
                                        window.location.href =
                                            '/filtered?new=true'
                                    }}
                                >
                                    <img
                                        src='/product/stickers/new.png'
                                        alt='new'
                                    />
                                    <p>Nouvel arrivage</p>
                                </div>

                                <div
                                    onClick={() => {
                                        window.location.href =
                                            '/filtered?fast=true'
                                    }}
                                >
                                    <img
                                        src='/product/stickers/ship.png'
                                        alt='new'
                                    />
                                    <p>Chez vous en 48H</p>
                                </div>

                                <div
                                    onClick={() => {
                                        window.location.href =
                                            '/filtered?hotDeal=true'
                                    }}
                                >
                                    <img
                                        src='/product/stickers/hotDeal.png'
                                        alt='new'
                                    />
                                    <p>hot deals</p>
                                </div>

                                <div
                                    onClick={() => {
                                        window.location.href =
                                            '/filtered?release=true'
                                    }}
                                >
                                    <img
                                        src='/product/stickers/release.png'
                                        alt='new'
                                    />
                                    <p>Exclusive items</p>
                                </div>

                                <div
                                    onClick={() => {
                                        window.location.href =
                                            '/filtered?soon=true'
                                    }}
                                >
                                    <img
                                        src='/product/stickers/soon.png'
                                        alt='new'
                                    />
                                    <p>Bientôt disponible</p>
                                </div>

                                <div
                                    onClick={() => {
                                        window.location.href =
                                            '/filtered?promotion=true'
                                    }}
                                >
                                    <img
                                        src='/product/stickers/promotion.png'
                                        alt='new'
                                    />
                                    <p>En promotion</p>
                                </div>
                            </div>
                        </div>
                        <div className='categoriesAside-column'>
                            <div className='categoriesAside-item'>
                                <h4>Couleurs</h4>
                                {colors.map((color, index) => (
                                    <div
                                        onClick={() =>
                                            (window.location.href = color.link)
                                        }
                                        key={index}
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                    >
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
                            <button
                                onClick={() => {
                                    window.location.href = '/filters'
                                }}
                            >
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

                            <button
                                onClick={() => {
                                    history.go(-1)
                                    window.location.href = '#searcha-side'
                                }}
                            >
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
                            <button
                                onClick={() => {
                                    window.location.href = '/filtered'
                                }}
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
