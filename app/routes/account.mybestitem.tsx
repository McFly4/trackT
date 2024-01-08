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
    return json({})
}

export default function AccountMybestitem() {
    return (
        <>
            <h1>My best items</h1>
        </>
    )
}
