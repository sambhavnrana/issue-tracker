"use client";

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation';
import { AiFillBug } from "react-icons/ai";
import classnames from 'classnames';
import { useSession } from 'next-auth/react';
import { Box, Container, Flex } from '@radix-ui/themes';


const NavBar = () => {
    const currentPath = usePathname();
    const { status, data: session } = useSession();

    const links = [
        { label: "Dashboard", href: "/" },
        { label: "Issues", href: "/issues/list" },
    ]
    return (
        <nav className='border-b mb-5 px-5 h-14 py-3 '>
            <Container> {/* with this, content of navbar gets aligned to page */}
                <Flex justify="between">
                    <Flex align='center' gap="3">
                        <Link href="/" >
                            <AiFillBug />
                        </Link>
                        <ul className='flex space-x-6'>
                            {links.map(link =>
                                <li key={link.href}>
                                    <Link
                                        // className={`${link.href === currentPath ? 'text-zinc-900' : 'text-zinc-500'}  hover:text-zinc-800 transition-colors`}
                                        className={classnames({
                                            'text-zinc-900': link.href === currentPath,
                                            'text-zinc-500': link.href !== currentPath,
                                            'hover:text-zinc-800 transition-colors': true,
                                        })}
                                        href={link.href}>{link.label}</Link>
                                </li>
                            )}
                        </ul>
                    </Flex>
                    <Box>
                        {status === 'authenticated' && <Link href="/api/auth/signout">Log Out</Link>}
                        {status === 'unauthenticated' && <Link href="/api/auth/signin">Log In</Link>}
                    </Box>
                </Flex>
            </Container>
        </nav>
    )
}

export default NavBar