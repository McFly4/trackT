import React from 'react'

export function AsideCategories({
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode
  heading: React.ReactNode
  id?: string
}) {
  const colors = [
    { name: 'blanc', hex: '#fff', link: '/filtered?palette=white' },
    { name: 'rouge', hex: '#ff0000', link: '/filtered?palette=red' },
    { name: 'rose', hex: '#ff00ff', link: '/filtered?palette=pink' },
    { name: 'violet', hex: '#800080', link: '/filtered?palette=violet' },
    {
      name: 'Bleu navy',
      hex: '#000080',
      link: '/filtered?palette=blue-navy',
    },
    {
      name: 'bleu clair',
      hex: '#add8e6',
      link: '/filtered?palette=blue-clair',
    },
    { name: 'vert', hex: '#008000', link: '/filtered?palette=green' },
    { name: 'jaune', hex: '#ffff00', link: '/filtered?palette=yellow' },
    { name: 'beige', hex: '#f5f5dc', link: '/filtered?palette=beige' },
    { name: 'orange', hex: '#ffa500', link: '/filtered?palette=orange' },
    { name: 'marron', hex: '#8b4513', link: '/filtered?palette=brown' },
    { name: 'kaki', hex: '#556b2f', link: '/filtered?palette=kaki' },
    { name: 'gris', hex: '#808080', link: '/filtered?palette=grey' },
    { name: 'noir', hex: '#000', link: '/filtered?palette=black' },
  ]

  const brandList = [
    { name: 'Adidas', link: '/search?q=adidas' },
    { name: 'Audemars Piguet', link: '/search?q=audemars' },
    { name: 'Bearbrick', link: '/search?q=bearbrick' },
    { name: 'Birkenstock', link: '/search?q=birkenstock' },
    { name: 'Bravest studios', link: '/search?q=bravest' },
    { name: 'Cactus Jack Nike', link: '/search?q=cactus' },
    { name: 'Chrome Hearts', link: '/search?q=chrome' },
    { name: 'Jordan', link: '/search?q=jordan' },
    { name: 'Jumpman Jack', link: '/search?q=jumpman' },
    { name: 'Kaws', link: '/search?q=kaws' },
    { name: 'Kobe ', link: '/search?q=kobe' },
    { name: 'Larvee', link: '/search?q=larvee' },
    { name: ' Nke', link: '/search?q=nike' },
    { name: 'Palace', link: '/search?q=palace' },
    { name: 'Spalding', link: '/search?q=spalding' },
    { name: 'Super 7', link: '/search?q=super7' },
    { name: 'supreme', link: '/search?q=supreme' },
    { name: 'Stussy', link: '/search?q=stussy' },
    { name: 'Yeezy', link: '/search?q=yeezy' },
  ]

  return (
    <div aria-modal className='overlay' id={id} role='dialog'>
      <button
        className='close-outside'
        onClick={() => {
          history.go(-1)
          window.location.hash = ''
        }}
      />
      <div className='categoriesAside searchAside'>
        <CloseAside />
        <main>
          <div className='categoriesAside-container'>
            <div className='categoriesAside-column'>
              <div className='categoriesAside-item'>
                <h4>Genre</h4>
                <p
                  onClick={() => {
                    window.location.href = '/filtered'
                  }}
                >
                  Tout voir
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/filtered'
                  }}
                >
                  Homme
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/filtered?manwoman=Femme'
                  }}
                >
                  Femme
                </p>
              </div>
              <div className='categoriesAside-item'>
                <h4>Catégories</h4>
                <p
                  onClick={() => {
                    window.location.href = '/search?q=Clothing'
                  }}
                >
                  Tous le textile
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/search?q=sneakers'
                  }}
                >
                  Toutes les sneakers
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/search?q=accessoires'
                  }}
                >
                  Tous les accessoires
                </p>
              </div>
              <div className='categoriesAside-item'>
                <span>Accessoires</span>
                <p
                  onClick={() => {
                    window.location.href = '/collections/figurine'
                  }}
                >
                  Toutes les figurines
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Cap'
                  }}
                >
                  toutes les casquettes
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/bonnet'
                  }}
                >
                  Tous les bonnets
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Planches'
                  }}
                >
                  toutes les planches
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/other-accessories'
                  }}
                >
                  tous les autres accessoires
                </p>
              </div>
              <div className='categoriesAside-item'>
                <span>Textile</span>
                <p
                  onClick={() => {
                    window.location.href = '/collections/T-shirt'
                  }}
                >
                  Tous les tee-shirt
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Hoodie'
                  }}
                >
                  tous les hoodies
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Veste'
                  }}
                >
                  toutes les vestes
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Pants'
                  }}
                >
                  tous les pants
                </p>
              </div>
            </div>
            <div className='categoriesAside-column'>
              <div className='categoriesAside-item'>
                <h4>Marques</h4>
                {brandList.map((brand, index) => (
                  <p key={index} onClick={() => (window.location.href = brand.link)}>
                    {brand.name}
                  </p>
                ))}
              </div>
            </div>
            <div className='categoriesAside-column'>
              <div className='categoriesAside-item'>
                <span>Nike</span>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Jordan-1'
                  }}
                >
                  Jordan 1
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Jordan-3'
                  }}
                >
                  Jordan 3
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Jordan-4'
                  }}
                >
                  Jordan 4
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Jordan-5'
                  }}
                >
                  Jordan 5
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/sb-dunk-low'
                  }}
                >
                  SB dunk low
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/dunk-low'
                  }}
                >
                  dunk low
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/search?q=nike'
                  }}
                >
                  toutes les nikes
                </p>
              </div>
              <div className='categoriesAside-item'>
                <span>Adidas</span>
                <p
                  onClick={() => {
                    window.location.href = '/collections/campus-00s'
                  }}
                >
                  CAmpus
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/gazelle'
                  }}
                >
                  gazelle
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/yeezy-350'
                  }}
                >
                  yeezy 350
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/yeezy-750'
                  }}
                >
                  yeezy 750
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/yeezy-slide'
                  }}
                >
                  yeezy slide
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/search?q=adidas'
                  }}
                >
                  toutes les adidas
                </p>
              </div>
              <div className='categoriesAside-item'>
                <span>Supreme</span>
                <p
                  onClick={() => {
                    window.location.href = '/search?q=box logo'
                  }}
                >
                  box logo
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/collections/Collab'
                  }}
                >
                  collab
                </p>
                <p
                  onClick={() => {
                    window.location.href = '/search?q=skateboard'
                  }}
                >
                  Planches de skate
                </p>

                <p
                  onClick={() => {
                    window.location.href = '/search?q=supreme'
                  }}
                >
                  Tous supreme
                </p>
              </div>
            </div>
            <div className='categoriesAside-column'>
              <div className='categoriesAside-item'>
                <h4>labels</h4>

                <div
                  onClick={() => {
                    window.location.href = '/filtered?new=true'
                  }}
                >
                  <img src='/product/stickers/new.png' alt='new' />
                  <p>Nouvel arrivage</p>
                </div>

                <div
                  onClick={() => {
                    window.location.href = '/filtered?fast=true'
                  }}
                >
                  <img src='/product/stickers/ship.png' alt='new' />
                  <p>Chez vous en 48H</p>
                </div>

                <div
                  onClick={() => {
                    window.location.href = '/filtered?hotdeal=true'
                  }}
                >
                  <img src='/product/stickers/hotDeal.png' alt='new' />
                  <p>hot deals</p>
                </div>

                <div
                  onClick={() => {
                    window.location.href = '/filtered?release=true'
                  }}
                >
                  <img src='/product/stickers/release.png' alt='new' />
                  <p>Exclusive items</p>
                </div>

                <div
                  onClick={() => {
                    window.location.href = '/filtered?soon=true'
                  }}
                >
                  <img src='/product/stickers/soon.png' alt='new' />
                  <p>Bientôt disponible</p>
                </div>

                <div
                  onClick={() => {
                    window.location.href = '/filtered?promotion=true'
                  }}
                >
                  <img src='/product/stickers/promotion.png' alt='new' />
                  <p>En promotion</p>
                </div>
              </div>
            </div>
            <div className='categoriesAside-column'>
              <div className='categoriesAside-item'>
                <h4>Couleurs</h4>
                {colors.map((color, index) => (
                  <div
                    onClick={() => (window.location.href = color.link)}
                    key={index}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: color.hex,
                        margin: 'unset',
                        width: '20px',
                        height: '20px',
                        padding: 'unset',
                      }}
                    ></span>
                    <p
                      style={{
                        marginLeft: '10px',
                      }}
                    >
                      {color.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='categoriesAsideNav'>
            <h5>vous pouvez également essayer ces recherches</h5>
            <div
              className='four-btns'
              style={{
                marginTop: '40px',
              }}
            >
              {/*<button*/}
              {/*  onClick={() => {*/}
              {/*    window.location.href = '/filters'*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <img*/}
              {/*    src='/filters/checkbox.png'*/}
              {/*    alt='check'*/}
              {/*    style={{*/}
              {/*      width: '20px',*/}
              {/*      marginRight: '10px',*/}
              {/*    }}*/}
              {/*  />*/}
              {/*  Rechercher par filtres*/}
              {/*</button>*/}

              <button
                onClick={() => {
                  history.go(-1)
                  window.location.href = '#searcha-side'
                }}
              >
                <svg
                  id='icon'
                  xmlns='http://www.w3.org/2000/svg'
                  width='21.548'
                  height='21.547'
                  viewBox='0 0 21.548 21.547'
                  style={{
                    marginRight: '10px',
                  }}
                >
                  <path
                    id='Tracé_219'
                    data-name='Tracé 219'
                    d='M988.192,241.428a8.08,8.08,0,1,1,8.08-8.08A8.089,8.089,0,0,1,988.192,241.428Zm0-13.467a5.387,5.387,0,1,0,5.387,5.387A5.393,5.393,0,0,0,988.192,227.961Z'
                    transform='translate(-980.112 -225.268)'
                    fill='#fff'
                  />
                  <path
                    id='Tracé_220'
                    data-name='Tracé 220'
                    d='M997.192,243.695a1.337,1.337,0,0,1-.952-.395l-6.734-6.733a1.346,1.346,0,0,1,1.9-1.9l6.734,6.733a1.347,1.347,0,0,1-.952,2.3Z'
                    transform='translate(-976.992 -222.148)'
                    fill='#fff'
                  />
                </svg>
                Rechercher manuellement
              </button>
              <button
                onClick={() => {
                  window.location.href = '/filtered'
                }}
                style={{
                  backgroundImage: 'url(/random.png)',
                }}
              >
                <img
                  src='/filters/arrow-shuffle.png'
                  alt='arrow'
                  style={{
                    marginRight: '10px',
                    width: '20px',
                  }}
                />
                Random item
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className='closeSearch' href='#' onChange={() => history.go(-1)}>
      <button className='responsive-modal-close'>
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
          <path
            id='Tracé_467'
            data-name='Tracé 467'
            d='M16841.295-8037.292l-6.295-6.294-6.295,6.294a.988.988,0,0,1-.705.292.988.988,0,0,1-.705-.292,1,1,0,0,1,0-1.417l6.291-6.292-6.291-6.292a1,1,0,0,1,0-1.416,1,1,0,0,1,1.41,0l6.295,6.294,6.295-6.294a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.416l-6.291,6.292,6.291,6.292a1,1,0,0,1,0,1.417.988.988,0,0,1-.705.292A.988.988,0,0,1,16841.295-8037.292Z'
            transform='translate(-16827 8053)'
            fill='#fff'
          />
        </svg>
      </button>
    </a>
  )
}
