import { type MetaFunction, useLoaderData } from '@remix-run/react'
import MarketDrag from '~/components/Common/MarketDrag'
import TrackT from '~/components/Common/TrackT'
import { json, LoaderFunctionArgs } from '@shopify/remix-oxygen'
import React from 'react'
import useWindowDimensions from '~/hooks/useWindowDimension'
import Crowns from '~/components/Common/Modals/Crowns'
import Labels from '~/components/Common/Modals/Labels'
export const meta: MetaFunction = () => {
    return [{ title: 'About' }]
}

export async function loader({ context }: LoaderFunctionArgs) {
    const products = await context.storefront.query(HOME_PRODUCTS_QUERY)

    return json({ products })
}

export default function About() {
    const { products } = useLoaderData<typeof loader>()
    const productsList =
        products?.metaobjects?.nodes[0]?.field?.references?.nodes
    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920
    const [showText1, setShowText1] = React.useState(false)
    const [showText2, setShowText2] = React.useState(false)
    const [crownsOpen, setCronwsOpen] = React.useState(false)
    const [labelsOpen, setLabelsOpen] = React.useState(false)

    const openLabels = () => {
        setLabelsOpen(true)
    }

    const closeLabels = () => {
        setLabelsOpen(false)
    }

    const openCronws = () => {
        setCronwsOpen(true)
    }

    const closeCrowns = () => {
        setCronwsOpen(false)
    }

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
                    <a href='#futur'>
                        <div className='a-futur-double-item'>
                            <h2>L’EXPÉRIENCE FUTURISTE DU STREETWEAR</h2>
                        </div>
                    </a>
                    <a href='#vision'>
                        <div className='a-futur-double-item'>
                            <h2>Vision 2025</h2>
                        </div>
                    </a>
                </div>
            </div>
            <div className='a-vision'>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '20px',
                        marginBottom: '100px',
                    }}
                >
                    <h2>Vision trackT 2025</h2>
                    <img
                        style={{
                            marginLeft: '20px',
                        }}
                        src='/about/soonAbout.png'
                        alt='coming'
                    />
                </div>
                <div className='a-vision-container'>
                    <div className='a-vision-container-item'>
                        <div>
                            <img src='/about/drop.png' alt='about' />
                        </div>
                        <p>
                            « Drop Reused » est le centre de la vision durable
                            et innovante de TrackT. Nous réinventons le
                            streetwear en donnant une seconde vie à des produits
                            usagés, notamment des sneakers, remis à neuf et
                            proposés à des prix accessibles. Ces ventes
                            régulières sont une célébration de la mode
                            responsable et un moyen d’obtenir des produits plus
                            accessibles. Grâce à notre système de notation
                            transparent, chaque client peut connaître l’état
                            précis du produit. C’est une expérience d’achat
                            travaillée et authentique, où le style rencontre la
                            durabilité et l’accessibilité.
                        </p>
                    </div>
                    <div className='a-vision-container-item'>
                        <div>
                            <img src='/about/track.png' alt='about' />
                        </div>
                        <p>
                            Chez Trackt, nous savons pertinemment que la quête
                            du parfait style peut parfois demander un petit coup
                            de pouce. C’est pourquoi nous vous présentons
                            « Track Item » : un service sur mesure où vos
                            souhaits prennent vie. Vous ne trouvez pas
                            exactement ce que vous cherchez sur notre site ?
                            Envoyez-nous votre requête, et notre équipe se
                            lancera dans une traque pour vous aider à trouver
                            l’article idéal, à votre taille et à un prix qui
                            vous convient. C’est l’authenticité Trackt à votre
                            service, où chaque demande est un nouveau défi.
                        </p>
                    </div>
                    <div className='a-vision-container-item'>
                        <div>
                            <img src='/about/wanted.png' alt='about' />
                        </div>
                        <p>
                            Pour nos connaisseurs de streetwear, « Wanted Item »
                            est votre terrain de jeu. Vous avez un œil pour les
                            pièces rares et exclusives ? Parcourez notre liste
                            d’items convoités et, si vous possédez ce que nous
                            cherchons, faites-nous une proposition. C’est une
                            collaboration moderne, et rémunératrice, où votre
                            passion et votre connaissance du streetwear sont
                            récompensées. Rejoignez-nous dans cette aventure
                            unique, où chaque article que vous proposez
                            contribue à façonner et à enrichir l’univers
                            diversifié et dynamique de Trackt. Votre flair pour
                            dénicher l’exceptionnel devient une partie
                            intégrante de notre mission pour offrir le meilleur
                            du streetwear à notre communauté.
                        </p>
                    </div>
                </div>
            </div>
            <div className='a-assets'>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <img src='/about/jean.png' alt='asset1' />
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <img src='/about/sweat.png' alt='asset1' />
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '300px',
                    }}
                >
                    <div className='a-assets-container'>
                        <div>
                            <img src='/about/independant.svg' alt='By trackT' />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <img src='/about/byTrackt.svg' alt='By trackT' />
                            <img src='/about/c.svg' alt='Copyright' />
                        </div>
                        <div>
                            <img src='/about/brand.svg' alt='By trackT' />
                        </div>
                        <div>
                            <p>
                                Trackt s’apprête à lancer « Independant Brand »,
                                une catégorie exclusive de notre boutique dédiée
                                à valoriser des œuvres d’artistes et de marques
                                indépendantes. Sélectionnés avec soin par notre
                                direction artistique, ces articles incarnent et
                                amplifient l’esprit rebelle et libre de Trackt.
                                De tableaux grunge, objets uniques, accessoires
                                wtf, textiles… seront disponibles en quantités
                                extrêmement limitées. Cette initiative est notre
                                engagement à promouvoir la diversité créative et
                                à offrir à notre communauté des pièces
                                véritablement uniques et expressives, en
                                parfaite harmonie avec l’audace et l’originalité
                                de la marque Trackt.
                            </p>
                        </div>
                    </div>
                    {width > 768 && (
                        <img
                            src='/about/independant1.png'
                            alt='asset1'
                            style={{
                                marginLeft: '65px',
                            }}
                        />
                    )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <video
                        muted
                        autoPlay
                        loop
                        style={{
                            width: width > 768 ? 'unset' : '100%',
                            marginBottom: width > 768 ? '0' : '100px',
                        }}
                    >
                        <source src='/about/betaVersion.mp4' type='video/mp4' />
                    </video>
                </div>
                <div id='futur'></div>
            </div>
            <div className='a-first'>
                <div className='a-first-container'>
                    <p>
                        Trackt transforme votre expérience d’achat en une
                        aventure immersive et créative, réinventant ainsi
                        l’univers du streetwear d’un oeil futuriste.
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
                        immersion dans l’univers du streetwear. Trackt développe
                        son propre style à travers son shop, sa communication et
                        votre expérience d’achat. Chaque étape vous réserve une
                        surprise, de la découverte de la marque à l’unboxing de
                        votre item TrackT
                    </p>
                </div>
                <div className='a-first-video'>
                    <video muted autoPlay loop>
                        <source
                            src='/about/TracktHistory.mp4'
                            type='video/mp4'
                        />
                    </video>
                </div>
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
                    <img
                        src='/about/2.png'
                        alt='about'
                        style={{
                            width: width > 768 ? '250px' : '150px',
                        }}
                    />
                    <h2
                        style={{
                            marginTop: '80px',
                        }}
                    >
                        safe place
                    </h2>
                </div>
                <div className='panel-container-box'>
                    <div className='panel-container-box-item'>
                        <img
                            src='/home/red.png'
                            alt='red'
                            style={{
                                width: '580px',
                                height: '340px',
                            }}
                        />
                        <h2
                            style={{
                                color: '#E51E1A',
                                marginTop: '80px',
                                marginBottom: '10px',
                            }}
                        >
                            support client personnalisé
                        </h2>
                        {width > 768 ? (
                            <p>
                                Entrez dans l’univers Trackt, où chaque
                                interaction est une expérience unique. Notre
                                équipe dédiée au support client est le cœur
                                battant de notre atelier mystérieux. Nous sommes
                                là pour vous guider, vous inspirer et répondre à
                                vos questions avec une touche personnelle.{' '}
                                <br /> <br />
                                Que vous cherchiez des conseils sur la dernière
                                tendance ou des détails sur une pièce rare,
                                notre équipe, en coulisses, travaille avec
                                passion pour vous offrir une assistance
                                sur-mesure. C’est le conseil d’un connaisseur,
                                le soutien d’un ami, le secret d’un atelier où
                                chaque question trouve sa réponse.
                            </p>
                        ) : (
                            <div className='responsive-show-more'>
                                {!showText1 ? (
                                    <p>
                                        Ici chaque interaction est une
                                        expérience unique. Notre équipe dédiée
                                        au support client est le…
                                    </p>
                                ) : (
                                    <p>
                                        Entrez dans l’univers Trackt, où chaque
                                        interaction est une expérience unique.
                                        Notre équipe dédiée au support client
                                        est le cœur battant de notre atelier
                                        mystérieux. Nous sommes là pour vous
                                        guider, vous inspirer et répondre à vos
                                        questions avec une touche personnelle.{' '}
                                        <br /> <br />
                                        Que vous cherchiez des conseils sur la
                                        dernière tendance ou des détails sur une
                                        pièce rare, notre équipe, en coulisses,
                                        travaille avec passion pour vous offrir
                                        une assistance sur-mesure. C’est le
                                        conseil d’un connaisseur, le soutien
                                        d’un ami, le secret d’un atelier où
                                        chaque question trouve sa réponse.
                                    </p>
                                )}

                                <button
                                    onClick={() => setShowText1(!showText1)}
                                >
                                    {showText1 ? '-' : '+'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='panel-container-box-item'>
                        <img
                            src='/home/blue.png'
                            alt='blue'
                            style={{
                                width: '580px',
                                height: '340px',
                            }}
                        />
                        <h2
                            style={{
                                color: '#3950D3',
                                marginTop: '80px',
                                marginBottom: '10px',
                            }}
                        >
                            AUTHENTICITÉ GARANTIE
                        </h2>
                        {width > 768 ? (
                            <p>
                                Ici chaque interaction est une expérience
                                unique. Notre équipe dédiée au support client
                                est le cœur battant de notre atelier. Nous
                                sommes là pour vous guider, vous inspirer et
                                répondre à vos questions avec une touche
                                personnelle. Que vous cherchiez des conseils sur
                                la dernière tendance ou des détails sur une
                                pièce rare, notre équipe, en coulisses,
                                travaille avec passion pour vous offrir une
                                assistance sur-mesure. Disponible 7 / 7
                            </p>
                        ) : (
                            <div className='responsive-show-more'>
                                {!showText2 ? (
                                    <p>
                                        Ici chaque interaction est une
                                        expérience unique. Notre équipe dédiée
                                        au support client est le…
                                    </p>
                                ) : (
                                    <p>
                                        Ici chaque interaction est une
                                        expérience unique. Notre équipe dédiée
                                        au support client est le… cœur battant
                                        de notre atelier. Nous sommes là pour
                                        vous guider, vous inspirer et répondre à
                                        vos questions avec une touche
                                        personnelle. Que vous cherchiez des
                                        conseils sur la dernière tendance ou des
                                        détails sur une pièce rare, notre
                                        équipe, en coulisses, travaille avec
                                        passion pour vous offrir une assistance
                                        sur-mesure. Disponible 7 / 7
                                    </p>
                                )}

                                <button
                                    onClick={() => setShowText2(!showText2)}
                                >
                                    {showText2 ? '-' : '+'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <MarketDrag />
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
                    <img
                        src='/about/3.png'
                        alt='about'
                        style={{
                            width: width > 768 ? '250px' : '150px',
                        }}
                    />
                    <h2
                        style={{
                            marginTop: '80px',
                        }}
                    >
                        repères visuels
                    </h2>
                </div>
                {width > 768 ? (
                    <>
                        <div className='modal-stickers modal-stickers-about'>
                            <div className='modal-stickers-header'>
                                <h3>Labels trackt</h3>
                                <p>
                                    Nos pastilles sont là pour vous guider en un
                                    clin d’œil ! Chacune d’elles est un repère
                                    visuel qui révèle une caractéristique clé du
                                    produit,. Utilisez ces indicateurs pour
                                    naviguer dans notre collection et dénicher
                                    les pièces qui correspondent à vos critères
                                    spécifiques. C’est simple, rapide et cela
                                    rend votre expérience d’achat chez Trackt
                                    encore plus intuitive et personnalisée.
                                </p>
                            </div>

                            <div className='modal-stickers-body'>
                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/release.png'
                                        alt='release'
                                    />
                                    <p>
                                        Accédez à la crème de la crème avec nos
                                        sorties « Exclusive item ». Ces articles
                                        premium définissent les standards du
                                        streetwear haut de gamme.
                                    </p>
                                </div>
                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/hotDeal.png'
                                        alt='hotDeal'
                                    />
                                    <p>
                                        Offres incontournables, sélectionnées
                                        pour leur style audacieux et leurs prix
                                        avantageux. Des opportunités éphémères à
                                        saisir rapidement pour les amateurs de
                                        streetwear.
                                    </p>
                                </div>

                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/new.png'
                                        alt='new'
                                    />
                                    <p>
                                        Soyez à l’avant-garde avec les dernières
                                        nouveautés du streetwear. Ces articles
                                        fraîchement arrivés sont prêts à définir
                                        les prochaines tendances urbaines.
                                    </p>
                                </div>
                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/ship.png'
                                        alt='ship'
                                    />
                                    <p>
                                        Livraison immédiate, cette sélection est
                                        dédiée aux articles expédiés en 48H
                                        puisque nous possédons l’article dans
                                        nos locaux.
                                    </p>
                                </div>

                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/promotion.png'
                                        alt='promotion'
                                    />
                                    <p>
                                        Profitez de promotions exclusives pour
                                        enrichir votre collection de streetwear.
                                        Des pièces uniques et des réductions
                                        alléchantes vous attendent.
                                    </p>
                                </div>
                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/ooo.png'
                                        alt='ooo'
                                        className='img-ooo'
                                    />
                                    <p>
                                        Ces articles prisés sont actuellement en
                                        rupture de stock, victimes de leur
                                        succès dans l’univers du streetwear.
                                        Inscrivez-vous pour être alerté de leur
                                        retour.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='a-third-stick'>
                            <h2>Une étiquette pour votre taille</h2>
                            <p>
                                Trackt a innové en créant des étiquettes
                                visuelles handmade, apportant une touche
                                personnelle et authentique pour distinguer et
                                identifier chaque taille.
                            </p>
                            <div className='a-third-stick-container'>
                                <video muted autoPlay loop playsInline>
                                    <source
                                        src='/about/tagprices.mp4'
                                        type='video/mp4'
                                    />
                                </video>
                                <video muted autoPlay loop>
                                    <source
                                        src='/about/tagprices2.mp4'
                                        type='video/mp4'
                                    />
                                </video>
                            </div>
                            <div className='a-third-guid'>
                                <h2>Guide des tailles</h2>
                                <p>
                                    Nous avons classifié nos articles en trois
                                    catégories distinctes pour mieux vous aider
                                    à choisir vos tailles : Little, Medium et
                                    Over. <br />
                                    Nous vous invitons à explorer ces
                                    différentes options pour trouver la coupe
                                    qui vous convient le mieux.
                                </p>
                                <div className='a-third-guid-container'>
                                    <div className='a-third-guid-container-item'>
                                        <img
                                            src='/about/little_toothbrush.png'
                                            alt='little_toothbrush'
                                        />
                                        <p>Little</p>
                                        <p>
                                            Adapté à ceux qui aiment un style
                                            structuré. Coupe sérée.
                                        </p>
                                    </div>
                                    <div className='a-third-guid-container-item'>
                                        <img
                                            src='/about/medium_toothbrush.png'
                                            alt='medium_toothbrush'
                                        />
                                        <p>Medium</p>
                                        <p>
                                            Conçu pour ceux qui cherchent
                                            l’équilibre. Sizing universel.
                                        </p>
                                    </div>
                                    <div className='a-third-guid-container-item'>
                                        <img
                                            src='/about/over_toothbrush.png'
                                            alt='over_toothbrush'
                                        />
                                        <p>over</p>
                                        <p>
                                            Destiné à ceux qui privilégient
                                            l’espace et la liberté de mouvement.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='a-third-guid'>
                                <h2>OPTIONS DE LIVRAISON & RETOUR</h2>
                                <p>
                                    Nous avons crée trois catégories d’achats
                                    pour nuancer les différentes options de
                                    retours et remboursement. <br />
                                    Repérez-les lors de vos achats pour
                                    comprendre les modalités de
                                    renvois/livraison et choisir ce qui vous
                                    convient le mieux.
                                </p>
                                <div className='a-third-guid-container a-third-cart'>
                                    <div className='a-third-guid-container-item'>
                                        <img
                                            src='/cart/cartClassic.png'
                                            alt='cartClassic'
                                        />
                                        <p>Panier classique</p>
                                        <span>0 - 250€</span>
                                        <p>
                                            <br />
                                            RETOURS PAYANTS <br />
                                            {/*BOOSTER RETOUR* 24H (10 €)*/}
                                        </p>
                                        <p>Livraison 10€ - Retours 10€</p>
                                    </div>
                                    <div className='a-third-guid-container-item'>
                                        <img
                                            src='/cart/cartPremium.png'
                                            alt='cartClassic'
                                        />
                                        <p>Panier premium</p>
                                        <span>250€ - 500€</span>
                                        <p>
                                            RÉDUCTION LIVRAISON <br />
                                            RETOURS GRATUITS <br />
                                            {/*BOOSTER RETOUR* 24H (20 €)*/}
                                        </p>
                                        <p>Livraison 5€</p>
                                    </div>
                                    <div className='a-third-guid-container-item'>
                                        <img
                                            src='/cart/cartExclusif.png'
                                            alt='cartClassic'
                                        />
                                        <p>Panier premium</p>
                                        <span>+500€</span>
                                        <p>
                                            LIVRAISON GRATUITE EXPRESS
                                            <br />
                                            RETOURS GRATUITS <br />
                                            POCKET ITEM SURPRISE
                                        </p>
                                        <p>Livraison express</p>
                                    </div>
                                </div>
                            </div>
                            {/*<p*/}
                            {/*    style={{*/}
                            {/*        width: '80%',*/}
                            {/*        margin: '0 auto',*/}
                            {/*        marginTop: '-50px',*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    * Les booster retours sont des codes de réductions que*/}
                            {/*    vous pouvez activer sur toute notre boutique. Leur*/}
                            {/*    montant et leur durée de vie sont variable selon le type*/}
                            {/*    de panier que vous avez commandé. Dès que notre équipe*/}
                            {/*    valide votre retour, vous pouvez délibérément activer*/}
                            {/*    votre booster ou le préserver pour de futurs achats.*/}
                            {/*</p>*/}
                        </div>
                    </>
                ) : (
                    <div className='res-visuel'>
                        <div className='res-visuel-header'>
                            <h4>UNE ÉTIQUETTE POUR VOTRE TAILLE</h4>
                            <p>
                                Trackt a innové en créant des étiquettes
                                visuelles handmade, apportant une touche
                                personnelle et authentique pour distinguer et
                                identifier chaque taille.
                            </p>
                        </div>
                        <div>
                            <video muted autoPlay loop controls={false}>
                                0
                                <source
                                    src='/about/tagprices.mp4'
                                    type='video/mp4'
                                />
                            </video>
                            <video muted autoPlay loop>
                                <source
                                    src='/about/tagprices2.mp4'
                                    type='video/mp4'
                                />
                            </video>
                        </div>
                        <div className='res-visuel-more'>
                            <h4>EXPLICATIONS SUPPLÉMENTAIRES</h4>
                            <div className='res-visuel-btn'>
                                <button onClick={() => openLabels()}>
                                    labels trackt
                                </button>
                                <button onClick={() => openCronws()}>
                                    options de livraison & retours
                                </button>
                                <button>Guide des tailles</button>
                            </div>
                        </div>
                        {crownsOpen && (
                            <Crowns isOpen={openCronws} onClose={closeCrowns} />
                        )}
                        {labelsOpen && (
                            <Labels isOpen={openLabels} onClose={closeLabels} />
                        )}
                    </div>
                )}
            </div>
            <div className='a-fourth'>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '40px 0',
                    }}
                >
                    <img
                        src='/about/4.png'
                        alt='about'
                        width={width > 768 ? '250px' : '150px'}
                    />
                    <h2
                        style={{
                            marginTop: '80px',
                        }}
                    >
                        ARTICLES EXCLUSIFS
                    </h2>
                </div>
                <div className='a-fourth-exclusive'>
                    <img
                        src={
                            width > 768
                                ? '/about/green.png'
                                : '/about/responsiveExclusif.png'
                        }
                        alt='green'
                    />
                    <div className='a-fourth-exclusive-text'>
                        <h2>EXCLUSIVITÉ À VOTRE PORTÉE</h2>
                        <p>
                            Exclusif ne signifie pas inaccessible. Sur Trackt,
                            nous vous ouvrons les portes d’un monde où
                            l’exclusivité et le style se rencontrent. Des
                            éditions limitées, des collaborations uniques, et
                            des trouvailles rares – tout est sélectionné pour
                            vous offrir une expérience de mode streetwear hors
                            du commun. Notre sélection est votre passeport pour
                            un style qui se démarque, pour des pièces que tout
                            le monde ne peut pas avoir. Avec Trackt,
                            habillez-vous dans ce qui définit le futur du
                            streetwear, aujourd’hui.
                        </p>
                    </div>
                </div>
                <TrackT products={productsList} />
                <div className='a-fourth-trackt'></div>
            </div>
        </>
    )
}

const HOME_PRODUCTS_QUERY = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "home") {
    nodes {
      field(key: "products") {
        references(first: 20) {
          nodes {
            ... on Product {
              title
              productType
              handle
              vendor
              toothBrush: metafield(namespace: "custom", key: "toothbrush") {
                key
                value
              }
              ooo: metafield(namespace: "custom", key: "outofstock") {
                key
                value
              }
              new: metafield(namespace: "custom", key: "new") {
                key
                value
              }
              ship: metafield(namespace: "custom", key: "fastShip") {
                key
                value
              }
              release: metafield(namespace: "custom", key: "release") {
                key
                value
              }
              promotion: metafield(namespace: "custom", key: "promotion") {
                key
                value
              }
              hotDeal: metafield(namespace: "custom", key: "hotDeal") {
                key
                value
              }
              features: metafield(namespace: "custom", key: "features") {
                key
                value
              }
              images(first: 1) {
                nodes {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
}
` as const
