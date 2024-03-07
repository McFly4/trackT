import { NavLink } from '@remix-run/react'
import React from 'react'

export default function Politics() {
    return (
        <div
            style={{
                marginTop: '200px',
            }}
            className='politics'
        >
            <Menu />
            <div className='legals'>
                <h1>infos légales et conditions</h1>
                <h2 id='legals'>Mentions légales</h2>
                <p
                    style={{
                        marginTop: '50px',
                    }}
                >
                    Le présent site Internet www.tracktonline.com est édité et
                    exploité par TrackT, Auto entreprise au capital de 1.000 €,
                    immatriculée a la chambre de commerce de Lyon sous le numéro
                    de
                    <strong>SIRET 98011790700017</strong> dont le siège social
                    est situé a <strong>Lyon 69005.</strong> <br /> <br /> Vous
                    pouvez nous joindre par courrier électronique à l’adresse
                    <strong>tracktonline@gmail.com</strong> <br />
                    <br />
                    Les directeurs de publication sont Monsieur Chahinian Jules,
                    Edgar Beaufils et Nathan Bijaoui
                    <br />
                    <br />
                    Ce site est hébergé par SHOPIFY INC
                </p>
                <span className='separator'></span>
                <h2 id='generals'>Conditions générales de vente</h2>
                <p>Version mise à jour le 30/01/2024</p>
                <br />
                <br />
                <h4>definitions</h4>
                <br />
                <p>
                    Ces Conditions Générales de Vente (désignées ci-après par
                    « CGV ») régissent toutes les transactions effectuées sur le
                    site web de Trackt (le « Site »), par une personne physique
                    agissant en tant que consommateur (ci-après désignée
                    « Client »). <br /> <br /> Trackt, une Auto-Entreprise, sous
                    le numéro de SIRET 98011790700017, avec son siège social
                    situé à Lyon, est identifiée comme le « Vendeur ». <br />
                    <br /> Important : La validation d’une commande sur le Site
                    implique l’adhésion sans réserve du Client aux présentes
                    CGV.
                </p>
                <br />
                <br />
                <h4>object</h4>
                <br />
                <p>
                    Ces CGV ont pour but de définir les droits et obligations de
                    Trackt et des clients dans le cadre de la vente en ligne de
                    nos produits et services.
                </p>
                <br />
                <h4>Processus de commande</h4>
                <br />
                <p>
                    Pour passer une commande, le client doit sélectionner les
                    produits de son choix, les ajouter à son panier, et suivre
                    les instructions pour finaliser la commande, y compris le
                    paiement. Une confirmation de commande sera envoyée au
                    client par email.
                </p>
                <br />
                <br />
                <h4>Prix et paiement</h4>
                <br />
                <p>
                    Les prix de nos produits sont indiqués en EURO et incluent
                    toutes les taxes applicables. Les paiements peuvent être
                    effectués par Virements bancaires, Paypal, Stripe, Apple
                    Pay, Google Pay, Alma et bientôt en cryptomonnaies dans la
                    V1.
                    <br />
                    Toutes les transactions sont sécurisées.
                </p>
                <br />
                <br />
                <h4>Livraison et retours</h4>
                <br />
                <p>
                    Chez Trackt, nous offrons une gamme d’options de livraison
                    pour répondre à vos besoins. Nos services sont fiables et
                    rapides, assurant que vos achats arrivent en toute sécurité
                    et en temps voulu. <br />
                    <br /> <strong>Pour la France (FR) :</strong> <br />
                    <br /> Nous utilisons Chronopost pour une livraison rapide
                    et efficace.
                    <br />
                    <br /> Délai de livraison : 24 à 48 heures.
                    <br />
                    <br /> Tarifs de livraison : <br />
                    <br />
                    Commandes de 0 à 250 € : Frais de livraison de 10 €. <br />
                    <br />
                    Commandes de 250 à 500 € : Frais de livraison de 5 €. <br />
                    <br />
                    Commandes de plus de 500 € : Livraison gratuite. <br />
                    <br />
                    <strong>Pour la Zone Européenne (EU) :</strong> <br />
                    <br />
                    Délai de livraison : 3 à 5 jours ouvrables. <br />
                    <br />
                    Les tarifs de livraison varient en fonction du poids et de
                    la destination et seront précisés lors du processus de
                    commande.
                    <br />
                    <br /> Nous nous engageons à fournir des informations
                    claires et précises sur les frais et les délais de livraison
                    lors de la finalisation de votre commande. Nos tarifs de
                    livraison sont conçus pour être aussi avantageux que
                    possible, tout en garantissant un service de qualité. Pour
                    plus d’informations, n’hésitez pas à contacter notre service
                    clientèle.
                </p>
                <br />
                <br />
                <h4>Droit de rétraction</h4>
                <br />
                <p>
                    Conformément à la réglementation en vigueur, les clients
                    disposent d’un délai de 14 jours pour retourner un produit
                    s’ils ne sont pas satisfaits. Les produits doivent être
                    retournés dans leur état d’origine.
                </p>
                <br />
                <br />
                <h4>Garanties et responsabilité</h4>
                <br />
                <p>
                    Nous nous engageons à fournir à nos clients des produits de
                    la plus haute qualité. Chaque article que nous vendons passe
                    par un processus d’authentification rigoureux effectué par
                    nos experts. Cela garantit que chaque produit que vous
                    achetez chez nous est 100 % authentique et conforme à nos
                    standards élevés.
                    <br />
                    <br /> Nos experts en authentification vérifient
                    minutieusement chaque article pour assurer son authenticité.
                    <br />
                    <br />
                    En guise de preuve d’authenticité, un patch en plastique
                    unique est apposé sur la semelle de chaque article,
                    indiquant qu’il a été vérifié et authentifié par notre
                    équipe. <br />
                    <br />
                    Cette garantie couvre tout défaut d’authenticité.
                    <br />
                    <br />
                    Nous tenons à souligner que cette garantie s’applique
                    uniquement aux défauts d’authenticité et ne couvre pas les
                    dommages causés après l’achat, l’usure normale,
                    l’utilisation inappropriée ou les accidents. Pour toute
                    question concernant notre garantie ou pour obtenir de l’aide
                    avec un produit Trackt, n’hésitez pas à contacter notre
                    service clientèle.
                </p>
                <br />
                <br />
                <h4>Disposition diverses</h4>
                <br />
                <br />
                <p>
                    <strong> Démarche en Cas de Litige :</strong> En cas de
                    désaccord ou de contestation concernant une transaction ou
                    un produit de Trackt, nous invitons nos clients à contacter
                    en premier lieu notre service clientèle. <br />
                    <br />
                    Notre équipe s’engage à examiner attentivement chaque
                    situation et à œuvrer pour une résolution rapide et
                    équitable. <br />
                    <br />
                    Si les tentatives de résolution à l’amiable ne parviennent
                    pas à un accord satisfaisant, le litige pourra être porté
                    devant les instances de médiation ou judiciaires
                    compétentes. <br />
                    <br />
                    <strong>Juridiction Applicable :</strong> Les présentes
                    Conditions Générales de Vente (CGV) et toutes les
                    transactions effectuées via Trackt sont régies par la loi
                    française. <br />
                    <br />
                    En cas de litige non résolu à l’amiable, celui-ci sera
                    soumis aux tribunaux français compétents, conformément à la
                    législation en vigueur.
                </p>
                <br />
                <br />
                <h4>Contact et service clientèle</h4>
                <br />
                <p>
                    Chez Trackt, nous sommes dédiés à offrir un service
                    clientèle de qualité et à être à votre écoute pour toute
                    question ou réclamation. Nous nous engageons à répondre de
                    manière rapide et efficace pour garantir votre satisfaction.
                </p>
                <br />
                <br />
                <h4>Facturation</h4>
                <br />
                <p>
                    Une facture détaillée sera fournie pour chaque commande.
                    Elle inclura le détail des produits achetés, les taxes et
                    les frais de livraison. La facture sera envoyée par email et
                    sera également accessible dans l’espace client du site.
                </p>
                <br />
                <br />
                <h4>Date de la commande</h4>
                <br />
                <p>
                    La date de la commande est considérée comme étant le jour où
                    Trackt confirme l’acceptation de la commande et le paiement
                    complet du client. Cette date est importante pour le suivi
                    de la commande, la livraison et la garantie.
                </p>
                <br />
                <br />
                <h4>Disponibilité des produits</h4>
                <br />
                <p>
                    Trackt s’engage à mettre à jour régulièrement la
                    disponibilité des produits sur son site. En cas
                    d’indisponibilité d’un produit après passation de commande,
                    le client sera informé et pourra choisir un produit
                    alternatif ou annuler sa commande.
                </p>
                <br />
                <br />
                <h4>Retard ou refus de paiment</h4>
                <p>
                    En cas de retard de paiement, Trackt se réserve le droit de
                    suspendre ou d’annuler la livraison des commandes en cours.
                    En cas de refus de paiement par la banque, la commande sera
                    automatiquement annulée et le client en sera informé par
                    email.
                </p>
                <br />
                <br />
                <h4>Problèmes de livraison</h4>
                <br />
                <p>
                    Conformément à l’article L.216-6 du Code de la consommation,
                    en cas de non-livraison à la date ou à l’expiration du délai
                    prévu, le client a le droit de demander la résolution de la
                    vente. Le remboursement intégral sera effectué dans les
                    meilleurs délais suivant la réception de la demande de
                    résolution.
                </p>
                <br />
                <br />
                <h4>Droit de rétrataction</h4>
                <br />
                <p>
                    Le client dispose d’un droit de rétractation de 14 jours à
                    compter de la réception des produits, sans avoir à justifier
                    de motifs. Les produits doivent être retournés dans leur
                    état d’origine et complet pour un remboursement complet.
                </p>
                <br />
                <br />
                <h4>emballage</h4>
                <br />
                <p>
                    Le client dispose d’un droit de rétractation de 14 jours à
                    compter de la réception des produits, sans avoir à justifier
                    de motifs. Les produits doivent être retournés dans leur
                    état d’origine et complet pour un remboursement complet.
                </p>
                <br />
                <br />
                <h4>Langues</h4>
                <br />
                <p>
                    Les CGV sont disponibles en français. D’autres versions
                    linguistiques peuvent être disponibles pour faciliter la
                    compréhension par nos clients internationaux. Pour nous
                    contacter vous pouvez nous envoyer vos questions,
                    commentaires ou réclamations à l’adresse suivante :
                    tracktonline@gmail.com. Nous nous efforçons de répondre à
                    tous les emails dans les meilleurs délais.
                </p>
                <span className='separator'></span>
                <h2 id='cookies'>Politique de cookies</h2>
                <p>Version mise à jour le 30/01/2024</p>
                <br />
                <br />
                <p>
                    Utilisation des Cookies : Notre site Trackt utilise des
                    cookies pour améliorer votre expérience de navigation,
                    analyser le trafic du site, et pour des objectifs
                    publicitaires.
                    <br />
                    <br />
                    Types de Cookies : Nous utilisons à la fois des cookies de
                    session (qui expirent une fois que vous fermez votre
                    navigateur) et des cookies persistants (qui restent sur
                    votre appareil pendant une période déterminée ou jusqu’à ce
                    que vous les supprimiez).
                    <br />
                    <br />
                    Gestion des Cookies : Vous avez le choix de configurer votre
                    navigateur pour accepter, refuser ou vous alerter lorsque
                    des cookies sont utilisés. Veuillez noter que si vous
                    choisissez de bloquer certains cookies, cela peut affecter
                    le fonctionnement du site.
                    <br />
                    <br />
                    Consentement : En utilisant notre site, vous consentez à
                    l’utilisation de cookies conformément à notre politique de
                    cookies, à moins de les avoir désactivés.
                </p>
                <span className='separator'></span>
                <h2 id='usage'>CONDITONS GÉNÉRALES D’UTILISATIONS</h2>
                <p>Verison mise à jour le 30/01/2024</p>
                <br />
                <br />
                <h4>introduction</h4>
                <br />
                <p>
                    Notre gamme s’étend des chaussures aux figurines, en passant
                    par des vêtements et divers accessoires liés au streetwear.
                    Les présentes Conditions Générales d’Utilisation (CGU)
                    régissent votre accès et utilisation de notre site web,
                    accessible à tracktonline.com En naviguant sur notre site et
                    en utilisant nos services, vous acceptez de vous conformer à
                    ces CGU et reconnaissez avoir compris vos droits et
                    obligations en tant qu’utilisateur.
                </p>
                <br />
                <br />
                <h4>utilisation du site</h4>
                <br />
                <p>
                    Le site Trackt est accessible à tout utilisateur ayant au
                    moins 18 ans ou disposant de l’autorisation parentale. Nous
                    interdisons strictement toute utilisation illégale,
                    frauduleuse, ou qui serait en violation avec nos politiques.
                    Les utilisateurs s’engagent à ne pas perturber l’intégrité
                    ou la performance du site, ni à tenter d’accéder de manière
                    non autorisée aux systèmes ou données.
                </p>
                <br />
                <br />
                <h4>Comptes utilisateurs</h4>
                <br />
                <p>
                    Pour accéder à certains services de Trackt, vous devrez
                    créer un compte. En vous inscrivant, vous vous engagez à
                    fournir des informations exactes et à jour, et à maintenir
                    la sécurité de votre mot de passe. Vous êtes responsable de
                    toutes les activités qui se produisent sous votre compte.
                </p>
                <br />
                <br />
                <h4>propriété intellectuelle</h4>
                <br />
                <p>
                    Tous les éléments du site Trackt, y compris les textes,
                    images, designs, logos et marques, sont protégés par les
                    lois sur la propriété intellectuelle et appartiennent à
                    Trackt ou à ses licenciés. Toute reproduction ou utilisation
                    non autorisée de ces éléments est interdite.
                </p>
                <br />
                <br />
                <h4>liens vers des sites tiers</h4>
                <br />
                <p>
                    Trackt peut inclure des liens vers des sites externes pour
                    lesquels nous ne sommes pas responsables. Ces liens sont
                    fournis pour votre commodité, et vous accédez à ces sites
                    tiers à vos propres risques.
                </p>
                <br />
                <br />
                <h4>modifications des cgu</h4>
                <br />
                <p>
                    Trackt se réserve le droit de modifier ces CGU à tout
                    moment. Les modifications entreront en vigueur dès leur
                    publication sur le site. Nous vous conseillons de consulter
                    régulièrement cette page pour vous tenir informé de tout
                    changement.
                </p>
                <br />
                <br />
                <h4>CONFIDENTIALITÉ ET DONNÉES PERSONNELLES</h4>
                <br />
                <p>
                    Votre vie privée est importante pour nous. Toutes les
                    données personnelles collectées par Trackt sont traitées
                    conformément à notre Politique de confidentialité, qui
                    détaille comment nous collectons, utilisons et protégeons
                    vos informations.
                </p>
                <br />
                <br />
                <h4>DROIT APPLICABLE ET RÉSOLUTION DES LITIGES</h4>
                <br />
                <p>
                    Ces CGU sont régies par le droit français. En cas de litige,
                    les parties s’efforceront de trouver une solution amiable
                    avant toute action judiciaire.
                </p>
                <br />
                <br />
                <h4>NAVIGATION ET RECHERCHE SUR LE SITE</h4>
                <p>
                    Recherche par Catégories : Les utilisateurs peuvent
                    parcourir nos produits par catégories pour une expérience
                    d’achat simplifiée. Présentation des Produits : Chaque
                    produit est présenté avec des détails pour vous aider à
                    faire un choix éclairé. Recherche par Moteur de Recherche :
                    Utilisez notre moteur de recherche intégré pour trouver
                    rapidement ce que vous cherchez.
                </p>
                <br />
                <br />
                <h4>force majeure</h4>
                <br />
                <p>
                    Trackt ne sera pas tenu responsable pour toute non-exécution
                    ou retard dans l’exécution de ses obligations causé par des
                    événements hors de son contrôle raisonnable (force majeure).
                </p>
                <br />
                <br />
                <h4>Responsabilité</h4>
                <br />
                <p>
                    Trackt s’engage à fournir un service de qualité, mais ne
                    peut garantir une expérience sans erreur ou interruption. La
                    responsabilité de Trackt est limitée aux dommages directs et
                    prouvables, excluant les dommages indirects.
                </p>
                <br />
                <br />
                <h4>Validité des cgu</h4>
                <br />
                <p>
                    Ces CGU restent valides et applicables même si certaines de
                    leurs dispositions sont déclarées nulles ou inapplicables
                    par une décision judiciaire. Les dispositions non affectées
                    continueront d’être en vigueur.
                </p>
                <span className='separator'></span>
                <h2 id='politics'>politique de confidentialité</h2>
                <p>Version mise à jour le 30/01/2024</p>3
                <br />
                <br />
                <h4>QUELLES DONNÉES PERSONNELLES COLLECTONS-NOUS ?</h4>
                <br />
                <p>
                    Nous recueillons des informations telles que le nom,
                    l’adresse, l’email et le numéro de téléphone lors de
                    l’inscription ou de la commande. Pour les paiements, nous
                    utilisons des passerelles de paiement sécurisées ; Trackt ne
                    stocke pas les données de carte de crédit.
                </p>
                <br />
                <br />
                <h4>COMMENT UTILISONS-NOUS LES DONNÉES COLLECTÉES ?</h4>
                <br />
                <p>
                    Les données sont principalement utilisées pour le traitement
                    des commandes, la communication avec les clients et
                    l’amélioration de nos services. Nous pouvons également
                    utiliser ces informations pour des campagnes marketing
                    ciblées, avec le consentement de l’utilisateur
                </p>
                <br />
                <br />
                <h4>AVEC QUI PARTAGEONS-NOUS LES DONNÉES PERSONNELLES ?</h4>
                <br />
                <p>
                    Les données peuvent être partagées avec des partenaires
                    logistiques pour la livraison et avec des prestataires de
                    services de paiement pour traiter les achats. Nous veillons
                    à ce que ces tiers respectent des normes strictes de
                    confidentialité et de sécurité des données.
                </p>
                <br />
                <br />
                <h4>COMMENT PROTÉGEONS-NOUS LES DONNÉES PERSONNELLES ?</h4>
                <br />
                <p>
                    Nous employons des mesures de sécurité avancées, y compris
                    le cryptage, pour protéger vos données contre l’accès non
                    autorisé et les fuites de données. En cas de violation de
                    données, nous avons des procédures pour agir rapidement et
                    minimiser les dommages.
                </p>
                <br />
                <br />
                <h4>
                    QUELS SONT LES DROITS DES UTILISATEURS CONCERNANT LEURS
                    DONNÉES ?
                </h4>
                <br />
                <p>
                    Les utilisateurs peuvent accéder à leurs données, les
                    corriger ou demander leur suppression via leur compte
                    utilisateur ou en nous contactant directement. Ils peuvent
                    également refuser l’utilisation de leurs données à des fins
                    de marketing.
                </p>
                <br />
                <br />
                <h4>
                    COMMENT GÉRONS-NOUS LES COOKIES ET AUTRES TECHNOLOGIES DE
                    SUIVI ?
                </h4>
                <br />
                <p>
                    Nous utilisons des cookies pour améliorer l’expérience
                    utilisateur sur notre site, analyser le trafic et à des fins
                    publicitaires. Les utilisateurs peuvent gérer leurs
                    préférences de cookies via les paramètres de leur
                    navigateur.
                </p>
                <br />
                <br />
                <h4>
                    COMMENT INFORMONS-NOUS LES UTILISATEURS DES MODIFICATIONS DE
                    LA POLITIQUE ?
                </h4>
                <br />
                <p>
                    Toute modification de notre politique de confidentialité
                    sera communiquée sur notre site et, si nécessaire, par
                    email. Le consentement des utilisateurs sera sollicité pour
                    toute modification importante.
                </p>
                <br />
                <br />
                <h4>
                    COMMENT LES UTILISATEURS PEUVENT-ILS NOUS CONTACTER POUR DES
                    QUESTIONS SUR LA CONFIDENTIALITÉ ? COMMENT LES UTILISATEURS
                    PEUVENT-ILS NOUS CONTACTER POUR DES QUESTIONS SUR LA
                    CONFIDENTIALITÉ ?
                </h4>
                <br />
                <p>
                    Les données sont principalement utilisées pour le traitement
                    des commandes, la communication avec les clients et
                    l’amélioration de nos services. Nous pouvons également
                    utiliser ces informations pour des campagnes marketing
                    ciblées, avec le consentement de l’utilisateur
                </p>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
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
            <img className='account-menu-bg' src='/politics/politics.png' />
            <NavLink to='/politics#legals'>
                <p>mentions légales</p>
            </NavLink>
            <NavLink to='/politics#generals'>
                <p>conditions générales de vente</p>
            </NavLink>
            <NavLink to='/politics#cookies'>
                <p>Politique de cookies</p>
            </NavLink>{' '}
            <NavLink to='/politics#usage'>
                <p>conditions générales d'utilisation</p>
            </NavLink>
            <NavLink to='/politics#politics'>
                <p>politique de confidentialité</p>
            </NavLink>
        </nav>
    )
}
