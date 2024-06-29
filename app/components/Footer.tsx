import { FooterQuery } from '../../storefrontapi.generated'
import { Link } from '@remix-run/react'
export function Footer(menu: FooterQuery) {
  return (
    <div>
      <div className='trusted'></div>
      <footer className='footer'>
        <div>
          <Link to='/'>
            <img src='/footer/trackt.png' />
          </Link>
        </div>
        <div className='footer-menu'>
          <h4>liens utiles</h4>
          <Link to='/politics'>
            <p>mentions légales</p>
          </Link>
          <Link to='/retours'>
            <p>RETOURS & REMBOURSEMENTS</p>
          </Link>
          <Link to='/about'>
            <p>
              FAQ
              <img src='/coming.png' alt='coming soon' />
            </p>
          </Link>
          <Link to='/about'>
            <p>
              blog
              <img src='/coming.png' alt='coming soon' />
            </p>
          </Link>
          <Link to='/about'>
            <p>
              Carrières
              <img src='/coming.png' alt='coming soon' />
            </p>
          </Link>
          <Link to='/sitemap'>
            <p>Plan du site</p>
          </Link>
        </div>
        <div className='footer-menu'>
          <h4>incontournables</h4>
          <p>
            indépendant brand
            <img src='/coming.png' alt='coming soon' />
          </p>
          <Link to='/filtered?release=true'>
            <p>exclusive item</p>
          </Link>
          <Link to='/filtered?hotdeal=true'>
            <p>hot deal</p>
          </Link>
          <Link to='/filtered?new=true'>
            <p>nouveautés</p>
          </Link>
          <Link to='/filtered?fast=true'>
            <p>chez vous en 24h</p>
          </Link>
          <Link to='/filtered?promotion=true'>
            <p>en promo</p>
          </Link>
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
