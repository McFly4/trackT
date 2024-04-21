import React from 'react'

/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function AsideSearch({
    children,
    heading,
    id = 'aside',
}: {
    children?: React.ReactNode
    heading: React.ReactNode
    id?: string
}) {
    return (
        <div aria-modal className='overlay' id={id} role='dialog'>
            <button
                className='close-outside'
                onClick={() => {
                    history.go(-1)
                    window.location.hash = ''
                }}
            />
            <div className='searchAside'>
                <CloseAside />
                <main>{children}</main>
            </div>
        </div>
    )
}

function CloseAside() {
    return (
        /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
        <a className='closeSearch' href='#' onChange={() => history.go(-1)}>
            <button
                className='responsive-modal-close'
                style={{
                    top: '10px',
                    right: '5px',
                }}
            >
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
        </a>
    )
}
