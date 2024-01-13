import { FooterQuery } from '../../storefrontapi.generated'

export function Footer(menu: FooterQuery) {
    return (
        <footer className='footer'>
            <div>
                <img src='/footer/trackt.png' />
            </div>
            <div className='footer-menu'>
                <h2>liens utiles</h2>
                <p>Saut la team</p>
                <p>Saut la team</p>
            </div>
            <div className='footer-menu'>
                <h2>incontournables</h2>
                <p>Saut la team</p>
                <p>Saut la team</p>
            </div>
            <div className='footer-media'>
                <h2>
                    it's time to follow<span>(please)</span>
                </h2>
                <div className='footer-media-container'>
                    <img src='/footer/insta.png' />
                    <div className='footer-media-double'>
                        <img src='/footer/twitter.png' />
                        <img src='/footer/tiktok.png' />
                    </div>
                </div>
            </div>
        </footer>
    )
}
