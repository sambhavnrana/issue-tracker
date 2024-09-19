import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full px-2 py-1 md:py-3 text-center text-sm md:text-base lg:bg-gray-50 bg-gray-200 text-slate-600 shadow animate-fade-in [animation-delay:0.5s]">
            &copy; {new Date().getFullYear()} <Link href="https://www.github.com/sambhavnrana" target="_blank"
                rel="noopener noreferrer" className="underline text-brand-dark"> TrackBuddy</Link>. Developed by{' '}
            <Link href="https://www.sambhavrana.me" target="_blank"
                rel="noopener noreferrer" className="underline text-brand-dark">Sambhav Rana</Link>
        </footer>
    )
}

export default Footer