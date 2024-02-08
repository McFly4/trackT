import React, { useState } from 'react'
import type { MailingAddressInput } from '@shopify/hydrogen/storefront-api-types'
import type { AddressFragment, CustomerFragment } from 'storefrontapi.generated'
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
    useNavigate,
} from '@remix-run/react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

export type ActionResponse = {
    addressId?: string | null
    createdAddress?: AddressFragment
    defaultAddress?: string | null
    deletedAddress?: string | null
    error: Record<AddressFragment['id'], string> | null
    updatedAddress?: AddressFragment
}

export const meta: MetaFunction = () => {
    return [{ title: 'Addresses' }]
}

export async function loader({ context }: LoaderFunctionArgs) {
    const { session } = context
    const customerAccessToken = await session.get('customerAccessToken')
    if (!customerAccessToken) {
        return redirect('/account/login')
    }
    return json({})
}

export async function action({ request, context }: ActionFunctionArgs) {
    const { storefront, session } = context

    try {
        const form = await request.formData()

        const addressId = form.has('addressId')
            ? String(form.get('addressId'))
            : null
        if (!addressId) {
            throw new Error('You must provide an address id.')
        }

        const customerAccessToken = await session.get('customerAccessToken')
        if (!customerAccessToken) {
            return json(
                { error: { [addressId]: 'Unauthorized' } },
                { status: 401 }
            )
        }
        const { accessToken } = customerAccessToken

        const defaultAddress = form.has('defaultAddress')
            ? String(form.get('defaultAddress')) === 'on'
            : null
        const address: MailingAddressInput = {}
        const keys: (keyof MailingAddressInput)[] = [
            'address1',
            'address2',
            'city',
            'company',
            'country',
            'firstName',
            'lastName',
            'phone',
            'province',
            'zip',
        ]

        for (const key of keys) {
            const value = form.get(key)
            if (typeof value === 'string') {
                address[key] = value
            }
        }

        switch (request.method) {
            case 'POST': {
                // handle new address creation
                try {
                    const { customerAddressCreate } = await storefront.mutate(
                        CREATE_ADDRESS_MUTATION,
                        {
                            variables: {
                                customerAccessToken: accessToken,
                                address,
                            },
                        }
                    )

                    if (customerAddressCreate?.customerUserErrors?.length) {
                        const error =
                            customerAddressCreate.customerUserErrors[0]
                        throw new Error(error.message)
                    }

                    const createdAddress =
                        customerAddressCreate?.customerAddress
                    if (!createdAddress?.id) {
                        throw new Error(
                            'Expected customer address to be created, but the id is missing'
                        )
                    }

                    if (defaultAddress) {
                        const createdAddressId = decodeURIComponent(
                            createdAddress.id
                        )
                        const { customerDefaultAddressUpdate } =
                            await storefront.mutate(
                                UPDATE_DEFAULT_ADDRESS_MUTATION,
                                {
                                    variables: {
                                        customerAccessToken: accessToken,
                                        addressId: createdAddressId,
                                    },
                                }
                            )

                        if (
                            customerDefaultAddressUpdate?.customerUserErrors
                                ?.length
                        ) {
                            const error =
                                customerDefaultAddressUpdate
                                    .customerUserErrors[0]
                            throw new Error(error.message)
                        }
                    }

                    return json({ error: null, createdAddress, defaultAddress })
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return json(
                            { error: { [addressId]: error.message } },
                            { status: 400 }
                        )
                    }
                    return json(
                        { error: { [addressId]: error } },
                        { status: 400 }
                    )
                }
            }

            case 'PUT': {
                // handle address updates
                try {
                    const { customerAddressUpdate } = await storefront.mutate(
                        UPDATE_ADDRESS_MUTATION,
                        {
                            variables: {
                                address,
                                customerAccessToken: accessToken,
                                id: decodeURIComponent(addressId),
                            },
                        }
                    )

                    const updatedAddress =
                        customerAddressUpdate?.customerAddress

                    if (customerAddressUpdate?.customerUserErrors?.length) {
                        const error =
                            customerAddressUpdate.customerUserErrors[0]
                        throw new Error(error.message)
                    }

                    if (defaultAddress) {
                        const { customerDefaultAddressUpdate } =
                            await storefront.mutate(
                                UPDATE_DEFAULT_ADDRESS_MUTATION,
                                {
                                    variables: {
                                        customerAccessToken: accessToken,
                                        addressId:
                                            decodeURIComponent(addressId),
                                    },
                                }
                            )

                        if (
                            customerDefaultAddressUpdate?.customerUserErrors
                                ?.length
                        ) {
                            const error =
                                customerDefaultAddressUpdate
                                    .customerUserErrors[0]
                            throw new Error(error.message)
                        }
                    }

                    return json({ error: null, updatedAddress, defaultAddress })
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return json(
                            { error: { [addressId]: error.message } },
                            { status: 400 }
                        )
                    }
                    return json(
                        { error: { [addressId]: error } },
                        { status: 400 }
                    )
                }
            }

            case 'DELETE': {
                // handles address deletion
                try {
                    const { customerAddressDelete } = await storefront.mutate(
                        DELETE_ADDRESS_MUTATION,
                        {
                            variables: {
                                customerAccessToken: accessToken,
                                id: addressId,
                            },
                        }
                    )

                    if (customerAddressDelete?.customerUserErrors?.length) {
                        const error =
                            customerAddressDelete.customerUserErrors[0]
                        throw new Error(error.message)
                    }
                    return json({ error: null, deletedAddress: addressId })
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return json(
                            { error: { [addressId]: error.message } },
                            { status: 400 }
                        )
                    }
                    return json(
                        { error: { [addressId]: error } },
                        { status: 400 }
                    )
                }
            }

            default: {
                return json(
                    { error: { [addressId]: 'Method not allowed' } },
                    { status: 405 }
                )
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return json({ error: error.message }, { status: 400 })
        }
        return json({ error }, { status: 400 })
    }
}

export default function Addresses() {
    const { customer } = useOutletContext<{ customer: CustomerFragment }>()
    const { defaultAddress, addresses } = customer

    return (
        <div className='account-addresses'>
            <h2>Gestion des adresses</h2>
            <p
                style={{
                    marginTop: '16px',
                }}
            >
                Ajoutez, modifiez ou supprimez vos adresses pour des achats
                rapides et précis. <br /> Définissez votre adresse préférée pour
                une expérience d’achat encore plus fluide chez Trackt.
            </p>
            <br />
            {!addresses.nodes.length ? (
                <div>
                    <p>Vous n&apos;avez pas d'adresses enregister</p>
                </div>
            ) : (
                <ExistingAddresses
                    addresses={addresses}
                    defaultAddress={defaultAddress}
                />
            )}
            <NewAddressForm />
        </div>
    )
}

function NewAddressForm() {
    const newAddress = {
        address1: '',
        address2: '',
        city: '',
        company: '',
        country: '',
        firstName: '',
        id: 'new',
        lastName: '',
        phone: '',
        province: '',
        zip: '',
    } as AddressFragment

    const [isOpen, setIsOpen] = useState(false)

    function toggleModal() {
        setIsOpen((isOpen) => !isOpen)
    }

    return (
        <div className='new-address'>
            <div className='new-address-title' onClick={toggleModal}>
                Ajouter une nouvelle adresse
            </div>
            {isOpen && (
                <div className='modal-stickers-overlay'>
                    <div className='modal-stickers'>
                        <div
                            className='modal-stickers-close'
                            onClick={toggleModal}
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                viewBox='0 0 16 16'
                            >
                                <path
                                    id='Tracé_243'
                                    data-name='Tracé 243'
                                    d='M16841.295-8037.292l-6.295-6.294-6.295,6.294a.988.988,0,0,1-.705.292.988.988,0,0,1-.705-.292,1,1,0,0,1,0-1.417l6.291-6.292-6.291-6.292a1,1,0,0,1,0-1.416,1,1,0,0,1,1.41,0l6.295,6.294,6.295-6.294a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.416l-6.291,6.292,6.291,6.292a1,1,0,0,1,0,1.417.988.988,0,0,1-.705.292A.988.988,0,0,1,16841.295-8037.292Z'
                                    transform='translate(-16827 8053)'
                                    fill='#fff'
                                />
                            </svg>
                        </div>
                        <div className='popup-content'>
                            <h3>Créer une nouvelle adresse de livraison</h3>
                            <AddressForm
                                address={newAddress}
                                defaultAddress={null}
                            >
                                {({ stateForMethod }) => (
                                    <div className='form-address-btn'>
                                        <button
                                            disabled={
                                                stateForMethod('POST') !==
                                                'idle'
                                            }
                                            formMethod='POST'
                                            type='submit'
                                        >
                                            {stateForMethod('POST') !== 'idle'
                                                ? 'Ajout ...'
                                                : 'Ajouter'}
                                        </button>
                                        <button
                                            onClick={toggleModal}
                                            disabled={
                                                stateForMethod('POST') !==
                                                'idle'
                                            }
                                            type='button'
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                )}
                            </AddressForm>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ExistingAddresses({
    addresses,
    defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
    const [isOpen, setIsOpen] = useState(false)

    function toggleModal() {
        setIsOpen((isOpen) => !isOpen)
    }

    return (
        <div className='addresses'>
            {addresses.nodes.map((address) => (
                <div
                    style={{
                        width: '45%',
                    }}
                >
                    <p
                        style={{
                            color: '#FEE233',
                            cursor: 'pointer',
                            textAlign: 'end',
                            fontSize: '16px',
                        }}
                        onClick={toggleModal}
                    >
                        Modifier l'adresse
                    </p>
                    <div key={address.id} className='addresses-list'>
                        <p>
                            {address.firstName} {address.lastName}
                        </p>
                        <p>{address.address1}</p>
                        <p>
                            {address.city}, {address.zip}
                        </p>
                    </div>
                    {isOpen && (
                        <div className='modal-stickers-overlay'>
                            <div className='modal-stickers'>
                                <div
                                    className='modal-stickers-close'
                                    onClick={toggleModal}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='16'
                                        height='16'
                                        viewBox='0 0 16 16'
                                    >
                                        <path
                                            id='Tracé_243'
                                            data-name='Tracé 243'
                                            d='M16841.295-8037.292l-6.295-6.294-6.295,6.294a.988.988,0,0,1-.705.292.988.988,0,0,1-.705-.292,1,1,0,0,1,0-1.417l6.291-6.292-6.291-6.292a1,1,0,0,1,0-1.416,1,1,0,0,1,1.41,0l6.295,6.294,6.295-6.294a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.416l-6.291,6.292,6.291,6.292a1,1,0,0,1,0,1.417.988.988,0,0,1-.705.292A.988.988,0,0,1,16841.295-8037.292Z'
                                            transform='translate(-16827 8053)'
                                            fill='#fff'
                                        />
                                    </svg>
                                </div>
                                <div className='popup-content'>
                                    <AddressForm
                                        key={address.id}
                                        address={address}
                                        defaultAddress={defaultAddress}
                                    >
                                        {({ stateForMethod }) => (
                                            <div className='form-address-btn'>
                                                <button
                                                    disabled={
                                                        stateForMethod(
                                                            'PUT'
                                                        ) !== 'idle'
                                                    }
                                                    formMethod='PUT'
                                                    type='submit'
                                                >
                                                    {stateForMethod('PUT') !==
                                                    'idle'
                                                        ? 'Saving'
                                                        : 'Save'}
                                                </button>
                                                <button
                                                    onClick={toggleModal}
                                                    disabled={
                                                        stateForMethod(
                                                            'DELETE'
                                                        ) !== 'idle'
                                                    }
                                                    formMethod='DELETE'
                                                    type='submit'
                                                >
                                                    {stateForMethod(
                                                        'DELETE'
                                                    ) !== 'idle'
                                                        ? 'Deleting'
                                                        : 'Delete'}
                                                </button>
                                            </div>
                                        )}
                                    </AddressForm>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export function AddressForm({
    address,
    defaultAddress,
    children,
}: {
    children: (props: {
        stateForMethod: (
            method: 'PUT' | 'POST' | 'DELETE'
        ) => ReturnType<typeof useNavigation>['state']
    }) => React.ReactNode
    defaultAddress: CustomerFragment['defaultAddress']
    address: AddressFragment
}) {
    const { state, formMethod } = useNavigation()
    const action = useActionData<ActionResponse>()
    const error = action?.error?.[address.id]
    const isDefaultAddress = defaultAddress?.id === address.id
    return (
        <Form id={address.id}>
            <input type='hidden' name='addressId' defaultValue={address.id} />
            <div className='address-input'>
                <div className='adress-only'>
                    <div className='login-form-field'>
                        <label htmlFor='lastName'>Nom (livraison)*</label>
                        <input
                            aria-label='Last name'
                            autoComplete='family-name'
                            defaultValue={address?.lastName ?? ''}
                            id='lastName'
                            name='lastName'
                            placeholder='Last name'
                            required
                            type='text'
                        />
                    </div>
                    <div className='login-form-field'>
                        <label htmlFor='firstName'>Prénom (livraison)*</label>
                        <input
                            aria-label='First name'
                            autoComplete='given-name'
                            defaultValue={address?.firstName ?? ''}
                            id='firstName'
                            name='firstName'
                            placeholder='First name'
                            required
                            type='text'
                        />
                    </div>

                    <div className='login-form-field'>
                        <label htmlFor='phone'>numéro de téléphone</label>
                        <input
                            aria-label='Phone'
                            autoComplete='tel'
                            defaultValue={address?.phone ?? ''}
                            id='phone'
                            name='phone'
                            placeholder='+16135551111'
                            pattern='^\+?[1-9]\d{3,14}$'
                            type='tel'
                        />
                    </div>
                </div>
                <div
                    className='adress-only'
                    style={{
                        marginLeft: '20px',
                    }}
                >
                    <div className='login-form-field'>
                        <label htmlFor='country'>Pays*</label>
                        <select
                            aria-label='Country'
                            autoComplete='country-name'
                            defaultValue={address?.country ?? ''}
                            id='country'
                            name='country'
                            required
                            type='text'
                        >
                            {countries.map((country) => (
                                <option
                                    key={country.code}
                                    value={country.label}
                                >
                                    <>
                                        {country.label}

                                        <img
                                            src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                            alt='country'
                                            style={{
                                                marginLeft: '10px',
                                                zIndex: 999,
                                            }}
                                        />
                                    </>
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='login-form-field'>
                        <label htmlFor='zip'>code postal*</label>
                        <input
                            aria-label='Zip'
                            autoComplete='postal-code'
                            defaultValue={address?.zip ?? ''}
                            id='zip'
                            name='zip'
                            placeholder='Zip / Postal Code'
                            required
                            type='text'
                        />
                    </div>
                    <div className='login-form-field'>
                        <label htmlFor='city'>ville*</label>
                        <input
                            aria-label='City'
                            autoComplete='address-level2'
                            defaultValue={address?.city ?? ''}
                            id='city'
                            name='city'
                            placeholder='City'
                            required
                            type='text'
                        />
                    </div>
                </div>
            </div>
            <div
                className='login-form-field'
                style={{
                    padding: '0 40px',
                    width: 'unset',
                }}
            >
                <label
                    style={{
                        fontSize: '12px',
                    }}
                    htmlFor='address1'
                >
                    Information de livraison
                </label>
                <input
                    aria-label='Address line 1'
                    autoComplete='address-line1'
                    defaultValue={address?.address1 ?? ''}
                    id='address1'
                    name='address1'
                    placeholder='Address line 1*'
                    required
                    type='text'
                    style={{
                        height: '50px',
                    }}
                />
            </div>

            <div
                className='account-profile-marketing'
                style={{
                    paddingLeft: '40px',
                }}
            >
                <input
                    defaultChecked={isDefaultAddress}
                    id='defaultAddress'
                    name='defaultAddress'
                    type='checkbox'
                />
                <label
                    htmlFor='defaultAddress'
                    style={{
                        textTransform: 'uppercase',
                        marginLeft: '10px',
                    }}
                >
                    Choisir comme adresse par défaut
                </label>
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
            {children({
                stateForMethod: (method) =>
                    formMethod === method ? state : 'idle',
            })}
        </Form>
    )
}

interface CountryType {
    code: string
    label: string
    suggested?: boolean
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
const countries: readonly CountryType[] = [
    { code: 'FR', label: 'France' },
    { code: 'GP', label: 'Guadeloupe' },
    { code: 'RE', label: 'Réunion' },
    { code: 'CG', label: 'Congo' },
    {
        code: 'YT',
        label: 'Mayotte',
    },
]
// NOTE: https://shopify.dev/docs/api/storefront/2023-04/mutations/customeraddressupdate
const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressUpdate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
 ) @inContext(country: $country, language: $language) {
    customerAddressUpdate(
      address: $address
      customerAccessToken: $customerAccessToken
      id: $id
    ) {
      customerAddress {
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

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerAddressDelete
const DELETE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressDelete(
    $customerAccessToken: String!,
    $id: ID!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        code
        field
        message
      }
      deletedCustomerAddressId
    }
  }
` as const

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerdefaultaddressupdate
const UPDATE_DEFAULT_ADDRESS_MUTATION = `#graphql
  mutation customerDefaultAddressUpdate(
    $addressId: ID!
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerDefaultAddressUpdate(
      addressId: $addressId
      customerAccessToken: $customerAccessToken
    ) {
      customer {
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraddresscreate
const CREATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressCreate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerAddressCreate(
      address: $address
      customerAccessToken: $customerAccessToken
    ) {
      customerAddress {
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
