import React, { useState } from 'react'
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { Image, Pagination, getPaginationVariables } from '@shopify/hydrogen'
import type { ArticleItemFragment } from 'storefrontapi.generated'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
dayjs.locale('fr')

// type

type BlogTypes = {
  name: string
  color: string
}

const blogTypes: BlogTypes[] = [
  {
    name: 'voix créatives',
    color: '#6FDD59',
  },
  {
    name: 'Fashion tips',
    color: '#FFF5B2',
  },

  {
    name: 'iconic collabs',
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
    name: 'marques indépendantes',
    color: '#831DD9',
  },
]

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.blog.title ?? ''} blog` }]
}

export const loader = async ({ request, params, context: { storefront } }: LoaderFunctionArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  })

  const { blog } = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
      ...paginationVariables,
    },
  })

  if (!blog?.articles) {
    throw new Response('Not found', { status: 404 })
  }

  return json({ blog })
}

export default function Blog() {
  const { blog } = useLoaderData<typeof loader>()
  const { articles } = blog
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  function parseArticleTypes(value: unknown): string[] {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as string[]
      } catch {
        return []
      }
    }
    return []
  }

  const filteredArticles = articles?.nodes?.filter((article: any) => {
    if (!selectedTypes.length) {
      return true // If no types are selected, show all articles
    }
    const articleTypes = parseArticleTypes(article.types?.value)
    return selectedTypes.some((type: string) => articleTypes.includes(type))
  })

  return (
    <div className='blog'>
      <div className='blog-grid'>
        <Pagination connection={articles}>
          {({ nodes, isLoading, PreviousLink, NextLink }) => {
            return (
              <>
                <PreviousLink>{isLoading ? 'Loading...' : <span>↑ Load previous</span>}</PreviousLink>
                <div className='blog-title'>
                  <h1>X-TRACKT, BLOG ACTUS, MODE ET CONSEIL</h1>
                  <div className='blog-title-txt'>
                    <p>
                      TrackT ne se contente pas de vendre des vêtements. Nous racontons des histoires, inspirons des
                      communautés et connectons des groupes.
                    </p>
                    <p>
                      Notre blog, X-TrackT, est le cœur battant de notre plateforme, où la mode rencontre la culture,
                      l’actualité et les conseils.
                    </p>
                    <p>
                      Nous avons conçu cet espace pour être une source inépuisable d’inspiration, d’information et de
                      soutien pour tous les passionnés de streetwear.
                    </p>
                  </div>
                  <div className='blog-types'>
                    {blogTypes?.map((type) => (
                      <div
                        onClick={() => {
                          if (selectedTypes.includes(type.name)) {
                            setSelectedTypes(selectedTypes.filter((t) => t !== type.name))
                          } else {
                            setSelectedTypes([...selectedTypes, type.name])
                          }
                        }}
                        className='blog-type-item'
                        key={type.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: type.color + '20',
                          outline: selectedTypes.includes(type.name) ? `2px solid ${type.color}` : 'unset',
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: type.color,
                            borderRadius: '50%',
                            display: 'inline-block',
                            width: '17px',
                            height: '17px',
                          }}
                        ></span>
                        <p
                          style={{
                            color: type.color,
                          }}
                        >
                          {type.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {filteredArticles.map((article: any) => {
                  let types = []
                  if (article?.types && article?.types?.value) {
                    try {
                      types = JSON.parse(article?.types?.value) as any
                    } catch (error) {
                      console.error('Error parsing types:', error)
                    }
                  }
                  return (
                    <Link to={`/blogs/news/${article.handle}`}>
                      <div className='blog-grid-item' key={article.id}>
                        <Image
                          alt={article.image.altText || article.title}
                          aspectRatio='3/2'
                          data={article.image}
                          loading='lazy'
                        />
                        <h6>{article.title?.length > 60 ? article.title.slice(0, 55) + '...' : article.title}</h6>
                        <div className='date-type-container'>
                          <p>{dayjs(article.publishedAt).format('DD MMM YYYY')}</p>
                          <div className='types-container'>
                            {types.map((type: any) => {
                              const blogType = blogTypes.find((bt) => bt.name == type)
                              if (blogType) {
                                return (
                                  <span key={type} className='type-badge' style={{ backgroundColor: blogType.color }}>
                                    {' '}
                                  </span>
                                )
                              }
                              return null
                            })}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
                <NextLink>{isLoading ? 'Loading...' : <span>Load more ↓</span>}</NextLink>
              </>
            )
          }}
        </Pagination>
      </div>
    </div>
  )
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
    query Blog(
    $language: LanguageCode
  ) @inContext(language: $language) {
    blog(handle: "news") {
      title
      seo {
        title
        description
      }
      articles(
        first: 250,
        sortKey: PUBLISHED_AT,
        reverse: true
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
    types: metafield(namespace: "custom", key: "types") {
     key
     value
    }
  }
` as const
