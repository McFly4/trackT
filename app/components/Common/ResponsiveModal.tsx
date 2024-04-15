import React, { useState } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
        <div className='modal'>
            {children}
            <button onClick={onClose}>Close Modal</button>
        </div>
    )
}
