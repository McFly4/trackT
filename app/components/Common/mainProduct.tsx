import { Link } from '@remix-run/react'
import { useState } from 'react'

export default function ({ product }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    function toggleModal() {
        setIsModalOpen(!isModalOpen)
    }

    const mapping = {
        hotDeal: product.hotDeal,
        new: product.new,
        ooo: product.ooo,
        promotion: product.promotion,
        release: product.release,
        ship: product.ship,
    } as any

    const stickersData = Object.keys(mapping).reduce((acc: any, key: any) => {
        if (mapping[key]) {
            acc.push({ key })
        }
        return acc
    }, [])

    return (
        <>
            {isModalOpen && <ToggleModal toggle={toggleModal} />}
            <div className='product-grid'>
                <div onClick={toggleModal}>
                    {stickersData.map((item: any, index: any) => (
                        <ImageComponent
                            key={index}
                            keyName={item.key}
                            offset={index * 20}
                        />
                    ))}
                </div>
                <div className='product-img-grid'>
                    <Link
                        key={product.title}
                        to={`/products/${product.handle}`}
                    >
                        <img
                            src={product.images.nodes[0].url}
                            alt={product.title}
                        />
                    </Link>
                </div>
                <div className='product-info-grid'>
                    <h3>
                        {product.productType.length > 30
                            ? product.vendor.slice(0, 30) + '...'
                            : product.vendor}
                    </h3>
                    <p>
                        {product.title.length > 30
                            ? product.title.slice(0, 30) + '...'
                            : product.title}
                    </p>
                </div>
            </div>
        </>
    )
}

function ImageComponent({ keyName, offset }: any) {
    const stickerPath = `/product/stickers/${keyName}.png`

    const style = {
        marginRight: `${offset}px`,
    }
    return (
        <img
            className='product-img-grid-sticker'
            src={stickerPath}
            alt={keyName}
            style={style}
        />
    )
}

function ToggleModal(toggle: any) {
    return (
        <div className='modal-stickers-overlay'>
            <div className='modal-stickers'>
                <div className='modal-stickers-close' onClick={toggle.toggle}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                    >
                        <path
                            id='Tracé_243'
                            data-name='Tracé 243'
                            d='M16841.295-8037.292l-6.295-6.294-6.295,6.294a.988.988,0,0,1-.705.292.988.988,0,0,1-.705-.292,1,1,0,0,1,0-1.417l6.291-6.292-6.291-6.292a1,1,0,0,1,0-1.416,1,1,0,0,1,1.41,0l6.295,6.294,6.295-6.294a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.416l-6.291,6.292,6.291,6.292a1,1,0,0,1,0,1.417.988.988,0,0,1-.705.292A.988.988,0,0,1,16841.295-8037.292Z'
                            transform='translate(-16827 8053)'
                            fill='#fff'
                        />
                    </svg>
                </div>
                <div className='modal-stickers-header'>
                    <h2>Labels trackt</h2>
                    <p>
                        Nos pastilles sont là pour vous guider en un clin d’œil
                        ! Chacune d’elles est un repère visuel qui révèle une
                        caractéristique clé du produit,. Utilisez ces
                        indicateurs pour naviguer dans notre collection et
                        dénicher les pièces qui correspondent à vos critères
                        spécifiques. C’est simple, rapide et cela rend votre
                        expérience d’achat chez Trackt encore plus intuitive et
                        personnalisée.
                    </p>
                </div>
                <div className='modal-stickers-body'>
                    <div className='modal-stickers-body-item'>
                        <img
                            src='/product/stickers/hotDeal.png'
                            alt='hotDeal'
                        />
                        <p>
                            Ces articles prisés sont actuellement en rupture de
                            stock, victimes de leur succès dans l’univers du
                            streetwear. Inscrivez-vous pour être alerté de leur
                            retour.
                        </p>
                    </div>
                    <div className='modal-stickers-body-item'>
                        <img src='/product/stickers/new.png' alt='new' />
                        <p>
                            Offres incontournables, sélectionnées pour leur
                            style audacieux et leurs prix avantageux. Des
                            opportunités éphémères à saisir rapidement pour les
                            amateurs de streetwear.
                        </p>
                    </div>
                    <div className='modal-stickers-body-item'>
                        <img src='/product/stickers/ooo.png' alt='ooo' />
                        <p>
                            Livraison immédiate, cette sélection est dédiée aux
                            articles expédiés en 48H puisque nous possédons
                            l’article dans nos locaux.
                        </p>
                    </div>
                    <div className='modal-stickers-body-item'>
                        <img
                            src='/product/stickers/promotion.png'
                            alt='promotion'
                        />
                        <p>
                            Profitez de promotions exclusives pour enrichir
                            votre collection de streetwear. Des pièces uniques
                            et des réductions alléchantes vous attendent.
                        </p>
                    </div>
                    <div className='modal-stickers-body-item'>
                        <img
                            src='/product/stickers/release.png'
                            alt='release'
                        />
                        <p>
                            Accédez à la crème de la crème avec nos sorties
                            « Exclusive item ». Ces articles premium définissent
                            les standards du streetwear haut de gamme.
                        </p>
                    </div>
                    <div className='modal-stickers-body-item'>
                        <img src='/product/stickers/ship.png' alt='ship' />
                        <p>
                            Soyez à l’avant-garde avec les dernières nouveautés
                            du streetwear. Ces articles fraîchement arrivés sont
                            prêts à définir les prochaines tendances urbaines.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
