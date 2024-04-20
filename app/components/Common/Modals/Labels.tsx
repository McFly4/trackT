import React from 'react'

const Labels = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null

    return (
        <div className='responsive-modal'>
            <button className='responsive-modal-close' onClick={onClose}>
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
            <div className='stickers-responsive'>
                <h4
                    style={{
                        marginBottom: '20px',
                    }}
                >
                    Labels trackt
                </h4>
                <div className='stickers-responsive-item'>
                    <img src='/product/stickers/release.png' alt='release' />
                    <p>
                        Accédez à la crème de la crème avec nos sorties
                        « Exclusive item ». Ces articles premium définissent les
                        standards du streetwear haut de gamme.
                    </p>
                </div>
                <div className='stickers-responsive-item'>
                    <img src='/product/stickers/ship.png' alt='release' />
                    <p>
                        Livraison immédiate, cette sélection est dédiée aux
                        articles expédiés en 48H puisque nous possédons
                        l’article dans nos locaux.
                    </p>
                </div>
                <div className='stickers-responsive-item'>
                    <img src='/product/stickers/hotDeal.png' alt='release' />
                    <p>
                        Offres incontournables, sélectionnées pour leur style
                        audacieux et leurs prix avantageux. Des opportunités
                        éphémères à saisir rapidement pour les amateurs de
                        streetwear.
                    </p>
                </div>
                <div className='stickers-responsive-item'>
                    <img src='/product/stickers/new.png' alt='release' />
                    <p>
                        Soyez à l’avant-garde avec les dernières nouveautés du
                        streetwear. Ces articles fraîchement arrivés sont prêts
                        à définir les prochaines tendances urbaines.
                    </p>
                </div>
                <div className='stickers-responsive-item'>
                    <img src='/product/stickers/soon.png' alt='release' />
                    <p>
                        Disponibles à la vente dans un avenir proche. Gardez un
                        œil sur notre site pour ne pas manquer leur lancement !
                    </p>
                </div>
                <div className='stickers-responsive-item'>
                    <img src='/product/stickers/ooo.png' alt='release' />
                    <p>
                        Articles prisés actuellement en rupture de stock.
                        Inscrivez-vous sur trackt.fr pour être alerté de leur
                        retour.
                    </p>
                </div>
                <div className='stickers-responsive-item'>
                    <img src='/product/stickers/promotion.png' alt='release' />
                    <p>
                        Profitez de promotions exclusives pour enrichir votre
                        collection de streetwear. Des pièces uniques et des
                        réductions alléchantes vous attendent.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Labels
