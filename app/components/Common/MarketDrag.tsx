import { Swiper, SwiperSlide } from 'swiper/react'
import { Link } from '@remix-run/react'

export default function MarketDrag() {
    return (
        <div
            style={{
                margin: '100px 0',
            }}
        >
            <Swiper
                slidesPerView={'auto'}
                spaceBetween={40}
                grabCursor={true}
                style={{
                    paddingLeft: '40px',
                }}
                loop={true}
            >
                <SwiperSlide
                    style={{
                        width: '70%',
                    }}
                >
                    <Link to='/about'>
                        <div
                            style={{
                                backgroundColor: '#121212',
                                padding: '30px 40px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src='/component/green.png'
                                alt='green'
                                style={{
                                    width: '150px',
                                    height: '260px',
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
                                <p>
                                    Exclusif ne signifie pas inaccessible. Sur
                                    Trackt, nous vous ouvrons les portes d’un
                                    monde où l’exclusivité et le style se
                                    rencontrent. Des éditions limitées, des
                                    collaborations uniques, et des trouvailles
                                    rares – tout est sélectionné pour vous
                                    offrir une expérience de mode streetwear
                                    hors du commun. Notre sélection est votre
                                    passeport pour un style qui se démarque,
                                    pour des pièces que tout le monde ne peut
                                    pas avoir. Avec Trackt, habillez-vous dans
                                    ce qui définit le futur du streetwear,
                                    aujourd’hui.
                                </p>
                            </div>
                        </div>
                    </Link>
                </SwiperSlide>
                <SwiperSlide
                    style={{
                        width: '70%',
                    }}
                >
                    <Link to='/about'>
                        <div
                            style={{
                                backgroundColor: '#121212',
                                padding: '30px 40px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src='/component/violet.png'
                                alt='green'
                                style={{
                                    width: '150px',
                                    height: '260px',
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
                                <p>
                                    Nous nous engageons à vous offrir une
                                    expérience de navigation la plus sécurisée
                                    possible. Votre sécurité en ligne est notre
                                    priorité et nous mettons en place des
                                    certifications de sécurité robustes. Pas de
                                    mauvaises surprises, juste des découvertes
                                    de mode incroyables. Chez Trackt, votre
                                    tranquillité d’esprit est aussi importante
                                    que votre style.
                                </p>
                            </div>
                        </div>
                    </Link>
                </SwiperSlide>
                <SwiperSlide
                    style={{
                        width: '70%',
                    }}
                >
                    <Link to='/about'>
                        <div
                            style={{
                                backgroundColor: '#121212',
                                padding: '30px 40px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src='/component/yellow.png'
                                alt='green'
                                style={{
                                    width: '150px',
                                    height: '260px',
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
                                <p>
                                    Chez Trackt, chaque retour est traité avec
                                    autant de soin et d’attention que nos
                                    sélections. Nous comprenons que l’univers de
                                    la mode est en perpétuelle évolution et,
                                    parfois, vos envies aussi. Notre processus
                                    de retour est simple et transparent.
                                    Retourner ou échanger un article est
                                    possible et facile. Consultez notre
                                    politique de retours pour plus
                                    d’informations.
                                </p>
                            </div>
                        </div>
                    </Link>
                </SwiperSlide>
                <SwiperSlide
                    style={{
                        width: '70%',
                    }}
                >
                    <Link to='/about'>
                        <div
                            style={{
                                backgroundColor: '#121212',
                                padding: '30px 40px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src='/component/red.png'
                                alt='green'
                                style={{
                                    width: '150px',
                                    height: '260px',
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
                                <p>
                                    Nous prenons votre sécurité au sérieux,
                                    surtout quand il s’agit de style ! Nous
                                    savons que vous êtes là pour les dernières
                                    exclus, et nous voulons que votre expérience
                                    soit aussi belle que sécurisée. C’est
                                    pourquoi nous utilisons des technologies de
                                    cryptage de pointe pour protéger chaque
                                    achat. Vos données personnelles et
                                    financières sont gardées sous clé, aussi
                                    sécurisées que vos coups de cœur. Et avec
                                    nos systèmes de paiement, vous pouvez vous
                                    concentrer sur ce qui compte vraiment –
                                    trouver votre prochain item !
                                </p>
                            </div>
                        </div>
                    </Link>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}
