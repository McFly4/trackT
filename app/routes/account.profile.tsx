import { useState, useEffect, useMemo } from 'react'
import type { CustomerFragment } from 'storefrontapi.generated'
import type { CustomerUpdateInput } from '@shopify/hydrogen/storefront-api-types'
import {
    json,
    defer,
    redirect,
    type ActionFunctionArgs,
    LoaderFunctionArgs,
} from '@shopify/remix-oxygen'
import {
    Form,
    useActionData,
    useNavigation,
    useOutletContext,
    type MetaFunction,
    Link,
    useLoaderData,
    useBeforeUnload,
} from '@remix-run/react'
import Adresses from './account.addresses'
import { Swiper, SwiperSlide } from 'swiper/react'
import React from 'react'
import cliSpinners from 'cli-spinners'
import TrackT from '~/components/Common/TrackT'

export type ActionResponse = {
    error: string | null
    customer: CustomerFragment | null
}

export const meta: MetaFunction = () => {
    return [{ title: 'Profile' }]
}

export async function loader({ context, params }: LoaderFunctionArgs) {
    const customerAccessToken = await context.session.get('customerAccessToken')
    if (!customerAccessToken) {
        return redirect('/account/login')
    }

    // const getProductViewed =
    //     typeof window !== 'undefined' && localStorage.getItem('productList')
    //         ? localStorage.getItem('productList')
    //         : []
    //
    // const test = await context.storefront.query(GET_PRODUCTS_VIEWED)

    const products = await context.storefront.query(TRACKT)

    return defer({ products })
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
    const { state } = useNavigation()
    const action = useActionData<ActionResponse>()
    const { products } = useLoaderData<typeof loader>()
    const account = useOutletContext<{ customer: CustomerFragment }>()
    const customer = action?.customer ?? account?.customer
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [selectedShoeSize, setSelectedShoeSize] = useState('')
    const [selectedClothesSize, setSelectedClothesSize] = useState('')
    const productsList =
        products?.metaobjects?.nodes[0]?.field?.references?.nodes

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
        { index: 9, size: '45' },
        { index: 10, size: '46' },
        { index: 11, size: '47' },
    ]
    const clothesSize = [
        { index: 1, size: 'S' },
        { index: 2, size: 'M' },
        { index: 3, size: 'L' },
        { index: 4, size: 'XL' },
    ]

    const selectedShoeIndex = shoesSize.findIndex(
        (item) => item.size === selectedShoeSize
    )
    const selectedClotheIndex = clothesSize.findIndex(
        (item) => item.size === selectedClothesSize
    )

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2)
    }

    const handleShoeSizeChange = (newSize: any) => {
        setSelectedShoeSize(newSize)
        localStorage.setItem('selectedShoeSize', newSize)
    }

    const handleClothesSizeChange = (newSize: any) => {
        setSelectedClothesSize(newSize)
        localStorage.setItem('selectedClothesSize', newSize)
    }

    useEffect(() => {
        const storedShoeSize = localStorage.getItem('selectedShoeSize')
        const storedClothesSize = localStorage.getItem('selectedClothesSize')

        if (storedShoeSize) {
            setSelectedShoeSize(storedShoeSize)
        } else {
            setSelectedShoeSize('36')
        }

        if (storedClothesSize) {
            setSelectedClothesSize(storedClothesSize)
        } else {
            setSelectedClothesSize('XS')
        }
    }, [])

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
                                    disabled
                                    style={{
                                        opacity: '0.5',
                                    }}
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
                                    aria-label='Mobile'
                                    defaultValue={customer.phone ?? ''}
                                    placeholder='+33 6 00 00 00 00'
                                    pattern='^\+?[1-9]\d{3,14}$'
                                />
                            </div>
                        </div>
                    </div>

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
                            <div style={{ position: 'relative' }}>
                                <input
                                    id='currentPassword'
                                    name='currentPassword'
                                    type={showPassword ? 'text' : 'password'}
                                    style={{
                                        width: '93%',
                                    }}
                                    autoComplete='current-password'
                                    placeholder='Current password'
                                    aria-label='Current password'
                                    minLength={8}
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
                            <div style={{ position: 'relative' }}>
                                <input
                                    id='newPassword'
                                    name='newPassword'
                                    placeholder='New password'
                                    aria-label='New password'
                                    minLength={8}
                                    type={showPassword2 ? 'text' : 'password'}
                                    style={{
                                        width: '93%',
                                    }}
                                />
                                {showPassword2 ? (
                                    <svg
                                        id='eye'
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='28'
                                        height='27.451'
                                        viewBox='0 0 28 27.451'
                                        onClick={togglePasswordVisibility2}
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
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className='account-profile-marketing'
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                        }}
                    >
                        <input
                            id='acceptsMarketing'
                            name='acceptsMarketing'
                            type='checkbox'
                            placeholder='Accept marketing'
                            aria-label='Accept marketing'
                            defaultChecked={customer.acceptsMarketing}
                            style={{
                                borderRadius: 'unset !important',
                                paddingLeft: 'unset !important',
                                width: '25px',
                            }}
                        />
                        <div
                            style={{
                                marginLeft: '15px',
                            }}
                        >
                            <h5>Newsletter trackt</h5>
                            <p>
                                Soyez au cœur de l’action ! Inscrivez-vous pour
                                des mises à jour exclusives, des tendances
                                streetwear inédites <br />
                                et des offres spéciales, directement dans votre
                                boîte mail. Juste la crème de Trackt, sans spam
                            </p>
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
                        {selectedShoeSize !== '' && (
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
                        )}
                    </div>
                    <div
                        className='trackT-size-container-item'
                        style={{
                            marginLeft: '100px',
                        }}
                    >
                        <h2>Vêtements</h2>
                        {selectedClothesSize !== '' && (
                            <Swiper
                                slidesPerView={5}
                                grabCursor={true}
                                centeredSlides={true}
                                onSlideChange={(swiper) =>
                                    handleClothesSizeChange(
                                        clothesSize[swiper.activeIndex]?.size
                                    )
                                }
                                initialSlide={selectedClotheIndex}
                            >
                                {clothesSize.map((value: any) => (
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
                        )}
                    </div>
                </div>
            </div>
            <TrackT products={productsList} />
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

// const productListString =
//     typeof window !== 'undefined' ? localStorage.getItem('productList') : null
// const getProductViewed = productListString ? JSON.parse(productListString) : []
//
// const GET_PRODUCTS_VIEWED = `#graphql
// query Products {
//   nodes(
//     ids: [
//     "gid://shopify/Product/7485655253172",
//     "gid://shopify/Product/7495728562356",
//     "gid://shopify/Product/7494155796660",
//     "gid://shopify/Product/7486018027700",
//     "gid://shopify/Product/7486804197556"
//   ]
//   ) {
//     ... on Product {
//       id
//       title
//     }
//   }
// }
// ` as const

const TRACKT = `#graphql
query MetaObjects {
  metaobjects(first: 20, type: "home") {
    nodes {
      field(key: "products") {
        references(first: 20) {
          nodes {
            ... on Product {
              title
              productType
              handle
              vendor
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
              manwoman: metafield(namespace: "custom", key: "manwoman") {
                key
                value
              }
                        soon: metafield(namespace: "custom", key: "soon") {
            key
            value
          }
                    box_sizing: metafield(namespace: "custom", key: "box_sizing") {
            key
            value
          }
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
` as const
