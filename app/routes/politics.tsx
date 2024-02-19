import { NavLink, Outlet } from '@remix-run/react'
import React from 'react'

export default function Politics() {
    return (
        <PoliticsLayout>
            <Outlet />
        </PoliticsLayout>
    )
}

function PoliticsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                marginTop: '200px',
            }}
            className='politics'
        >
            <Menu />
            {children}
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
            <NavLink to='/politics/legals' style={isActiveStyle}>
                <p>mentions légales</p>
            </NavLink>
            <NavLink to='/politics/conditions' style={isActiveStyle}>
                <p>conditions générales de vente</p>
            </NavLink>
            <NavLink to='/politics/cookies' style={isActiveStyle}>
                <p>Politique de cookies</p>
            </NavLink>{' '}
            <NavLink to='/politics/conditionsuser' style={isActiveStyle}>
                <p>conditions générales d'utilisation</p>
            </NavLink>
            <NavLink to='/politics/confidential' style={isActiveStyle}>
                <p>politique de confidentialité</p>
            </NavLink>
        </nav>
    )
}
