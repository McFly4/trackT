import { type MetaFunction } from '@remix-run/react'

export const meta: MetaFunction = () => {
    return [{ title: 'About' }]
}

export default function About() {
    return (
        <>
            <div className='a-futur'>
                <p>
                    Divisée en deux sections, cette page vous emmène plus proche
                    de l’histoire de TrackT là où l’innovation et le streetwear
                    sont en osmose. La première section détaille les avancées
                    que nous avons mises en place en 2024 pour transformer votre
                    expérience d’achat. La seconde vous offre un aperçu de nos
                    projets futurs, notamment la réalisation finale du site
                    Trackt, accompagné du lancement de notre propre marque, et
                    nos collaborations avec des artistes/marques indépendantes.
                </p>
                <div className='a-futur-double'>
                    <div className='a-futur-double-item'>
                        <h2>L’EXPÉRIENCE FUTURISTE DU STREETWEAR</h2>
                    </div>
                    <div className='a-futur-double-item'>
                        <h2>Vision 2025</h2>
                    </div>
                </div>
            </div>
            <div className='a-first'>
                <p>
                    Trackt transforme votre expérience d’achat en une aventure
                    immersive et créative, réinventant ainsi l’univers du
                    streetwear d’un oeil futuriste.
                </p>
                <h1>L’EXPÉRIENCE FUTURISTE DU STREETWEAR</h1>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '40px 0',
                    }}
                >
                    <img src='/about/1.png' alt='about' />
                </div>
                <h2>Expérience d'achat immersive</h2>
                <p
                    style={{
                        textAlign: 'center',
                        marginTop: '20px',
                    }}
                >
                    Notre marque été pensée pour que vous vous sentiez en
                    immersion dans l’univers du streetwear. Trackt développe son
                    propre style à travers son shop, sa communication et votre
                    expérience d’achat. Chaque étape vous réserve une surprise,
                    de la découverte de la marque à l’unboxing de votre item
                    TrackT
                </p>
            </div>
            <div className='a-second'>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '40px 0',
                    }}
                >
                    <img src='/about/2.png' alt='about' />
                    <h2
                        style={{
                            marginTop: '80px',
                        }}
                    >
                        safe place
                    </h2>
                </div>
            </div>
            <div className='a-third'>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '40px 0',
                    }}
                >
                    <img src='/about/3.png' alt='about' />
                    <h2
                        style={{
                            marginTop: '80px',
                        }}
                    >
                        repères visuels
                    </h2>
                </div>
                <div className='modal-stickers modal-stickers-about'>
                    <div className='modal-stickers-header'>
                        <h2>Labels trackt</h2>
                        <p>
                            Nos pastilles sont là pour vous guider en un clin
                            d’œil ! Chacune d’elles est un repère visuel qui
                            révèle une caractéristique clé du produit,. Utilisez
                            ces indicateurs pour naviguer dans notre collection
                            et dénicher les pièces qui correspondent à vos
                            critères spécifiques. C’est simple, rapide et cela
                            rend votre expérience d’achat chez Trackt encore
                            plus intuitive et personnalisée.
                        </p>
                    </div>
                    <div className='modal-stickers-body'>
                        <div className='modal-stickers-body-item'>
                            <img
                                src='/product/stickers/hotDeal.png'
                                alt='hotDeal'
                            />
                            <p>
                                Ces articles prisés sont actuellement en rupture
                                de stock, victimes de leur succès dans l’univers
                                du streetwear. Inscrivez-vous pour être alerté
                                de leur retour.
                            </p>
                        </div>
                        <div className='modal-stickers-body-item'>
                            <img src='/product/stickers/new.png' alt='new' />
                            <p>
                                Offres incontournables, sélectionnées pour leur
                                style audacieux et leurs prix avantageux. Des
                                opportunités éphémères à saisir rapidement pour
                                les amateurs de streetwear.
                            </p>
                        </div>
                        <div className='modal-stickers-body-item'>
                            <img src='/product/stickers/ooo.png' alt='ooo' />
                            <p>
                                Livraison immédiate, cette sélection est dédiée
                                aux articles expédiés en 48H puisque nous
                                possédons l’article dans nos locaux.
                            </p>
                        </div>
                        <div className='modal-stickers-body-item'>
                            <img
                                src='/product/stickers/promotion.png'
                                alt='promotion'
                            />
                            <p>
                                Profitez de promotions exclusives pour enrichir
                                votre collection de streetwear. Des pièces
                                uniques et des réductions alléchantes vous
                                attendent.
                            </p>
                        </div>
                        <div className='modal-stickers-body-item'>
                            <img
                                src='/product/stickers/release.png'
                                alt='release'
                            />
                            <p>
                                Accédez à la crème de la crème avec nos sorties
                                « Exclusive item ». Ces articles premium
                                définissent les standards du streetwear haut de
                                gamme.
                            </p>
                        </div>
                        <div className='modal-stickers-body-item'>
                            <img src='/product/stickers/ship.png' alt='ship' />
                            <p>
                                Soyez à l’avant-garde avec les dernières
                                nouveautés du streetwear. Ces articles
                                fraîchement arrivés sont prêts à définir les
                                prochaines tendances urbaines.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='a-third-stick'>
                    <h2>Une étiquette pour votre taille</h2>
                    <p>
                        Trackt a innové en créant des étiquettes visuelles
                        handmade, apportant une touche personnelle et
                        authentique pour distinguer et identifier chaque taille.
                    </p>
                    <div className='a-third-stick-container'>
                        <img src='/product/size/49.5.png' alt='size' />
                        <img src='/product/size/40.png' alt='size' />
                    </div>
                </div>
            </div>
        </>
    )
}
