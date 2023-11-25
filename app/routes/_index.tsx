import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';

export async function loader({context}: any) {
  const data = await context.graphql(ALL_PRODUCTS_QUERY);
  return json(data);
}

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts{
    products(first: 10) {
      nodes { 
        id
        name
        slug
        description
      }
    }
  }
`;
