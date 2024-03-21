import { type ActionFunctionArgs, json, redirect } from '@shopify/remix-oxygen'
import { Form, useActionData, type MetaFunction } from '@remix-run/react'
import { useState } from 'react'

type ActionResponse = {
    error: string | null
}

export const meta: MetaFunction = () => {
    return [{ title: 'Reset Password' }]
}

export async function action({ request, context, params }: ActionFunctionArgs) {
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 })
    }
    const { id, resetToken } = params
    const { session, storefront } = context

    try {
        if (!id || !resetToken) {
            throw new Error('customer token or id not found')
        }

        const form = await request.formData()
        const password = form.has('password')
            ? String(form.get('password'))
            : ''
        const passwordConfirm = form.has('passwordConfirm')
            ? String(form.get('passwordConfirm'))
            : ''
        const validInputs = Boolean(password && passwordConfirm)
        if (validInputs && password !== passwordConfirm) {
            throw new Error('Please provide matching passwords')
        }

        const { customerReset } = await storefront.mutate(
            CUSTOMER_RESET_MUTATION,
            {
                variables: {
                    id: `gid://shopify/Customer/${id}`,
                    input: { password, resetToken },
                },
            }
        )

        if (customerReset?.customerUserErrors?.length) {
            throw new Error(customerReset?.customerUserErrors[0].message)
        }

        if (!customerReset?.customerAccessToken) {
            throw new Error('Access token not found. Please try again.')
        }
        session.set('customerAccessToken', customerReset.customerAccessToken)

        return redirect('/account', {
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

export default function Reset() {
    const action = useActionData<ActionResponse>()
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2)
    }

    return (
        <div className='account-reset'>
            <h1>Reset Password.</h1>
            <Form method='POST'>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        marginTop: '200px',
                    }}
                >
                    <div className='input-field'>
                        <label htmlFor='password'>Nouveau mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                aria-label='Password'
                                autoComplete='current-password'
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                id='password'
                                minLength={8}
                                name='password'
                                placeholder='Password'
                                required
                                type={showPassword ? 'text' : 'password'}
                                style={{
                                    width: '93%',
                                }}
                            />
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
                        </div>
                    </div>
                    <div className='input-field'>
                        <label htmlFor='passwordConfirm'>
                            Répéter le mot de passe
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                aria-label='Re-enter password'
                                autoComplete='current-password'
                                id='passwordConfirm'
                                minLength={8}
                                name='passwordConfirm'
                                placeholder='Re-enter password'
                                required
                                type={showPassword2 ? 'text' : 'password'}
                                style={{
                                    width: '93%',
                                }}
                            />
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
                                onClick={togglePasswordVisibility2}
                            >
                                <path
                                    id='Tracé_443'
                                    data-name='Tracé 443'
                                    d='M15.182,3a14.239,14.239,0,0,1,14,11.647,14.238,14.238,0,0,1-28,0A14.239,14.239,0,0,1,15.182,3Zm0,20.705A11.653,11.653,0,0,0,26.54,14.647a11.651,11.651,0,0,0-22.717,0A11.653,11.653,0,0,0,15.182,23.705Zm0-3.235A5.823,5.823,0,1,1,21,14.647,5.823,5.823,0,0,1,15.182,20.47Zm0-2.588a3.235,3.235,0,1,0-3.235-3.235A3.235,3.235,0,0,0,15.182,17.882Z'
                                    transform='translate(-1.182 -3)'
                                    fill='#fff'
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                {action?.error ? (
                    <p>
                        <mark>
                            <small>{action.error}</small>
                        </mark>
                    </p>
                ) : (
                    <br />
                )}
                <div className='btn-fields'>
                    <button type='submit'>
                        Mettre à jour mon mot de passe
                    </button>
                    <a href='/account/login'>Back to login →</a>
                </div>
            </Form>
            <br />
        </div>
    )
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerreset
const CUSTOMER_RESET_MUTATION = `#graphql
  mutation customerReset(
    $id: ID!,
    $input: CustomerResetInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerReset(id: $id, input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const
