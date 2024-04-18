import {
    json,
    redirect,
    type LoaderFunctionArgs,
    type ActionFunctionArgs,
} from '@shopify/remix-oxygen'
import { Form, Link, useActionData } from '@remix-run/react'
import React, { useState } from 'react'
import useWindowDimensions from '~/hooks/useWindowDimension'

type ActionResponse = {
    error?: string
    resetRequested?: boolean
}

export async function loader({ context }: LoaderFunctionArgs) {
    const customerAccessToken = await context.session.get('customerAccessToken')
    if (customerAccessToken) {
        return redirect('/account')
    }

    return json({})
}

export async function action({ request, context }: ActionFunctionArgs) {
    const { storefront } = context
    const form = await request.formData()
    const email = form.has('email') ? String(form.get('email')) : null

    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 })
    }

    try {
        if (!email) {
            throw new Error('Please provide an email.')
        }
        await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
            variables: { email },
        })

        return json({ resetRequested: true })
    } catch (error: unknown) {
        const resetRequested = false
        if (error instanceof Error) {
            return json(
                { error: error.message, resetRequested },
                { status: 400 }
            )
        }
        return json({ error, resetRequested }, { status: 400 })
    }
}

export default function Recover() {
    const action = useActionData<ActionResponse>()
    const [mail, setMail] = useState('')
    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920

    return (
        <div>
            {action?.resetRequested ? (
                <div className='account-recover-success login-form-field'>
                    <h1>Votre nouveau mot de passe se trouve ici</h1>
                    <input
                        aria-label='Email address'
                        autoComplete='email'
                        autoFocus
                        id='email'
                        name='email'
                        placeholder='Email address'
                        required
                        type='email'
                        value={mail}
                        disabled
                    />
                    <br />
                    <Link to='/'>
                        <button>Retourner sur trackt</button>
                    </Link>
                </div>
            ) : (
                <div className='account-recover'>
                    {width < 768 && <h2>Mot de passe oublié</h2>}
                    <br />
                    <Form method='POST' className='login-form'>
                        <div
                            className='login-form-field'
                            style={{
                                marginLeft: width > 768 ? '200px' : 'unset',
                                marginTop: width > 768 ? '20vh' : 'unset',
                            }}
                        >
                            <label htmlFor='email'>Adresse e-mail</label>
                            <input
                                aria-label='Email address'
                                autoComplete='email'
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                id='email'
                                name='email'
                                placeholder='Email address'
                                required
                                type='email'
                                onChange={(e) => setMail(e.target.value)}
                            />
                            {action?.error ? (
                                <p>
                                    <mark>
                                        <small>{action.error}</small>
                                    </mark>
                                </p>
                            ) : (
                                <br />
                            )}
                            <button
                                type='submit'
                                style={
                                    width > 768
                                        ? {
                                              marginTop: '50px',
                                              marginLeft: '10px',
                                              width: '400px',
                                          }
                                        : {
                                              fontSize: '18px',
                                          }
                                }
                            >
                                Changer de mot de passe
                            </button>
                        </div>
                    </Form>
                </div>
            )}
        </div>
    )
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerrecover
const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover(
    $email: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const
