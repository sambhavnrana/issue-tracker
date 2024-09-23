"use client";

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation';
import { LuCode2 } from "react-icons/lu";
import { useSession } from 'next-auth/react';
import { Avatar, Box, Container, DropdownMenu, Flex, Text } from '@radix-ui/themes';
import { Skeleton } from '@/app/components';


const NavBar = () => {

    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b px-3 sm:px-4 md:px-5 py-1 bg-gray-100 shadow-md">
            <Container>
                <Flex justify="between" align="center">
                    <Flex align='center' gap="3">
                        <NavLinks />
                    </Flex>
                    <AuthStatus />
                </Flex>
            </Container>
        </nav>
    )
}

const NavLinks = () => {

    const currentPath = usePathname();

    const links = [
        { label: <LuCode2 className="text-2xl sm:text-3xl" />, href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Issues", href: "/issues/list" },
        { label: "Organizations", href: "/organizations" },
    ]

    return (
        <ul className='flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-5 items-center -mt-1 -mb-2'>
            {links.map(link =>
                <li key={link.href} className="flex items-center">
                    <Link
                        className={`${link.href === currentPath ? 'text-brand-dark font-extrabold' : 'text-zinc-500 font-normal'} text-sm sm:text-base transition-colors hover:text-brand-dark font-semibold px-1 py-2 min-w-fit`}
                        href={link.href}>{link.label}</Link>
                </li>
            )}
        </ul>
    )
}

const AuthStatus = () => {

    const { status, data: session } = useSession();
    if (status === 'loading') return <Skeleton width="3rem" />;

    if (status === 'unauthenticated')
        return <Link className='nav-link text-base sm:text-lg md:text-xl text-zinc-700 hover:font-semibold' href="/api/auth/signin">Log In</Link>


    return (
        <Box>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Avatar
                        src={session!.user!.image!}
                        fallback={session!.user!.name?.charAt(0) || "U"}
                        size="2"
                        className="sm:size-3 cursor-pointer shadow-md border-2 border-brand-light transition-transform hover:scale-105"
                        radius="full"
                        referrerPolicy='no-referrer'
                    />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                    <DropdownMenu.Label>
                        <Text size="2" className="text-brand-dark">
                            {session!.user!.email}
                        </Text>
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator />
                        <Link href="/api/auth/signout">
                    <DropdownMenu.Item className="hover:bg-brand hover:text-white transition-colors" >
                        Log Out
                    </DropdownMenu.Item>
                        </Link>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </Box>
    )
}

export default NavBar