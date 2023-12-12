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
            <aside className='searchAside'>
                <CloseAside />
                <main>{children}</main>
            </aside>
        </div>
    )
}

function CloseAside() {
    return (
        /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
        <a className='closeSearch' href='#' onChange={() => history.go(-1)}>
            &times;
        </a>
    )
}
