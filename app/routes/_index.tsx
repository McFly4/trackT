import React, { useRef } from 'react'
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `TrackT ` }]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const products = await context.storefront.query(HOME_PRODUCTS_QUERY)
    const pagination = getPaginationVariables(request, {
        pageBy: 24,
    })

    const randomList = ['hotDeal', 'soon', 'fastShip', 'release']
    const metafieldRandom =
        randomList[Math.floor(Math.random() * randomList.length)]

    const randomProduct = await context.storefront.query(FILTERS_QUERY, {
        variables: {
            first: 30,
            filters: [
                {
                    productMetafield: {
                        namespace: 'custom',
                        key: metafieldRandom,
                        value: 'true',
                    },
                },
            ],
            collections: 'title:all',
            ...pagination,
        },
    })

    return json({ products, randomProduct, metafieldRandom })
}

export default function HomePage() {
    const navigate = useNavigate()
    const { products, randomProduct, metafieldRandom } =
        useLoaderData<typeof loader>()
    const productsList = products.metaobjects.nodes[0].field.references.nodes
    const randomProducts = randomProduct.collections.nodes[0].products.nodes
    const randomName = metafieldRandom
    const swiperRef = useRef(null)

    const progressContent = useRef<HTMLSpanElement | null>(null)

    const onAutoplayTimeLeft = (s: any, time: any, progress: any) => {
        if (progressContent.current) {
            progressContent.current.textContent = `${Math.ceil(time / 1000)}`
        }
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
                        delay: 3000,
                    }}
                    style={{
                        maxHeight: '100vh',
                    }}
                >
                    <SwiperSlide
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
                                }}
                            >
                                <img
                                    src='/home/home1.png'
                                    alt='home'
                                    style={{
                                        width: '100%',
                                    }}
                                />
                                <div className='shop-now'>
                                    <Link to='#shop'>
                                        <h4>Shop now</h4>
                                    </Link>
                                    {/*<div*/}
                                    {/*    className='autoplay-progress'*/}
                                    {/*    slot='container-end'*/}
                                    {/*>*/}
                                    {/*    <span ref={progressContent}></span>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide
                        style={{
                            width: '100% !important',
                        }}
                    >
                        <Link to='/about'>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                    }}
                                >
                                    <img
                                        src='/home/home2.png'
                                        alt='home'
                                        style={{
                                            width: '100%',
                                        }}
                                    />
                                    <div className='discover-trackt'>
                                        <Link to='#shop'>
                                            <h4>Découvrir la vision trackt</h4>
                                        </Link>
                                        {/*<div*/}
                                        {/*    className='autoplay-progress'*/}
                                        {/*    slot='container-end'*/}
                                        {/*>*/}
                                        {/*    <span ref={progressContent}></span>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                                {/*<div*/}
                                {/*    className='autoplay-progress'*/}
                                {/*    slot='container-end'*/}
                                {/*>*/}
                                {/*    <span ref={progressContent}></span>*/}
                                {/*</div>*/}
                            </div>
                        </Link>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className='panel-trackt'>
                <div
                    className='filter-trackt'
                    onClick={() => {
                        navigate('/filters')
                    }}
                >
                    <div className='filter-sticky'>
                        <h1>filtres</h1>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div className='panel-container'>
                        <div className='header' id='shop'>
                            <h1>Panel Trackt</h1>
                            <p>
                                Découvrez le Panel Trackt, une sélection
                                soigneusement élaborée de ce que le streetwear a
                                de mieux à offrir. Ici, nous rassemblons des
                                pièces uniques, des tendances émergentes et des
                                collaborations exclusives, tout en un seul
                                endroit pour enrichir votre expérience de
                                shopping. Chaque visite au Panel Trackt est une
                                nouvelle aventure. Explorez, découvrez, et
                                laissez-vous inspirer. Bienvenue dans
                                l&apos;avenir du shopping streetwear!
                            </p>
                        </div>
                        <div className='panel-products-grid'>
                            {productsList.map((product: any) => (
                                <MainProduct product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='hfooter'>
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
                        <p>
                            Entrez dans l’univers Trackt, où chaque interaction
                            est une expérience unique. Notre équipe dédiée au
                            support client est le cœur battant de notre atelier
                            mystérieux. Nous sommes là pour vous guider, vous
                            inspirer et répondre à vos questions avec une touche
                            personnelle. <br /> <br />
                            Que vous cherchiez des conseils sur la dernière
                            tendance ou des détails sur une pièce rare, notre
                            équipe, en coulisses, travaille avec passion pour
                            vous offrir une assistance sur-mesure. C’est le
                            conseil d’un connaisseur, le soutien d’un ami, le
                            secret d’un atelier où chaque question trouve sa
                            réponse.
                        </p>
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
                        <p>
                            « Plongez dans l’univers Trackt, où chaque pièce
                            raconte une histoire, chaque design reflète une
                            passion. Ici, l’authenticité n’est pas juste un mot
                            à la mode - c’est notre essence. Nous curons
                            méticuleusement nos collections pour vous offrir des
                            pièces authentiques et chargées d’histoire,
                            directement issues des créateurs les plus novateurs
                            du streetwear. Chez Trackt, chaque article est une
                            promesse de qualité et d’originalité. Vous ne
                            trouverez pas juste des vêtements ici, mais des
                            expressions de l’art de la rue, des pièces qui
                            parlent de créativité et d’individualité. »
                        </p>
                    </div>
                </div>
                <TrackT products={productsList} title='Panel 2' />
                <MarketDrag />
                <GoFilters />
                <TrackT products={randomProducts} title={randomName} />
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
