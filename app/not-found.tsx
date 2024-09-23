import Link from 'next/link';
import { Button } from '@radix-ui/themes';

export default function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center min-h-full px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-48 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-red-700">404</h1>
            <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Page Not Found</h1>
            <p className="text-base sm:text-lg mb-4 sm:mb-6">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                href="/"
                className="hover:underline animate-fade-in-in2">
                <Button
                    size="3"
                    className="hover:bg-gray-200 p-8 sm:p-12 transform transition-transform duration-200 hover:scale-110 text-base sm:text-lg"
                >Go back home</Button>
            </Link>
        </main>
    );
}