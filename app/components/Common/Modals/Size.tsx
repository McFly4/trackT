import React from 'react'

const Size = ({ isOpen, onClose }: any) => {
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
                <h4>Guide des tailles</h4>
                <p
                    style={{
                        marginBottom: '20px',
                    }}
                >
                    Nous avons classifié nos articles en trois catégories
                    distinctes pour mieux vous aider à choisir vos tailles :
                    Little, Medium et Over.
                    <br />
                    <br />
                    Repérez ces différentes options pour trouver la coupe qui
                    vous convient le mieux.
                </p>
                <div className='a-third-guid-container-item'>
                    <img
                        src='/about/little_toothbrush.png'
                        alt='little_toothbrush'
                    />
                    <p>Little</p>
                    <p>
                        Adapté à ceux qui aiment un style structuré. Coupe
                        sérée.
                    </p>
                </div>
                <div className='a-third-guid-container-item'>
                    <img
                        src='/about/medium_toothbrush.png'
                        alt='medium_toothbrush'
                    />
                    <p>Medium</p>
                    <p>
                        Conçu pour ceux qui cherchent l’équilibre. Sizing
                        universel.
                    </p>
                </div>
                <div className='a-third-guid-container-item'>
                    <img
                        src='/about/over_toothbrush.png'
                        alt='over_toothbrush'
                    />
                    <p>over</p>
                    <p>
                        Destiné à ceux qui privilégient l’espace et la liberté
                        de mouvement.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Size
