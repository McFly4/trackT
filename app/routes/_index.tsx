import React, { useRef, useState } from 'react'
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import {
    useNavigate,
    Link,
    type MetaFunction,
    useLoaderData,
} from '@remix-run/react'
import MainProduct from '~/components/Common/mainProduct'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import MarketDrag from '~/components/Common/MarketDrag'
import TrackT from '~/components/Common/TrackT'
import GoFilters from '~/components/Common/GoFilters'
import { getPaginationVariables } from '@shopify/hydrogen'
import useWindowDimensions from '~/hooks/useWindowDimension'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `TrackT ` }]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const products = await context.storefront.query(HOME_PRODUCTS_QUERY)
    const hero = await context.storefront.query(HERO)
    const pagination = getPaginationVariables(request, {
        pageBy: 24,
    })

    const fastShip = await context.storefront.query(FILTERS_QUERY, {
        variables: {
            first: 30,
            filters: [
                {
                    productMetafield: {
                        namespace: 'custom',
                        key: 'fastShip',
                        value: 'true',
                    },
                },
            ],
            collections: 'title:all',
            ...pagination,
        },
    })

    const exclusive = await context.storefront.query(FILTERS_QUERY, {
        variables: {
            first: 30,
            filters: [
                {
                    productMetafield: {
                        namespace: 'custom',
                        key: 'release',
                        value: 'true',
                    },
                },
            ],
            collections: 'title:all',
            ...pagination,
        },
    })

    return json({
        products,
        fastShip,
        exclusive,
        hero,
    })
}

export default function HomePage() {
    const { width } = useWindowDimensions()
    const sizeScreen = width || 1920
    const { products, fastShip, exclusive, hero } =
        useLoaderData<typeof loader>()
    const navigate = useNavigate()
    const productsList = products.metaobjects.nodes[0].field.references.nodes
    const fastShipProducts = fastShip.collections.nodes[0].products.nodes
    const exclusiveProducts = exclusive.collections.nodes[0].products.nodes
    const heroSection = hero?.metaobjects?.nodes
    const swiperRef = useRef(null)
    const [autoplayTimes, setAutoplayTimes] = useState<number[]>([0, 0]) // État pour stocker les temps restants
    const [showText1, setShowText1] = useState(false)
    const [showText2, setShowText2] = useState(false)
    const [showText3, setShowText3] = useState(false)
    const [showText4, setShowText4] = useState(false)
    // wait

    const onAutoplayTimeLeft = (
        s: any,
        time: any,
        progress: any,
        index: number
    ) => {
        const updatedTimes = [...autoplayTimes]
        updatedTimes[index] = Math.ceil(time / 1000) // Mettre à jour le temps restant pour la diapositive spécifiée
        setAutoplayTimes(updatedTimes)
    }

    return (
        <div
            style={{
                backgroundColor: '#000',
            }}
        >
            <div className='home'>
                <Swiper
                    ref={swiperRef}
                    slidesPerView={1}
                    spaceBetween={0}
                    loop
                    grabCursor={true}
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 5000,
                    }}
                    style={{
                        maxHeight: '100vh',
                    }}
                    onAutoplayTimeLeft={(s, time, progress) =>
                        onAutoplayTimeLeft(s, time, progress, 0)
                    } // Pour la première diapositive
                >
                    {heroSection?.map((hero: any, index: number) => (
                        <SwiperSlide
                            key={index}
                            style={{
                                width: '100% !important',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                    }}
                                >
                                    <img
                                        src={
                                            hero.fields?.find(
                                                (field: any) =>
                                                    field?.key ===
                                                    (sizeScreen > 1600
                                                        ? 'fileBig'
                                                        : sizeScreen > 768
                                                        ? 'file_desktop'
                                                        : 'file_mobile')
                                            )?.reference?.image?.url
                                        }
                                        alt='home'
                                        style={{
                                            width: '100%',
                                        }}
                                    />

                                    {hero.fields?.find(
                                        (field: any) =>
                                            field?.key ===
                                            (sizeScreen > 1600
                                                ? 'fileBig'
                                                : sizeScreen > 768
                                                ? 'file_desktop'
                                                : 'file_mobile')
                                    )?.reference?.sources?.[0]?.url && (
                                        <video
                                            src={
                                                hero.fields?.find(
                                                    (field: any) =>
                                                        field?.key ===
                                                        (sizeScreen > 1600
                                                            ? 'fileBig'
                                                            : sizeScreen > 768
                                                            ? 'file_desktop'
                                                            : 'file_mobile')
                                                )?.reference?.sources?.[0]?.url
                                            }
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            style={{
                                                width: '100%',
                                            }}
                                        ></video>
                                    )}

                                    <div
                                        className='autoplay-progress'
                                        slot='container-end'
                                    >
                                        <span>{autoplayTimes[0]}</span>
                                    </div>
                                    {sizeScreen > 768 && (
                                        <div
                                            className='shop-now'
                                            style={{
                                                backgroundColor:
                                                    hero?.fields?.find(
                                                        (field: any) =>
                                                            field?.key ===
                                                            'color_txt'
                                                    )?.value,
                                            }}
                                        >
                                            <Link
                                                to={
                                                    hero.fields?.find(
                                                        (field: any) =>
                                                            field?.key ===
                                                            'link'
                                                    )?.value
                                                }
                                            >
                                                <h4
                                                    style={{
                                                        color: hero.fields?.find(
                                                            (field: any) =>
                                                                field?.key ===
                                                                'color'
                                                        )?.value,
                                                    }}
                                                >
                                                    {
                                                        hero.fields?.find(
                                                            (field: any) =>
                                                                field?.key ===
                                                                'bouton'
                                                        )?.value
                                                    }
                                                </h4>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className='panel-trackt'>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div className='panel-container'>
                        {sizeScreen > 768 && (
                            <>
                                {' '}
                                <div
                                    className='four-btns'
                                    style={{
                                        justifyContent: 'unset',
                                    }}
                                >
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
                                                }}
                                            />
                                            Random item
                                        </button>
                                    </Link>
                                </div>
                                <div className='header' id='shop'>
                                    <h1>Panel Trackt</h1>
                                    <p>
                                        Découvrez le Panel Trackt, une sélection
                                        soigneusement élaborée de ce que le
                                        streetwear a de mieux à offrir. Ici,
                                        nous rassemblons des pièces uniques, des
                                        tendances émergentes et des
                                        collaborations exclusives, tout en un
                                        seul endroit pour enrichir votre
                                        expérience de shopping. Chaque visite au
                                        Panel Trackt est une nouvelle aventure.
                                        Explorez, découvrez, et laissez-vous
                                        inspirer. Bienvenue dans l&apos;avenir
                                        du shopping streetwear!
                                    </p>
                                </div>
                            </>
                        )}
                        {sizeScreen < 768 && (
                            <div className='responsive-home-header'>
                                <h4>panel trackt </h4>
                                <span>Tout afficher</span>
                                <p>
                                    Découvrez le Panel Trackt, une sélection
                                    soigneusement élaborée de ce que le
                                    streetwear a de mieux à offrir. Ici, nous
                                    rassemblons des pièces uniques, des
                                    tendances émergentes et des collaborations
                                    exclusives, tout en un seul endroit pour
                                    enrichir votre expérience de shopping.
                                    Chaque visite au Panel Trackt est une
                                    nouvelle aventure. Explorez, découvrez, et
                                    laissez-vous inspirer. Bienvenue dans
                                    l’avenir du shopping streetwear!
                                </p>
                            </div>
                        )}
                        {sizeScreen > 768 && (
                            <div className='panel-products-grid'>
                                {productsList.map((product: any) => (
                                    <MainProduct
                                        product={product}
                                        quantity={productsList?.length}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {sizeScreen < 768 && <TrackT products={productsList} />}

            <div className='hfooter'>
                {sizeScreen > 768 ? (
                    <video
                        width='100%'
                        height='auto'
                        autoPlay
                        muted
                        loop
                        style={{
                            marginTop: '130px',
                            marginBottom: '80px',
                        }}
                    >
                        <source src='/product/banner.mp4' type='video/mp4' />
                        <img src='/product/banner.png' alt='banner' />
                    </video>
                ) : (
                    <div className='responsive-video-banner'>
                        <video width='100%' height='auto' autoPlay muted loop>
                            <source
                                src='/product/banner.mp4'
                                type='video/mp4'
                            />
                            <img src='/product/banner.png' alt='banner' />
                        </video>
                    </div>
                )}

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
                        {sizeScreen > 768 ? (
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
                        {sizeScreen > 768 ? (
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
                <TrackT products={fastShipProducts} title='Chez vous en 48h' />
                <MarketDrag />
                <GoFilters />
                <TrackT products={exclusiveProducts} title='Exclusive Items' />
            </div>
        </div>
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
              box: metafield(namespace: "custom", key: "box_sizing") {
                key
                value
              }
              soon: metafield(namespace: "custom", key: "soon") {
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

const FILTERS_QUERY = `#graphql
fragment ProductFragment on Product {
  id
  title
  vendor
  handle
  description
  options {
    name
    values
  }
  images(first: 1) {
    nodes {
      url
    }
  }
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
  materials: metafield(namespace: "custom", key: "materiaux") {
    key
    value
  }
  daterelease: metafield(namespace: "custom", key: "date") {
    key
    value
  }
  colors: metafield(namespace: "custom", key: "couleurs") {
    key
    value
  }
  box_sizing: metafield(namespace: "custom", key: "box_sizing") {
    key
    value
  }
 soon: metafield(namespace: "custom", key: "soon") {
    key
    value
  }
  box: metafield(namespace: "custom", key: "box_sizing"){
    key
    value
   }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
}

query FiltersQuery($first: Int!, $filters: [ProductFilter!], $collections: String, $startCursor: String, $endCursor: String) {
  collections(query: $collections, first: 1) {
  nodes {
    products(
      first: $first
      filters: $filters
      before: $startCursor
      after: $endCursor
    ) {
      nodes {
        ...ProductFragment
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
}
}
`

const HERO = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "HERO_SECTION") {
    nodes {
      fields {
        key
        value
        reference {
          ... on Video {
            sources{
              url
            }
          }
          ... on MediaImage{
            image{
              url
            }
          }
        }
      }
    }
  }
}
` as const
