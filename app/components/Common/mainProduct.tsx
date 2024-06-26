import { Link } from '@remix-run/react'
import React, { useState } from 'react'
import { useNavigate } from '@remix-run/react'
import useWindowDimension from '~/hooks/useWindowDimension'
import Labels from '~/components/Common/Modals/Labels'

export default function ({
    product,
    stickers,
    isCarousel,
    quantity,
    isDouble,
}: any) {
    const navigate = useNavigate()
    const useWidth = useWindowDimension()
    const width = useWidth.width || 1920
    const isDoubleGrid = isDouble ?? false
    const [isOpen, setIsOpen] = useState(false)
    const [labelsOpen, setLabelsOpen] = useState(false)

    const openLabels = () => {
        setLabelsOpen(true)
    }

    const closeLabels = () => {
        setLabelsOpen(false)
    }

    const toggleDialog = () => {
        setIsOpen(!isOpen)
    }

    const handleOutsideClick = (event: any) => {
        if (event.target === event.currentTarget) {
            toggleDialog()
        }
    }

    const mapping = {
        release: product.release,
        new: product.new,
        hotDeal: product.hotDeal,
        ship: product.ship,
        promotion: product.promotion,
        ooo: product.ooo,
        soon: product.soon,
    } as any

    const stickersData = Object.keys(mapping).reduce((acc: any, key: any) => {
        if (mapping[key]) {
            acc.push({ key })
        }
        return acc
    }, [])

    return (
        <>
            {labelsOpen && <Labels isOpen={labelsOpen} onClose={closeLabels} />}
            {isOpen && width > 768 && (
                <div className='dialog-overlay' onClick={handleOutsideClick}>
                    <div className='dialog'>
                        <div className='modal-stickers'>
                            <div
                                className='modal-stickers-close'
                                onClick={toggleDialog}
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
                            <div className='modal-stickers-header'>
                                <h3>Labels trackt</h3>
                                <p
                                    style={{
                                        width: '90%',
                                        margin: 'auto',
                                    }}
                                >
                                    Nos pastilles sont là pour vous guider en un
                                    clin d’œil ! Chacune d’elles est un repère
                                    visuel qui révèle une caractéristique clé du
                                    produit,. Utilisez ces indicateurs pour
                                    naviguer dans notre collection et dénicher
                                    les pièces qui correspondent à vos critères
                                    spécifiques. C’est simple, rapide et cela
                                    rend votre expérience d’achat chez Trackt
                                    encore plus intuitive et personnalisée.
                                </p>
                            </div>
                            <div className='modal-stickers-body'>
                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/release.png'
                                        alt='release'
                                    />
                                    <p>
                                        Accédez à la crème de la crème avec nos
                                        sorties « Exclusive item ». Ces articles
                                        premium définissent les standards du
                                        streetwear haut de gamme.
                                    </p>
                                </div>
                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/hotDeal.png'
                                        alt='hotDeal'
                                    />
                                    <p>
                                        Offres incontournables, sélectionnées
                                        pour leur style audacieux et leurs prix
                                        avantageux. Des opportunités éphémères à
                                        saisir rapidement pour les amateurs de
                                        streetwear.
                                    </p>
                                </div>

                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/new.png'
                                        alt='new'
                                    />
                                    <p>
                                        Soyez à l’avant-garde avec les dernières
                                        nouveautés du streetwear. Ces articles
                                        fraîchement arrivés sont prêts à définir
                                        les prochaines tendances urbaines.
                                    </p>
                                </div>
                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/ship.png'
                                        alt='ship'
                                    />
                                    <p>
                                        Livraison immédiate, cette sélection est
                                        dédiée aux articles expédiés en 48H
                                        puisque nous possédons l’article dans
                                        nos locaux.
                                    </p>
                                </div>

                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/promotion.png'
                                        alt='promotion'
                                    />
                                    <p>
                                        Profitez de promotions exclusives pour
                                        enrichir votre collection de streetwear.
                                        Des pièces uniques et des réductions
                                        alléchantes vous attendent.
                                    </p>
                                </div>
                                <div className='modal-stickers-body-item'>
                                    <img
                                        src='/product/stickers/ooo.png'
                                        alt='ooo'
                                        className='img-ooo'
                                    />
                                    <p>
                                        Ces articles prisés sont actuellement en
                                        rupture de stock, victimes de leur
                                        succès dans l’univers du streetwear.
                                        Inscrivez-vous pour être alerté de leur
                                        retour.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div
                className='product-grid'
                style={{
                    ...(isCarousel && {
                        width: width > 768 ? 'unset' : 'fit-content',
                    }),
                    ...(quantity === 4 &&
                        width > 768 && {
                            flexBasis: 'calc(25% - 60px)',
                            width: 'calc(25% - 60px)',
                        }),
                    ...(quantity === 3 &&
                        width > 768 && {
                            flexBasis: 'calc(33.33333% - 60px)',
                            width: 'calc(33.33333% - 60px)',
                        }),
                    ...(quantity === 2 &&
                        width > 768 && {
                            flexBasis: 'calc(50% - 60px)',
                            width: 'calc(50% - 60px)',
                        }),
                    ...(quantity === 1 &&
                        width > 768 && {
                            width: 'calc(100% - 60px)',
                            flexBasis: 'calc(100% - 60px)',
                        }),
                }}
            >
                <div
                    onClick={() => {
                        stickers === false || stickers !== undefined
                            ? navigate('/products/' + product.handle)
                            : width > 768
                            ? toggleDialog()
                            : openLabels()
                    }}
                >
                    {stickersData.map((item: any, index: any, array: any[]) => (
                        <ImageComponent
                            key={index}
                            keyName={item.key}
                            offset={index * 20}
                            zIdx={1 + array.length - index - 1}
                            ooo={product.ooo?.value}
                        />
                    ))}
                </div>
                {product.ooo?.value && <span>sold out</span>}
                {product.soon?.value && <span className='soon'>soon</span>}

                <div
                    className={`product-img-grid ${
                        isDoubleGrid ? 'double' : ''
                    }`}
                    style={{
                        filter:
                            product.ooo?.value == 'true' || product.soon?.value
                                ? 'opacity(0.15)'
                                : 'none',
                    }}
                >
                    <Link
                        key={product.title}
                        to={`/products/${product.handle}`}
                    >
                        <img
                            src={product.images?.nodes[0]?.url}
                            alt={product.title}
                            className={
                                product.ooo?.value == 'true' ||
                                product.soon?.value
                                    ? 'product-img product-ooo'
                                    : 'product-img'
                            }
                            // style={{
                            //     objectFit: isCarousel
                            //         ? 'contain'
                            //         : product?.box?.value == '4:5' ||
                            //           product?.box?.value == '1:1'
                            //         ? 'contain'
                            //         : 'cover',
                            // }}
                            style={
                                width > 768
                                    ? {
                                          objectFit: 'contain',
                                          width:
                                              quantity === 1 || quantity === 3
                                                  ? '333px'
                                                  : '',
                                      }
                                    : {
                                          objectFit: 'contain',
                                      }
                            }
                        />
                    </Link>
                    {/*<div className='product-img-grid-overlay'>*/}
                    {/*    <div className='product-basket'>*/}
                    {/*        <img src='/icons/basket.svg' alt='basket' />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <div className='product-info-grid'>
                    <Link
                        key={product.title}
                        to={`/products/${product.handle}`}
                    >
                        <h4>
                            {product.vendor?.length > 20
                                ? product.vendor.slice(0, 19) + '...'
                                : product.vendor}
                        </h4>
                        <p>
                            {product.title?.length > 25
                                ? product.title.slice(0, 20) + '...'
                                : product.title}
                        </p>
                    </Link>
                </div>
            </div>
        </>
    )
}

function ImageComponent({ keyName, offset, zIdx }: any) {
    const stickerPath = `/product/stickers/${keyName}.png`

    const style = {
        marginRight: `${offset}px`,
        zIndex: zIdx,
    }
    return (
        <img
            className='product-img-grid-sticker'
            src={stickerPath}
            alt={keyName}
            style={style}
        />
    )
}
