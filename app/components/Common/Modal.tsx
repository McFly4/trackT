import React, { useState } from 'react'

export default function ({ open, onClose, children }: any) {
    const [isOpen, setIsOpen] = useState(open || false)

    const toggleDialog = () => {
        setIsOpen(!isOpen)
    }

    const handleOutsideClick = (event: any) => {
        if (event.target === event.currentTarget) {
            toggleDialog()
        }
    }

    return (
        <>
            {isOpen && (
                <div className='dialog-overlay' onClick={handleOutsideClick}>
                    <div className='dialog'>{children}</div>
                </div>
            )}
        </>
    )
}
