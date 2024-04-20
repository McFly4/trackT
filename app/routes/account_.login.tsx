import {
    json,
    redirect,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
} from '@shopify/remix-oxygen'
import { Form, Link, useActionData, type MetaFunction } from '@remix-run/react'
import { useState } from 'react'
import useWindowDimensions from '~/hooks/useWindowDimension'

type ActionResponse = {
    error: string | null
}

export const meta: MetaFunction = () => {
    return [{ title: 'Login' }]
}

export async function loader({ context }: LoaderFunctionArgs) {
    if (await context.session.get('customerAccessToken')) {
        return redirect('/account/profile')
    }
    return json({})
}

export async function action({ request, context }: ActionFunctionArgs) {
    const { session, storefront } = context

    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 })
    }

    try {
        const form = await request.formData()
        const email = String(form.has('email') ? form.get('email') : '')
        const password = String(
            form.has('password') ? form.get('password') : ''
        )
        const validInputs = Boolean(email && password)

        if (!validInputs) {
            throw new Error('Please provide both an email and a password.')
        }

        const { customerAccessTokenCreate } = await storefront.mutate(
            LOGIN_MUTATION,
            {
                variables: {
                    input: { email, password },
                },
            }
        )

        if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
            throw new Error(
                customerAccessTokenCreate?.customerUserErrors[0].message
            )
        }

        const { customerAccessToken } = customerAccessTokenCreate
        session.set('customerAccessToken', customerAccessToken)

        return redirect('/account/profile', {
            headers: {
                'Set-Cookie': await session.commit(),
            },
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return json({ error: error.message }, { status: 400 })
        }
        return json({ error }, { status: 400 })
    }
}

export default function Login() {
    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920
    const data = useActionData<ActionResponse>()
    const error = data?.error || null
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className='login'>
            <h1>Accéder à mon espace trackt</h1>
            <Form method='POST' className='login-form'>
                <div className='login-form-field'>
                    <label htmlFor='email'>Adresse e-mail</label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        required
                        placeholder='Email address'
                        aria-label='Email address'
                        autoFocus
                    />
                </div>
                <div className='login-form-field'>
                    <label htmlFor='password'>Mot de passe *</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            id='password'
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            autoComplete='current-password'
                            placeholder='Mot de passe'
                            aria-label='Password'
                            minLength={8}
                            required
                            style={{
                                width: width > 768 ? '93%' : '90%',
                                border: error ? '2px solid red ' : '',
                                outline: error ? 'unset !important' : '',
                            }}
                        />

                        {showPassword ? (
                            <svg
                                id='eye'
                                xmlns='http://www.w3.org/2000/svg'
                                width='28'
                                height='27.451'
                                viewBox='0 0 28 27.451'
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '30px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                }}
                            >
                                <path
                                    id='Tracé_444'
                                    data-name='Tracé 444'
                                    d='M22.794,24.562A14.24,14.24,0,0,1,1.182,15.119,14.211,14.211,0,0,1,5.5,7.27L1.456,3.224l1.83-1.83L28.907,27.015l-1.83,1.83ZM7.334,9.1a11.6,11.6,0,0,0-3.511,6.018,11.651,11.651,0,0,0,17.084,7.555l-2.625-2.625a5.824,5.824,0,0,1-8.031-8.031Zm9.03,9.03-4.195-4.195a3.237,3.237,0,0,0,4.195,4.195Zm10.214,2.93L24.726,19.21a11.562,11.562,0,0,0,1.814-4.091A11.656,11.656,0,0,0,12.014,6.5L9.972,4.456a14.247,14.247,0,0,1,19.21,10.663A14.166,14.166,0,0,1,26.578,21.062ZM14.823,9.307Q15,9.3,15.182,9.3A5.823,5.823,0,0,1,21,15.119q0,.181-.011.359Z'
                                    transform='translate(-1.182 -1.394)'
                                    fill='#fff'
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='28'
                                height='23.293'
                                viewBox='0 0 28 23.293'
                                style={{
                                    position: 'absolute',
                                    right: '30px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                }}
                                onClick={togglePasswordVisibility}
                            >
                                <path
                                    id='Tracé_443'
                                    data-name='Tracé 443'
                                    d='M15.182,3a14.239,14.239,0,0,1,14,11.647,14.238,14.238,0,0,1-28,0A14.239,14.239,0,0,1,15.182,3Zm0,20.705A11.653,11.653,0,0,0,26.54,14.647a11.651,11.651,0,0,0-22.717,0A11.653,11.653,0,0,0,15.182,23.705Zm0-3.235A5.823,5.823,0,1,1,21,14.647,5.823,5.823,0,0,1,15.182,20.47Zm0-2.588a3.235,3.235,0,1,0-3.235-3.235A3.235,3.235,0,0,0,15.182,17.882Z'
                                    transform='translate(-1.182 -3)'
                                    fill='#fff'
                                />
                            </svg>
                        )}
                    </div>
                    {error ? (
                        <p
                            style={{
                                textAlign: 'start',
                                color: 'red',
                                paddingLeft: '10px',
                            }}
                        >
                            {error === 'Unidentified customer'
                                ? 'Email ou mot de passe incorrect'
                                : 'Une erreur est survenue, veuillez réessayer.'}
                        </p>
                    ) : (
                        <br />
                    )}
                    <Link to='/account/recover'>
                        <p>J'ai encore oublié...</p>
                    </Link>
                </div>
                <button type='submit'>Connexion</button>
            </Form>
            <br />
            <Link to='/account/register'>
                <button className='btn-register'>inscription</button>
            </Link>
        </div>
    )
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const
