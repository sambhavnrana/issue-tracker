import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-xs sm:text-sm md:text-base lg:bg-gray-100 bg-gray-200 text-slate-600 shadow animate-fade-in [animation-delay:0.5s]">
            &copy; {new Date().getFullYear()} <Link href="https://www.github.com/sambhavnrana" target="_blank"
                rel="noopener noreferrer" className="underline text-brand-dark"> TrackBuddy</Link>. Developed by{' '}
            <Link href="https://www.sambhavrana.me" target="_blank"
                rel="noopener noreferrer" className="underline text-brand-dark">Sambhav Rana</Link>
        </footer>
        // <div>FOOTER</div>
    )
}

export default Footer