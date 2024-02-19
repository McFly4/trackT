import {
    json,
    redirect,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
} from '@shopify/remix-oxygen'
import { Form, Link, useActionData } from '@remix-run/react'
import type { CustomerCreateMutation } from 'storefrontapi.generated'

type ActionResponse = {
    error: string | null
    newCustomer:
        | NonNullable<CustomerCreateMutation['customerCreate']>['customer']
        | null
}

export async function loader({ context }: LoaderFunctionArgs) {
    const customerAccessToken = await context.session.get('customerAccessToken')
    if (customerAccessToken) {
        return redirect('/account')
    }

    return json({})
}

export async function action({ request, context }: ActionFunctionArgs) {
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 })
    }

    const { storefront, session } = context
    const form = await request.formData()
    const email = String(form.has('email') ? form.get('email') : '')
    const password = form.has('password') ? String(form.get('password')) : null
    const passwordConfirm = form.has('passwordConfirm')
        ? String(form.get('passwordConfirm'))
        : null
    const birthday = form.has('birthday') ? String(form.get('birthday')) : null
    const firstName = form.has('firstName')
        ? String(form.get('firstName'))
        : null
    const lastName = form.has('lastName') ? String(form.get('lastName')) : null
    const phone = form.has('phone') ? String(form.get('phone')) : null

    const validPasswords =
        password && passwordConfirm && password === passwordConfirm

    const validInputs = Boolean(email && password)
    try {
        if (!validPasswords) {
            throw new Error('Passwords do not match')
        }

        if (!validInputs) {
            throw new Error('Please provide both an email and a password.')
        }

        const { customerCreate } = await storefront.mutate(
            CUSTOMER_CREATE_MUTATION,
            {
                variables: {
                    input: { email, password, firstName, lastName },
                },
            }
        )

        if (customerCreate?.customerUserErrors?.length) {
            throw new Error(customerCreate?.customerUserErrors[0].message)
        }

        const newCustomer = customerCreate?.customer
        if (!newCustomer?.id) {
            throw new Error('Could not create customer')
        }

        // get an access token for the new customer
        const { customerAccessTokenCreate } = await storefront.mutate(
            REGISTER_LOGIN_MUTATION,
            {
                variables: {
                    input: {
                        email,
                        password,
                        firstName,
                        lastName,
                    },
                },
            }
        )

        if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
            throw new Error('Missing access token')
        }
        session.set(
            'customerAccessToken',
            customerAccessTokenCreate?.customerAccessToken
        )

        return json(
            { error: null, newCustomer },
            {
                status: 302,
                headers: {
                    'Set-Cookie': await session.commit(),
                    Location: '/account',
                },
            }
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            return json({ error: error.message }, { status: 400 })
        }
        return json({ error }, { status: 400 })
    }
}

export default function Register() {
    const data = useActionData<ActionResponse>()
    const error = data?.error || null
    return (
        <div className='register login'>
            <h1
                style={{
                    marginTop: '100px',
                }}
            >
                Créer mon compte trackt
            </h1>
            <Form method='POST' className='login-form register2'>
                <div className='register-form'>
                    <div>
                        <div className='login-form-field'>
                            <label htmlFor='email'>Adresse e-mail *</label>
                            <input
                                id='email'
                                name='email'
                                type='email'
                                autoComplete='email'
                                required
                                placeholder='Mail'
                                aria-label='Email address'
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                            />
                        </div>

                        <div className='login-form-field'>
                            <label htmlFor='password'>Mot de passe *</label>
                            <input
                                id='password'
                                name='password'
                                type='password'
                                autoComplete='current-password'
                                placeholder='Mot de passe'
                                aria-label='Password'
                                minLength={8}
                                required
                            />
                        </div>

                        <div className='login-form-field'>
                            <label htmlFor='passwordConfirm'>
                                Confirmation mot de passe
                            </label>
                            <input
                                id='passwordConfirm'
                                name='passwordConfirm'
                                type='password'
                                autoComplete='current-password'
                                placeholder='Confirmer mot de passe'
                                aria-label='Re-enter password'
                                minLength={8}
                                required
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            marginLeft: '50px',
                        }}
                    >
                        <div className='login-form-field'>
                            <label htmlFor='lastName'>Nom *</label>
                            <input
                                id='lastName'
                                name='lastName'
                                type='text'
                                autoComplete='lastName'
                                placeholder='Nom'
                                aria-label='lastName'
                                required
                            />
                        </div>
                        <div className='login-form-field'>
                            <label htmlFor='firstName'>Prénom *</label>
                            <input
                                id='firstName'
                                name='firstName'
                                type='text'
                                autoComplete='firstName'
                                placeholder='Prénom'
                                aria-label='firstName'
                                required
                            />
                        </div>
                    </div>
                </div>

                {error ? (
                    <p>
                        <mark>
                            <small>{error}</small>
                        </mark>
                    </p>
                ) : (
                    <br />
                )}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                    }}
                >
                    <button type='submit'>
                        S'inscrire et vivre l'experience trackt
                    </button>
                </div>
            </Form>
        </div>
    )
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerCreate
const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate(
    $input: CustomerCreateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const REGISTER_LOGIN_MUTATION = `#graphql
  mutation registerLogin(
    $input: CustomerAccessTokenCreateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
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
