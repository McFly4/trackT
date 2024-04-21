import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Link } from '@remix-run/react'
import useWindowDimensions from '~/hooks/useWindowDimension'

export default function MarketDrag() {
    const { width } = useWindowDimensions()
    const sizeScreen = width || 1920
    const [showText1, setShowText1] = useState(false)
    const [showText2, setShowText2] = useState(false)
    const [showText3, setShowText3] = useState(false)
    const [showText4, setShowText4] = useState(false)
    const [showText5, setShowText5] = useState(false)

    return (
        <div
            style={{
                padding: sizeScreen > 768 ? '100px 20px' : '100px 0',
            }}
        >
            <Swiper
                slidesPerView={sizeScreen > 768 ? 'auto' : 1}
                grabCursor={true}
                loop={true}
                className='market-drag-swiper'
            >
                <SwiperSlide
                    style={{
                        width: sizeScreen > 768 ? '70%' : '100%',
                    }}
                >
                    <div className='market-drag-item'>
                        <img
                            src={
                                sizeScreen > 768
                                    ? '/component/green.png'
                                    : '/component/Responsive/green.png'
                            }
                            alt='green'
                            style={{
                                width: sizeScreen > 768 ? '150px' : 'unset',
                                height: sizeScreen > 768 ? '260px' : 'unset',
                                padding: sizeScreen > 768 ? 'unset' : '20px',
                            }}
                        />
                        <div
                            style={{
                                paddingLeft: '60px',
                            }}
                        >
                            <h3
                                style={{
                                    marginBottom: '25px',
                                }}
                            >
                                EXCLUSIVITÉ À VOTRE PORTÉE
                            </h3>
                            {sizeScreen > 768 ? (
                                <p>
                                    <p>
                                        Exclusif ne signifie pas inaccessible.
                                        Sur Trackt, nous vous ouvrons les portes
                                        d’un monde où l’exclusivité et le style
                                        se rencontrent. Des éditions limitées,
                                        des collaborations uniques, et des
                                        trouvailles rares – tout est sélectionné
                                        pour vous offrir une expérience de mode
                                        streetwear hors du commun. Notre
                                        sélection est votre passeport pour un
                                        style qui se démarque, pour des pièces
                                        que tout le monde ne peut pas avoir.
                                        Avec Trackt, habillez-vous dans ce qui
                                        définit le futur du streetwear,
                                        aujourd’hui.
                                    </p>
                                </p>
                            ) : (
                                <div className='responsive-show-more'>
                                    {!showText1 ? (
                                        <p>
                                            Exclusif ne signifie pas
                                            inaccessible. Sur Trackt, nous vous
                                            ouvrons les portes d’un monde …
                                        </p>
                                    ) : (
                                        <p>
                                            Exclusif ne signifie pas
                                            inaccessible. Sur Trackt, nous vous
                                            ouvrons les portes d’un monde où
                                            l’exclusivité et le style se
                                            rencontrent. Des éditions limitées,
                                            des collaborations uniques, et des
                                            trouvailles rares – tout est
                                            sélectionné pour vous offrir une
                                            expérience de mode streetwear hors
                                            du commun. Notre sélection est votre
                                            passeport pour un style qui se
                                            démarque, pour des pièces que tout
                                            le monde ne peut pas avoir. Avec
                                            Trackt, habillez-vous dans ce qui
                                            définit le futur du streetwear,
                                            aujourd’hui.
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
                    </div>
                </SwiperSlide>
                <SwiperSlide
                    style={{
                        width: '70%',
                    }}
                >
                    <div className='market-drag-item'>
                        <img
                            src={
                                sizeScreen > 768
                                    ? '/component/vioet.png'
                                    : '/component/Responsive/violet.png'
                            }
                            alt='green'
                            style={{
                                width: sizeScreen > 768 ? '150px' : 'unset',
                                height: sizeScreen > 768 ? '260px' : 'unset',
                                padding: sizeScreen > 768 ? 'unset' : '20px',
                            }}
                        />
                        <div
                            style={{
                                paddingLeft: '60px',
                            }}
                        >
                            <h3
                                style={{
                                    marginBottom: '25px',
                                }}
                            >
                                navigation sécurisée
                            </h3>
                            {sizeScreen > 768 ? (
                                <p>
                                    <p>
                                        Exclusif ne signifie pas inaccessible.
                                        Sur Trackt, nous vous ouvrons les portes
                                        d’un monde où l’exclusivité et le style
                                        se rencontrent. Des éditions limitées,
                                        des collaborations uniques, et des
                                        trouvailles rares – tout est sélectionné
                                        pour vous offrir une expérience de mode
                                        streetwear hors du commun. Notre
                                        sélection est votre passeport pour un
                                        style qui se démarque, pour des pièces
                                        que tout le monde ne peut pas avoir.
                                        Avec Trackt, habillez-vous dans ce qui
                                        définit le futur du streetwear,
                                        aujourd’hui.
                                    </p>
                                </p>
                            ) : (
                                <div className='responsive-show-more'>
                                    {!showText2 ? (
                                        <p>
                                            Nous nous engageons à vous offrir
                                            une expérience de navigation la plus
                                            sécurisée possible. Votre
                                            sécurité...
                                        </p>
                                    ) : (
                                        <p>
                                            Exclusif ne signifie pas
                                            inaccessible. Sur Trackt, nous vous
                                            ouvrons les portes d’un monde où
                                            l’exclusivité et le style se
                                            rencontrent. Des éditions limitées,
                                            des collaborations uniques, et des
                                            trouvailles rares – tout est
                                            sélectionné pour vous offrir une
                                            expérience de mode streetwear hors
                                            du commun. Notre sélection est votre
                                            passeport pour un style qui se
                                            démarque, pour des pièces que tout
                                            le monde ne peut pas avoir. Avec
                                            Trackt, habillez-vous dans ce qui
                                            définit le futur du streetwear,
                                            aujourd’hui.
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
                </SwiperSlide>
                <SwiperSlide
                    style={{
                        width: '70%',
                    }}
                >
                    <div className='market-drag-item'>
                        <img
                            src={
                                sizeScreen > 768
                                    ? '/component/yellow.png'
                                    : '/component/Responsive/yellow.png'
                            }
                            alt='green'
                            style={{
                                width: sizeScreen > 768 ? '150px' : 'unset',
                                height: sizeScreen > 768 ? '260px' : 'unset',
                                padding: sizeScreen > 768 ? 'unset' : '20px',
                            }}
                        />
                        <div
                            style={{
                                paddingLeft: '60px',
                            }}
                        >
                            <h3
                                style={{
                                    marginBottom: '25px',
                                }}
                            >
                                retours faciles et rapide
                            </h3>
                            {sizeScreen > 768 ? (
                                <p>
                                    <p>
                                        Chez Trackt, chaque retour est traité
                                        avec autant de soin et d’attention que
                                        nos sélections. Nous comprenons que
                                        l’univers de la mode est en perpétuelle
                                        évolution et, parfois, vos envies aussi.
                                        Notre processus de retour est simple et
                                        transparent. Retourner ou échanger un
                                        article est possible et facile.
                                        Consultez notre politique de retours
                                        pour plus d’informations.
                                    </p>
                                </p>
                            ) : (
                                <div className='responsive-show-more'>
                                    {!showText3 ? (
                                        <p>
                                            Chez Trackt, chaque retour est
                                            traité avec autant de soin et
                                            d’attention que nos sélections.
                                        </p>
                                    ) : (
                                        <p>
                                            Chez Trackt, chaque retour est
                                            traité avec autant de soin et
                                            d’attention que nos sélections. Nous
                                            comprenons que l’univers de la mode
                                            est en perpétuelle évolution et,
                                            parfois, vos envies aussi. Notre
                                            processus de retour est simple et
                                            transparent. Retourner ou échanger
                                            un article est possible et facile.
                                            Consultez notre politique de retours
                                            pour plus d’informations.
                                        </p>
                                    )}

                                    <button
                                        onClick={() => setShowText3(!showText3)}
                                    >
                                        {showText3 ? '-' : '+'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide
                    style={{
                        width: '70%',
                    }}
                >
                    <div className='market-drag-item'>
                        <img
                            src={
                                sizeScreen > 768
                                    ? '/component/red.png'
                                    : '/component/Responsive/red.png'
                            }
                            alt='green'
                            style={{
                                width: sizeScreen > 768 ? '150px' : 'unset',
                                height: sizeScreen > 768 ? '260px' : 'unset',
                                padding: sizeScreen > 768 ? 'unset' : '20px',
                            }}
                        />
                        <div
                            style={{
                                paddingLeft: '60px',
                            }}
                        >
                            <h3
                                style={{
                                    marginBottom: '25px',
                                }}
                            >
                                transactions sécurisées
                            </h3>
                            {sizeScreen > 768 ? (
                                <p>
                                    <p>
                                        Nous prenons votre sécurité au sérieux,
                                        surtout quand il s’agit de style ! Nous
                                        savons que vous êtes là pour les
                                        dernières exclus, et nous voulons que
                                        votre expérience soit aussi belle que
                                        sécurisée. C’est pourquoi nous utilisons
                                        des technologies de cryptage de pointe
                                        pour protéger chaque achat. Vos données
                                        personnelles et financières sont gardées
                                        sous clé, aussi sécurisées que vos coups
                                        de cœur. Et avec nos systèmes de
                                        paiement, vous pouvez vous concentrer
                                        sur ce qui compte vraiment – trouver
                                        votre prochain item !
                                    </p>
                                </p>
                            ) : (
                                <div className='responsive-show-more'>
                                    {!showText4 ? (
                                        <p>
                                            Nous prenons votre sécurité au
                                            sérieux, surtout quand il s’agit de
                                            style ! Nous savons que vous êtes
                                            ...
                                        </p>
                                    ) : (
                                        <p>
                                            Nous prenons votre sécurité au
                                            sérieux, surtout quand il s’agit de
                                            style ! Nous savons que vous êtes là
                                            pour les dernières exclus, et nous
                                            voulons que votre expérience soit
                                            aussi belle que sécurisée. C’est
                                            pourquoi nous utilisons des
                                            technologies de cryptage de pointe
                                            pour protéger chaque achat. Vos
                                            données personnelles et financières
                                            sont gardées sous clé, aussi
                                            sécurisées que vos coups de cœur. Et
                                            avec nos systèmes de paiement, vous
                                            pouvez vous concentrer sur ce qui
                                            compte vraiment – trouver votre
                                            prochain item !
                                        </p>
                                    )}

                                    <button
                                        onClick={() => setShowText4(!showText4)}
                                    >
                                        {showText4 ? '-' : '+'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide
                    style={{
                        width: '70%',
                    }}
                >
                    <div className='market-drag-item'>
                        <img
                            src={
                                sizeScreen > 768
                                    ? '/component/brown.png'
                                    : '/component/Responsive/brown.png'
                            }
                            alt='green'
                            style={{
                                width: sizeScreen > 768 ? '150px' : 'unset',
                                height: sizeScreen > 768 ? '260px' : 'unset',
                                padding: sizeScreen > 768 ? 'unset' : '20px',
                            }}
                        />
                        <div
                            style={{
                                paddingLeft: '60px',
                            }}
                        >
                            <h3
                                style={{
                                    marginBottom: '25px',
                                }}
                            >
                                Livraison rapide et fiable
                            </h3>
                            {sizeScreen > 768 ? (
                                <p>
                                    <p>
                                        Prêt à recevoir votre prochain coup de
                                        cœur ? Vous n’attendrez pas longtemps !
                                        Nous offrons une livraison rapide et
                                        fiable. Suivez votre commande à la trace
                                        pour savoir exactement quand vous
                                        pourrez apprécier votre nouvelle perle.
                                    </p>
                                </p>
                            ) : (
                                <div className='responsive-show-more'>
                                    {!showText5 ? (
                                        <p>
                                            Prêt à recevoir votre prochain coup
                                            de cœur ? Vous n’attendrez pas
                                            longtemps ! Nous offrons une
                                        </p>
                                    ) : (
                                        <p>
                                            Prêt à recevoir votre prochain coup
                                            de cœur ? Vous n’attendrez pas
                                            longtemps ! Nous offrons une
                                            livraison rapide et fiable. Suivez
                                            votre commande à la trace pour
                                            savoir exactement quand vous pourrez
                                            apprécier votre nouvelle perle.
                                        </p>
                                    )}

                                    <button
                                        onClick={() => setShowText5(!showText5)}
                                    >
                                        {showText5 ? '-' : '+'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}
