import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { Image } from '@shopify/hydrogen'
import BestSeller from '~/components/Common/TrackT'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import React from 'react'
import Articles from '~/components/Common/Articles'
dayjs.locale('fr')

type BlogTypes = {
  name: string
  color: string
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.article.title ?? ''} article` }]
}

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { blogHandle, articleHandle } = params

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', { status: 404 })
  }

  const { blog } = await context.storefront.query(ARTICLE_QUERY, {
    variables: { blogHandle, articleHandle },
  })

  if (!blog?.articleByHandle) {
    throw new Response(null, { status: 404 })
  }

  const article = blog.articleByHandle
  const topProducts = await context.storefront.query(TOP_PRODUCTS)
  const rightNow = await context.storefront.query(RIGHT_NOW)
  const trendy = await context.storefront.query(TRENDY)
  const otherArticles = await context.storefront.query(OTHER_ARTICLES)

  return json({ article, topProducts, rightNow, otherArticles, trendy })
}

export default function Article() {
  const { article, topProducts, rightNow, otherArticles, trendy } = useLoaderData<typeof loader>()
  const { title, image, contentHtml, author } = article
  const topedProducts = topProducts.metaobjects.nodes[0].field.references.nodes
  const rightNowProducts = rightNow.metaobjects.nodes[0].field.references.nodes
  const trendyProducts = trendy.metaobjects.nodes[0].field.references.nodes
  const articles = otherArticles.articles.nodes
  const blogTypes = JSON?.parse(article.types?.value) as any
  const blogTypesParent: BlogTypes[] = [
    {
      name: 'voix créatives',
      color: '#6FDD59',
    },
    {
      name: 'fashion tips ',
      color: '#FFF5B2',
    },

    {
      name: 'iconic collabs ',
      color: '#FDE333',
    },
    {
      name: 'shopping guide',
      color: '#FF9147',
    },
    {
      name: 'buy or not buy',
      color: '#EE0A39',
    },
    {
      name: 'évènements',
      color: '#80DDFD',
    },
    {
      name: 'marques indépendante',
      color: '#831DD9',
    },
  ]
  return (
    <div className='article'>
      <div className='article-header'>
        <Image data={image} loading='lazy' />
      </div>

      <div className='article-container'>
        <div className='article-content'>
          <div className='article-content-header'>
            <div className='blog-types'>
              {blogTypes &&
                blogTypes?.map((type: any) => (
                  <div
                    onClick={() => {
                      window.location.href = `/blogs`
                    }}
                    className='blog-type-item'
                    key={type.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: blogTypesParent.find((t: any) => t.name == type)?.color + '20',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: blogTypesParent.find((t: any) => t.name == type)?.color,
                        borderRadius: '50%',
                        display: 'inline-block',
                        width: '17px',
                        height: '17px',
                      }}
                    ></span>
                    <p
                      style={{
                        color: blogTypesParent.find((t: any) => t.name == type)?.color,
                      }}
                    >
                      {type}
                    </p>
                  </div>
                ))}
            </div>
            <h1>{article.title}</h1>
            <div className='articles-infos'>
              <p>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
                  <defs>
                    <clipPath id='clip-path'>
                      <rect
                        id='Rectangle_752'
                        data-name='Rectangle 752'
                        width='18'
                        height='18'
                        transform='translate(0 -0.331)'
                        fill='#fff'
                      />
                    </clipPath>
                  </defs>
                  <g
                    id='Groupe_de_masques_2140'
                    data-name='Groupe de masques 2140'
                    transform='translate(0 0.331)'
                    clip-path='url(#clip-path)'
                  >
                    <g id='Clock_04' data-name='Clock 04' transform='translate(1.178 1.376)'>
                      <path
                        id='Tracé_509'
                        data-name='Tracé 509'
                        d='M9.861,3.892a5.969,5.969,0,1,0,5.969,5.969A5.969,5.969,0,0,0,9.861,3.892ZM2.4,9.861a7.461,7.461,0,1,1,7.461,7.461A7.461,7.461,0,0,1,2.4,9.861Z'
                        transform='translate(-2.4 -2.4)'
                        fill='#fff'
                        fill-rule='evenodd'
                      />
                      <path
                        id='Tracé_510'
                        data-name='Tracé 510'
                        d='M13.038,7.2a.746.746,0,0,1,.746.746v3.73a.746.746,0,0,1-.219.528L12.074,13.7a.746.746,0,0,1-1.055-1.055l1.274-1.274V7.946A.746.746,0,0,1,13.038,7.2Z'
                        transform='translate(-5.577 -4.216)'
                        fill='#fff'
                        fill-rule='evenodd'
                      />
                    </g>
                  </g>
                </svg>
                Publié par TrackT le {dayjs(article.publishedAt).format('DD MMM YYYY')}
              </p>
              <p>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
                  <defs>
                    <clipPath id='clip-path'>
                      <rect
                        id='Rectangle_752'
                        data-name='Rectangle 752'
                        width='18'
                        height='18'
                        transform='translate(0 -0.331)'
                        fill='#fff'
                      />
                    </clipPath>
                  </defs>
                  <g
                    id='Groupe_de_masques_2140'
                    data-name='Groupe de masques 2140'
                    transform='translate(0 0.331)'
                    clip-path='url(#clip-path)'
                  >
                    <g id='Clock_04' data-name='Clock 04' transform='translate(1.178 1.376)'>
                      <path
                        id='Tracé_509'
                        data-name='Tracé 509'
                        d='M9.861,3.892a5.969,5.969,0,1,0,5.969,5.969A5.969,5.969,0,0,0,9.861,3.892ZM2.4,9.861a7.461,7.461,0,1,1,7.461,7.461A7.461,7.461,0,0,1,2.4,9.861Z'
                        transform='translate(-2.4 -2.4)'
                        fill='#fff'
                        fill-rule='evenodd'
                      />
                      <path
                        id='Tracé_510'
                        data-name='Tracé 510'
                        d='M13.038,7.2a.746.746,0,0,1,.746.746v3.73a.746.746,0,0,1-.219.528L12.074,13.7a.746.746,0,0,1-1.055-1.055l1.274-1.274V7.946A.746.746,0,0,1,13.038,7.2Z'
                        transform='translate(-5.577 -4.216)'
                        fill='#fff'
                        fill-rule='evenodd'
                      />
                    </g>
                  </g>
                </svg>
                {article.readtime.value} minutes de lecture
              </p>
              <p>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
                  <defs>
                    <clipPath id='clip-path'>
                      <rect
                        id='Rectangle_750'
                        data-name='Rectangle 750'
                        width='18'
                        height='18'
                        transform='translate(-0.007 -0.331)'
                        fill='#fff'
                      />
                    </clipPath>
                  </defs>
                  <g
                    id='Groupe_de_masques_2138'
                    data-name='Groupe de masques 2138'
                    transform='translate(0.007 0.331)'
                    clip-path='url(#clip-path)'
                  >
                    <g id='Hourglass' transform='translate(3.249 1.607)'>
                      <path
                        id='Tracé_506'
                        data-name='Tracé 506'
                        d='M4.8,4.569A2.169,2.169,0,0,1,6.969,2.4H14.2a2.169,2.169,0,0,1,2.169,2.169v.7a2.169,2.169,0,0,1-.908,1.765L11.828,9.63l3.632,2.594a2.169,2.169,0,0,1,.908,1.765v.7A2.169,2.169,0,0,1,14.2,16.86H6.969A2.169,2.169,0,0,1,4.8,14.691v-.7a2.169,2.169,0,0,1,.908-1.765L9.34,9.63,5.708,7.036A2.169,2.169,0,0,1,4.8,5.271Zm5.784,4.172,4.035-2.882a.723.723,0,0,0,.3-.588v-.7a.723.723,0,0,0-.723-.723H6.969a.723.723,0,0,0-.723.723v.7a.723.723,0,0,0,.3.588Zm0,1.777L6.549,13.4a.723.723,0,0,0-.3.588v.7a.723.723,0,0,0,.723.723H14.2a.723.723,0,0,0,.723-.723v-.7a.723.723,0,0,0-.3-.588Z'
                        transform='translate(-4.8 -2.4)'
                        fill='#fff'
                        fill-rule='evenodd'
                      />
                      <path
                        id='Tracé_507'
                        data-name='Tracé 507'
                        d='M15.384,22.569H9.6v-.306a.723.723,0,0,1,.361-.626l1.807-1.044a1.446,1.446,0,0,1,1.446,0l1.807,1.044a.723.723,0,0,1,.361.626Z'
                        transform='translate(-6.708 -8.765)'
                        fill='#fff'
                      />
                    </g>
                  </g>
                </svg>
                3.4k vues de l'article
              </p>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
        <div className='article-container-products'>
          <div className='right-now'>
            <h2
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              En ce moment sur trackt
              <img
                style={{
                  marginLeft: '10px',
                  width: '25px',
                }}
                src='/icons/heart.gif'
                alt='coin-mario'
              />
            </h2>
            <div className='right-now-container'>
              {rightNowProducts.map((product: any) => (
                <div key={product.id} className='right-now-product'>
                  <Image data={product.images.nodes[0]} loading='lazy' />
                  <p>{product.title?.length > 12 ? `${product.title.slice(0, 12)}...` : product.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='right-now'>
            <h2>Modèles populaires</h2>
            <div className='right-now-container'>
              {trendyProducts.map((product: any) => (
                <div key={product.id} className='right-now-product'>
                  <Image data={product.images.nodes[0]} loading='lazy' />
                  <p>{product.title?.length > 12 ? `${product.title.slice(0, 12)}...` : product.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='divider-article'></div>
      <div className='articles-list'>
        <Articles articles={articles} />
      </div>
    </div>
  )
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
        readtime: metafield(namespace: "custom", key: "readtime") {
          key
          value
        }
        types: metafield(namespace: "custom", key: "types") {
          key
          value
        }
      
      }
    }
  }
` as const

const TOP_PRODUCTS = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "top_ventes") {
    nodes {
      field(key: "product") {
        references(first: 5) {
          nodes {
            ... on Product {
              id
              title
              handle
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
            }
          }
        }
      }
    }
  }
}
`

const RIGHT_NOW = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "right_now") {
    nodes {
      field(key: "product") {
        references(first: 10) {
          nodes {
            ... on Product {
              id
              title
              handle
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
`

const TRENDY = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "trendy") {
    nodes {
      field(key: "product") {
        references(first: 10) {
          nodes {
            ... on Product {
              id
              title
              handle
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
`

const OTHER_ARTICLES = `#graphql
  query MyQuery {
  articles(first: 20) {
    nodes {
      image {
        url
      }
      handle
      title
    }
  }
}
`
