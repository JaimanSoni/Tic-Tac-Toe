import React from 'react'

export default function Footer() {
    return (
        <div className='w-full absolute bottom-0 flex flex-col items-center '>
            <span className='footer-text'>Developed by <span className='text-[#607AAD]'>Jaiman Soni</span></span>
            <div className='footer-text text-[13px] -mt-[5px] mb-[2px] '>
                Note: Leaving the site will erase your progress.
            </div>

        </div>
    )
}
