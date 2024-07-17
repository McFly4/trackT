import { FooterQuery } from '../../storefrontapi.generated'
import { Link } from '@remix-run/react'
export function Footer(menu: FooterQuery) {
  return (
    <div>
      <div className='trusted'></div>
      <footer className='footer'>
        <div>
          <Link to='/'>
            <img src='/footer/logoFooter.PNG' alt='trackt' className='footer-logo' />
          </Link>
        </div>
        <div className='footer-menu'>
          <h4>liens utiles</h4>
          <Link to='/about'>
            <p>A propos de TrackT</p>
          </Link>
          <Link to='/blogs'>
            <p>blog</p>
          </Link>
          <Link to='/politics'>
            <p>infos légales</p>
          </Link>
          <Link to='/retours'>
            <p>RETOURS & REMBOURSEMENTS</p>
          </Link>
          <Link to='/sitemap'>
            <p>Plan du site</p>
          </Link>
          <Link to='/about'>
            <p>
              Carrières
              <img src='/coming.png' alt='coming soon' />
            </p>
          </Link>
          <Link to='/about'>
            <p>
              FAQ
              <img src='/coming.png' alt='coming soon' />
            </p>
          </Link>
        </div>
        <div className='footer-menu2'>
          <h4>incontournables</h4>
          <div className='footer-menu2-container'>
            <Link to='/filtered?new=true'>
              <img src='/product/stickers/new.png' alt='new' />
              <p>Nouvel arrivage</p>
            </Link>
            <Link to='/filtered?fast=true'>
              <img src='/product/stickers/ship.png' alt='fast' />
              <p>Livré en 24h</p>
            </Link>
            <Link to='/filtered?hotdeal=true'>
              <img src='/product/stickers/hotDeal.png' alt='hot deal' />
              <p>hot deal</p>
            </Link>
            <Link to='/filtered?release=true'>
              <img src='/product/stickers/release.png' alt='release' />
              <p>exclusive item</p>
            </Link>
            <Link to='/filtered?promotion=true'>
              <img src='/product/stickers/promotion.png' alt='promo' />
              <p>en promo</p>
            </Link>
          </div>
        </div>
        <div className='footer-media'>
          <h4>
            it's time to follow<span>(please)</span>
          </h4>
          <div className='footer-media-container'>
            <a href='https://www.instagram.com/tracktonline/' target='_blank'>
              <img src='/footer/insta.png' />
            </a>
            <div className='footer-media-double'>
              <a href='https://twitter.com/tracktonline' target='_blank'>
                <img src='/footer/twitter.png' />
              </a>
              <a href='https://www.tiktok.com/@tracktonline' target='_blank'>
                <img src='/footer/tiktok.png' />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
