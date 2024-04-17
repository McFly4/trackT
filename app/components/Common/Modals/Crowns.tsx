import React from 'react'

const Crowns = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null

    return (
        <div className='responsive-modal'>
            <button className='responsive-modal-close' onClick={onClose}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                >
                    <path
                        id='Tracé_467'
                        data-name='Tracé 467'
                        d='M16841.295-8037.292l-6.295-6.294-6.295,6.294a.988.988,0,0,1-.705.292.988.988,0,0,1-.705-.292,1,1,0,0,1,0-1.417l6.291-6.292-6.291-6.292a1,1,0,0,1,0-1.416,1,1,0,0,1,1.41,0l6.295,6.294,6.295-6.294a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.416l-6.291,6.292,6.291,6.292a1,1,0,0,1,0,1.417.988.988,0,0,1-.705.292A.988.988,0,0,1,16841.295-8037.292Z'
                        transform='translate(-16827 8053)'
                        fill='#fff'
                    />
                </svg>
            </button>
            <div className='responsive-crowns'>
                <h4>Options de livraison & retour</h4>
                <p>
                    Nous avons crée trois catégories d’achats pour nuancer les
                    différentes options de retours et remboursement. Repérez-les
                    lors de vos achats pour comprendre les modalités de
                    renvois/livraison et choisir ce qui vous convient le mieux.
                </p>
                <div className='a-third-guid-container-item'>
                    <img src='/cart/cartClassic.png' alt='cartClassic' />
                    <p>Panier classique</p>
                    <span>0 - 250€</span>
                    <p>
                        <br />
                        RETOURS PAYANTS <br />
                        {/*BOOSTER RETOUR* 24H (10 €)*/}
                    </p>
                    <p>Livraison 10€ - Retours 10€</p>
                </div>
                <div className='a-third-guid-container-item'>
                    <img src='/cart/cartPremium.png' alt='cartClassic' />
                    <p>Panier premium</p>
                    <span>250€ - 500€</span>
                    <p>
                        RÉDUCTION LIVRAISON <br />
                        RETOURS GRATUITS <br />
                        {/*BOOSTER RETOUR* 24H (20 €)*/}
                    </p>
                    <p>Livraison 5€</p>
                </div>
                <div className='a-third-guid-container-item'>
                    <img src='/cart/cartExclusif.png' alt='cartClassic' />
                    <p>Panier premium</p>
                    <span>+500€</span>
                    <p>
                        LIVRAISON GRATUITE EXPRESS
                        <br />
                        RETOURS GRATUITS <br />
                        POCKET ITEM SURPRISE
                    </p>
                    <p>Livraison express</p>
                </div>
            </div>
        </div>
    )
}

export default Crowns
