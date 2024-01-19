import { useState, useEffect, useMemo } from 'react'
import type { CustomerFragment } from 'storefrontapi.generated'
import type { CustomerUpdateInput } from '@shopify/hydrogen/storefront-api-types'
import {
    json,
    redirect,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
} from '@shopify/remix-oxygen'
import {
    Form,
    useActionData,
    useNavigation,
    useOutletContext,
    type MetaFunction,
    Link,
} from '@remix-run/react'
import Adresses from './account.addresses'
import { Swiper, SwiperSlide } from 'swiper/react'
import React from 'react'

export type ActionResponse = {
    error: string | null
    customer: CustomerFragment | null
}

export const meta: MetaFunction = () => {
    return [{ title: 'Profile' }]
}

export async function loader({ context }: LoaderFunctionArgs) {
    const customerAccessToken = await context.session.get('customerAccessToken')
    if (!customerAccessToken) {
        return redirect('/account/login')
    }
    return json({})
}

export async function action({ request, context }: ActionFunctionArgs) {
    const { session, storefront } = context

    if (request.method !== 'PUT') {
        return json({ error: 'Method not allowed' }, { status: 405 })
    }

    const form = await request.formData()
    const customerAccessToken = await session.get('customerAccessToken')
    if (!customerAccessToken) {
        return json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const password = getPassword(form)
        const customer: CustomerUpdateInput = {}
        const validInputKeys = [
            'firstName',
            'lastName',
            'email',
            'password',
            'phone',
        ] as const
        for (const [key, value] of form.entries()) {
            if (!validInputKeys.includes(key as any)) {
                continue
            }
            if (key === 'acceptsMarketing') {
                customer.acceptsMarketing = value === 'on'
            }
            if (typeof value === 'string' && value.length) {
                customer[key as (typeof validInputKeys)[number]] = value
            }
        }

        if (password) {
            customer.password = password
        }

        // update customer and possibly password
        const updated = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
            variables: {
                customerAccessToken: customerAccessToken.accessToken,
                customer,
            },
        })

        // check for mutation errors
        if (updated.customerUpdate?.customerUserErrors?.length) {
            return json(
                { error: updated.customerUpdate?.customerUserErrors[0] },
                { status: 400 }
            )
        }

        // update session with the updated access token
        if (updated.customerUpdate?.customerAccessToken?.accessToken) {
            session.set(
                'customerAccessToken',
                updated.customerUpdate?.customerAccessToken
            )
        }

        return json(
            { error: null, customer: updated.customerUpdate?.customer },
            {
                headers: {
                    'Set-Cookie': await session.commit(),
                },
            }
        )
    } catch (error: any) {
        return json({ error: error.message, customer: null }, { status: 400 })
    }
}

export default function AccountProfile() {
    const account = useOutletContext<{ customer: CustomerFragment }>()
    const { state } = useNavigation()
    const action = useActionData<ActionResponse>()
    const customer = action?.customer ?? account?.customer
    const shoesSize = [
        { index: 0, size: '36' },
        { index: 1, size: '37' },
        { index: 2, size: '38' },
        { index: 3, size: '39' },
        { index: 4, size: '40' },
        { index: 5, size: '41' },
        { index: 6, size: '42' },
        { index: 7, size: '43' },
        { index: 8, size: '44' },
    ]
    const clothesSize = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    const [selectedShoeSize, setSelectedShoeSize] = useState('')
    const [selectedClothesSize, setSelectedClothesSize] = useState('')

    useEffect(() => {
        const storedShoeSize = localStorage.getItem('selectedShoeSize')
        const storedClothesSize = localStorage.getItem('selectedClothesSize')

        if (storedShoeSize) {
            setSelectedShoeSize(storedShoeSize)
        }

        if (storedClothesSize) {
            setSelectedClothesSize(storedClothesSize)
        }
    }, [])

    const handleShoeSizeChange = (newSize: any) => {
        setSelectedShoeSize(newSize)
        localStorage.setItem('selectedShoeSize', newSize)
    }

    const handleClothesSizeChange = (newSize: any) => {
        setSelectedClothesSize(newSize)
        localStorage.setItem('selectedClothesSize', newSize)
    }

    const selectedShoeIndex = useMemo(() => {
        if (selectedShoeSize === '') {
            // Si la valeur n'est pas encore chargée, retourne une valeur par défaut
            return 0 // ou -1 ou tout autre index par défaut que vous préférez
        }

        return shoesSize.findIndex((value) => value.size === selectedShoeSize)
    }, [selectedShoeSize])

    return (
        <>
            <div className='account-profile'>
                <h2>Informations personnelles</h2>

                <br />
                <br />
                <Form method='PUT'>
                    <div className='register-form'>
                        <div>
                            <div className='login-form-field'>
                                <div className='login-form-field'>
                                    <label htmlFor='lastName'>Nom</label>
                                    <input
                                        id='lastName'
                                        name='lastName'
                                        type='text'
                                        autoComplete='family-name'
                                        placeholder='Nom'
                                        aria-label='Last name'
                                        defaultValue={customer.lastName ?? ''}
                                        minLength={2}
                                    />
                                </div>
                                <label htmlFor='email'>Adresse Email</label>
                                <input
                                    id='email'
                                    name='email'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    placeholder='Email'
                                    aria-label='Email address'
                                    defaultValue={customer.email ?? ''}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                marginLeft: '50px',
                            }}
                        >
                            <div className='login-form-field'>
                                <label htmlFor='firstName'>Prénom</label>
                                <input
                                    id='firstName'
                                    name='firstName'
                                    type='text'
                                    autoComplete='given-name'
                                    placeholder='Prénom'
                                    aria-label='First name'
                                    defaultValue={customer.firstName ?? ''}
                                    minLength={2}
                                />
                            </div>
                            <div className='login-form-field'>
                                <label htmlFor='phone'>
                                    Numéro de téléphone
                                </label>
                                <input
                                    id='phone'
                                    name='phone'
                                    type='tel'
                                    autoComplete='tel'
                                    placeholder='Numéro'
                                    aria-label='Mobile'
                                    defaultValue={customer.phone ?? ''}
                                />
                            </div>
                        </div>
                    </div>
                    {/*<div className='account-profile-marketing'>*/}
                    {/*    <input*/}
                    {/*        id='acceptsMarketing'*/}
                    {/*        name='acceptsMarketing'*/}
                    {/*        type='checkbox'*/}
                    {/*        placeholder='Accept marketing'*/}
                    {/*        aria-label='Accept marketing'*/}
                    {/*        defaultChecked={customer.acceptsMarketing}*/}
                    {/*    />*/}
                    {/*    <label htmlFor='acceptsMarketing'>*/}
                    {/*        &nbsp; Subscribed to marketing communications*/}
                    {/*    </label>*/}
                    {/*</div>*/}
                    <br />
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <div className='login-form-field'>
                            <label htmlFor='currentPassword'>
                                Ancient mot de passe
                            </label>
                            <input
                                id='currentPassword'
                                name='currentPassword'
                                type='password'
                                autoComplete='current-password'
                                placeholder='Current password'
                                aria-label='Current password'
                                minLength={8}
                            />
                        </div>
                        <div
                            className='login-form-field'
                            style={{
                                marginLeft: '50px',
                            }}
                        >
                            <label htmlFor='newPassword'>
                                Nouveau mot de passe
                            </label>
                            <input
                                id='newPassword'
                                name='newPassword'
                                type='password'
                                placeholder='New password'
                                aria-label='New password'
                                minLength={8}
                            />
                        </div>
                    </div>
                    {/*<label htmlFor='newPasswordConfirm'>*/}
                    {/*    New password (confirm)*/}
                    {/*</label>*/}
                    {/*<input*/}
                    {/*    id='newPasswordConfirm'*/}
                    {/*    name='newPasswordConfirm'*/}
                    {/*    type='password'*/}
                    {/*    placeholder='New password (confirm)'*/}
                    {/*    aria-label='New password confirm'*/}
                    {/*    minLength={8}*/}
                    {/*/>*/}
                    {action?.error ? (
                        <p>
                            <mark>
                                <small>{action.error}</small>
                            </mark>
                        </p>
                    ) : (
                        <br />
                    )}
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <button
                            type='submit'
                            disabled={state !== 'idle'}
                            className='btn-update'
                        >
                            {state !== 'idle'
                                ? 'Validation...'
                                : 'Valider les informations'}
                        </button>
                    </div>
                </Form>
            </div>
            <Adresses />
            <div className='trackT-size'>
                <h2>Ajuster TrackT à votre taille</h2>
                <p>
                    Nous vous encourageons à sélectionner vos tailles favorites
                    pour les textiles et les sneakers dans votre profil. Cette
                    configuration pré-choisira automatiquement <br />
                    votre taille sur tous nos articles, rendant chaque achat
                    rapide et fluide
                </p>
                <div className='trackT-size-container'>
                    <div className='trackT-size-container-item'>
                        <h2>sneakers</h2>
                        <Swiper
                            slidesPerView={5}
                            grabCursor={true}
                            centeredSlides={true}
                            onSlideChange={(swiper) =>
                                handleShoeSizeChange(
                                    shoesSize[swiper.activeIndex]?.size
                                )
                            }
                            initialSlide={selectedShoeIndex}
                        >
                            {shoesSize.map((value: any) => (
                                <SwiperSlide key={value.index}>
                                    {({ isActive, isPrev, isNext }) => (
                                        <p
                                            style={{
                                                transition: 'all 0.3s ease',
                                                fontSize: isActive
                                                    ? '40px'
                                                    : isPrev || isNext
                                                    ? '24px'
                                                    : '15px',
                                            }}
                                        >
                                            {value.size}
                                        </p>
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div
                        className='trackT-size-container-item'
                        style={{
                            marginLeft: '100px',
                        }}
                    >
                        <h2>Vêtements</h2>
                        <Swiper
                            slidesPerView={5}
                            grabCursor={true}
                            centeredSlides={true}
                        >
                            {clothesSize.map((value: any) => (
                                <SwiperSlide key={value}>
                                    {({ isActive, isPrev, isNext }) => (
                                        <p
                                            style={{
                                                transition: 'all 0.3s ease',
                                                fontSize: isActive
                                                    ? '40px'
                                                    : isPrev || isNext
                                                    ? '24px'
                                                    : '15px',
                                            }}
                                        >
                                            {value}
                                        </p>
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
            <div className='foryou'></div>
        </>
    )
}

function getPassword(form: FormData): string | undefined {
    let password
    const currentPassword = form.get('currentPassword')
    const newPassword = form.get('newPassword')

    let passwordError
    if (newPassword && !currentPassword) {
        passwordError = new Error('Current password is required.')
    }

    if (newPassword && currentPassword && newPassword === currentPassword) {
        passwordError = new Error(
            'New password must be different than current password.'
        )
    }

    if (passwordError) {
        throw passwordError
    }

    if (currentPassword && newPassword) {
        password = newPassword
    } else {
        password = currentPassword
    }

    return String(password)
}

const CUSTOMER_UPDATE_MUTATION = `#graphql
  # https://shopify.dev/docs/api/storefront/latest/mutations/customerUpdate
  mutation customerUpdate(
    $customerAccessToken: String!,
    $customer: CustomerUpdateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        acceptsMarketing
        email
        firstName
        id
        lastName
        phone
      }
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
