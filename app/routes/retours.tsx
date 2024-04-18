import { NavLink } from '@remix-run/react'
import React from 'react'
import useWindowDimensions from '~/hooks/useWindowDimension'

export default function Retours() {
    const useWidth = useWindowDimensions()
    const width = useWidth.width || 1920
    return (
        <div
            style={{
                marginTop: '200px',
            }}
            className='politics'
        >
            {width > 768 && <Menu />}
            <div className='legals'>
                <h1>Livraisons retour & remboursement</h1>
                <h2 id='option'>OPTIONS DE LIVRAISON & RETOUR</h2>
                <p
                    style={{
                        marginTop: '50px',
                    }}
                >
                    Nous avons crée trois catégories d’achats pour nuancer les
                    différentes options de retours et remboursement. <br />
                    <br /> Repérez-les lors de vos achats pour comprendre les
                    modalités de renvois/livraison et choisir ce qui vous
                    convient le mieux.
                </p>
            </div>
            <div className='politics-panier'>
                <div className='a-third-guid-container-item'>
                    <img src='/cart/cartClassic.png' alt='cartClassic' />
                    <p>Panier classique</p>
                    <span>0 - 250€</span>
                    <p>
                        LIVRAISON PAYANTE <br />
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
                    </p>
                    <p>Livraison 5€</p>
                </div>
                <div className='a-third-guid-container-item'>
                    <img src='/cart/cartExclusif.png' alt='cartClassic' />
                    <p>Panier premium</p>
                    <span>+500€</span>
                    <p>
                        LIVRAISON GRATUITE <br />
                        RETOURS GRATUITS <br />
                        POCKET ITEM SURPRISE
                    </p>
                    <p>Livraison express</p>
                </div>
            </div>
            <div className='legals'>
                <p
                    style={{
                        marginBottom: '50px',
                    }}
                >
                    * Les booster retours sont des codes de réductions que vous
                    pouvez activer sur toute notre boutique. Leur montant et
                    leur durée de vie sont variable selon le type de panier que
                    vous avez commandé. Dès que notre équipe valide votre
                    retour, vous pouvez délibérément activer votre booster ou le
                    préserver pour de futurs achats.
                    <br />
                    <br id='egible' />
                    Si vous retournez une paire de sneaker, par exemple, vous ne
                    recevrez pas de booster pour ce produit spécifique.
                    Cependant, vous aurez la possibilité de l’utiliser sur
                    d’autres articles.
                    <br />
                    <br />
                    Si vous réalisez un retour, utilisez votre booster, puis
                    effectuez un autre retour, vous n’obtiendrez pas de booster
                    supplémentaire.
                </p>
                <h2>ÉGILIBILITÉ RETOUR & REMBOURSEMENT</h2>
                <p>Version mise à jour le 30/01/2024</p>
                <br />
                <br />
                <h4>Délai de retour</h4>
                <br />
                <p>
                    Vous disposez de 14 jours à compter de la date de réception
                    de votre commande pour initier un retour. Passé ce délai,
                    nous ne pourrons malheureusement pas vous offrir de
                    remboursement ou d’échange.
                </p>
                <br />
                <br />
                <h4>condition des produits</h4>
                <br />
                <p>
                    Pour être éligible au retour, l’article doit être inutilisé,
                    dans le même état que vous l’avez reçu, et dans son
                    emballage d’origine avec toutes les étiquettes attachées.
                    Les retours sont soumis à une inspection rigoureuse par
                    notre équipe.
                    <br />
                    <br />
                    <strong>Pour les vêtements et accessoires :</strong> Les
                    articles endommagés, portés, lavés ou modifiés de quelque
                    manière que ce soit ne seront pas acceptés.
                    <br />
                    <br />
                    <strong>Pour les sneakers :</strong> Il est impératif que
                    l’opercule ‘Trackt’ situé sous les semelles ne soit jamais
                    retiré. Si vous souhaitez essayer la paire, vous devez le
                    faire tout en conservant la protection sous les semelles.
                    Cette mesure garantit que les sneakers restent dans un état
                    neuf et non porté en extérieur, conformément à nos standards
                    de retour. Les sneakers retournées sans l’opercule ‘Trackt’
                    ou avec des traces d’usure ne seront pas acceptées pour un
                    retour ou un remboursement.
                </p>
                <br />
                <br />
                <h4>Remboursements</h4>
                <br />
                <p>
                    Une fois que nous aurons reçu et inspecté votre retour, nous
                    vous notifierons de l’approbation ou du rejet de votre
                    demande.
                    <br />
                    <br />
                    En cas d’approbation, votre remboursement sera traité, et un
                    crédit sera automatiquement appliqué à votre méthode
                    originale de paiement dans un certain nombre de jours.
                    <strong>
                        Il est important de noter que le remboursement couvrira
                        le coût des articles retournés mais n’inclura pas les
                        frais de livraison initiaux.
                    </strong>
                    <br />
                    <br />
                    Cette politique est mise en place pour couvrir les coûts de
                    traitement et d’expédition engagés par notre marque lors de
                    l’envoi initial de la commande. Nous nous efforçons d’être
                    transparents concernant nos politiques pour éviter toute
                    surprise et assurer que vous êtes pleinement informé avant
                    de faire votre achat.
                </p>
                <br />
                <br />
                <h4>Articles non remboursable</h4>
                <br />
                <p>
                    Certains articles, comme ceux en solde, personnalisés ou
                    appartenant à des collections spéciales, peuvent être
                    considérés comme vente finale et ne sont pas éligibles au
                    retour ou au remboursement. Veuillez vérifier les détails du
                    produit avant de finaliser votre achat.
                </p>
                <br />
                <br />
                <h4>Retours internationaux</h4>
                <br />
                <p>
                    Les clients internationaux sont responsables des frais de
                    retour. Nous recommandons d’utiliser un service de livraison
                    traçable ou d’acheter une assurance expédition, car nous ne
                    garantissons pas la réception de votre article retourné.
                </p>
                <br />
                <br />
                <h4>échanges</h4>
                <br />
                <p id='help'>
                    Nous ne remplaçons les articles que s’ils sont défectueux ou
                    endommagés à la réception. Si vous avez besoin d’échanger un
                    article pour le même, veuillez contacter notre service
                    clientèle.
                </p>
                <span className='separator'></span>
                <h2>COMMENT RETOURNER UNE COMMANDE</h2>
                <br />
                <p>
                    Si vous n’êtes pas entièrement satisfait d’un ou de
                    plusieurs articles, il vous suffit de les sélectionner dans
                    votre espace TrackT en naviguant vers « Commandes », puis en
                    choisissant votre commande. Utilisez ensuite le bouton
                    « OPTIONS » pour lancer le processus de retour. Nous vous
                    guiderons pas à pas pour vous assurer que cette démarche
                    soit aussi simple et fluide que possible.
                    <br />
                    <br />
                    Après avoir initié votre retour, un bordereau de retour
                    prépayé sera envoyé directement à l’adresse email utilisée
                    pour passer votre commande, accompagné de toutes les
                    instructions nécessaires pour le renvoi de votre colis.
                    <br />
                    <br />
                    Vous aurez également l’opportunité de choisir entre deux
                    options de remboursement, selon ce qui vous convient le
                    mieux.
                </p>
                <br />
                <h4>Options de remboursement</h4>
                <br />
                <p>
                    *après réception et vérification des articles retournés par
                    notre équipe Trackt.
                </p>
                <div className='politics-retours-cb'>
                    <img src='/about/cb.png' alt='cb' />

                    <h4
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        Remboursement classique
                    </h4>
                    <p
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        Remboursement disponible dans un délais de 3 à 5 jours
                        ouvrables par virement ou carte banquaire, dans la
                        devise utilisée lors du paiement.
                    </p>
                </div>
            </div>
        </div>
    )
}

function Menu() {
    function isActiveStyle({
        isActive,
        isPending,
    }: {
        isActive: boolean
        isPending: boolean
    }) {
        return {
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : undefined,
            backdropFilter: isActive ? 'blur(10px)' : undefined,
        }
    }

    return (
        <nav role='navigation' className='account-menu'>
            <img
                className='account-menu-bg'
                src='/politics/politics.png'
                style={{
                    height: '600px',
                }}
            />
            <NavLink to='/retours#option'>
                <p>Options de livraison & retour</p>
            </NavLink>
            <NavLink to='/retours#egible'>
                <p>ÉGILIBILITÉ RETOUR & REMBOURSEMENT</p>
            </NavLink>
            <NavLink to='/retours#help'>
                <p>Comment retourner une commande</p>
            </NavLink>
        </nav>
    )
}
