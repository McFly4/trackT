import { FooterQuery } from '../../storefrontapi.generated'

export function Footer(menu: FooterQuery) {
    return (
        <footer className='footer'>
            <div>
                <img src='/footer/trackt.png' />
            </div>
            <div className='footer-menu'>
                <h2>liens utiles</h2>
                <p>infos légales</p>
                <p>RETOURS & REMBOURSEMENTS</p>
                <p>
                    FAQ
                    <img src='/coming.png' alt='coming soon' />
                </p>
                <p>
                    blog
                    <img src='/coming.png' alt='coming soon' />
                </p>
                <p>
                    Carrières
                    <img src='/coming.png' alt='coming soon' />
                </p>
                <p>Plan du site</p>
            </div>
            <div className='footer-menu'>
                <h2>incontournables</h2>
                <p>
                    indépendant brand
                    <img src='/coming.png' alt='coming soon' />
                </p>
                <p>exclusive item</p>
                <p>hot deal</p>
                <p>nouveautés</p>
                <p>chez vous en 24h</p>
                <p>en promo</p>
            </div>
            <div className='footer-media'>
                <h2>
                    it's time to follow<span>(please)</span>
                </h2>
                <div className='footer-media-container'>
                    <a
                        href='https://www.instagram.com/tracktonline/'
                        target='_blank'
                    >
                        <img src='/footer/insta.png' />
                    </a>
                    <div className='footer-media-double'>
                        <a
                            href='https://twitter.com/tracktonline'
                            target='_blank'
                        >
                            <img src='/footer/twitter.png' />
                        </a>
                        <a
                            href='https://www.tiktok.com/@tracktonline'
                            target='_blank'
                        >
                            <img src='/footer/tiktok.png' />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
