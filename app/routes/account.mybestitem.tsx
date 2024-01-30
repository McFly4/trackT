import { Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'

export const meta: MetaFunction = () => {
    return [{ title: 'My best item' }]
}

export async function loader({ context }: LoaderFunctionArgs) {
    const customerAccessToken = await context.session.get('customerAccessToken')
    if (!customerAccessToken) {
        return redirect('/account/login')
    }

    const { accessToken } = customerAccessToken

    // const wishlist = await context.storefront.mutate(UPDATE, {
    //     variables: {
    //         customerAccessToken: accessToken,
    //         customer: {
    //             firstName: 'AZZZZZ',
    //         },
    //     },
    // })

    return json({})
}

export default function AccountMybestitem() {
    return (
        <>
            <h1>My best items</h1>
            <p>update user </p>
        </>
    )
}

const ADD_TO_WISHLIST_MUTATION = `#graphql
  mutation AddToWishlist($customerId: ID!, $productId: ID!) {
    customerUpdate(input: {
      id: $customerId
      metafields: [{
        key: "products"
        value: $productId
        namespace: "wishlist"
      }]
    }) {
      customer {
        id
      }
    }
  }
`

const REMOVE_FROM_WISHLIST_MUTATION = `#graphql
  mutation RemoveFromWishlist($customerId: ID!, $metafieldId: ID!) {
    customerUpdate(input: {
      id: $customerId
      metafields: [{
        id: $metafieldId
        value: ""
      }]
    }) {
      customer {
        id
      }
    }
  }
`

const GET_WISHLIST_QUERY = `#graphql
  query GetWishlist($customerId: ID!) {
    customer(id: $customerId) {
      id
      metafields(namespace: "wishlist", keys: "products") {
        edges {
          node {
            id
            key
            value
          }
        }
      }
    }
  }
`
