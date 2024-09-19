import Link from 'next/link';
import { Button } from '@radix-ui/themes';

export default function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center min-h-full px-4 py-48 text-center">
            <h1 className="text-6xl font-bold mb-4 text-red-600">404</h1>
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p className="text-lg mb-6">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                href="/"
                className="hover:underline animate-fade-in-in2">
                <Button
                    size="4"
                    className="hover:bg-gray-200 p-12 transform transition-transform duration-200 hover:scale-110 text-lg"
                >Go back home</Button>
            </Link>
        </main>


    );
}