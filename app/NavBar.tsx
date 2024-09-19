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
        <nav className="fixed top-0 left-0 w-full z-50 border-b px-5 py-1 bg-gray-100 shadow-md">
            <Container>
                <Flex justify="between" >
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
        { label: <LuCode2 className="text-3xl" />, href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Issues", href: "/issues/list" },
        // { label: "Assigned", href: "/issues/assigned" },
    ]

    return (
        <ul className='flex space-x-6'>
            {links.map(link =>
                <li key={link.href}>
                    <Link
                        className={`${link.href === currentPath ? 'text-brand-dark font-extrabold hover:text-brand' : 'text-zinc-600 text-base font-semibold'}  transition-colors`}
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
        return <Link className='nav-link text-xl text-zinc-700 hover:font-semibold' href="/api/auth/signin">Log In</Link>


    return (
        <Box>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Avatar
                        src={session!.user!.image!}
                        fallback={session!.user!.name?.charAt(0) || "U"}
                        size="3"
                        radius="full"
                        className='cursor-pointer shadow-md border-2 border-brand-light transition-transform hover:scale-105' // Added subtle border and hover effect
                        referrerPolicy='no-referrer'
                    />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                    <DropdownMenu.Label>
                        <Text size="2" className="text-gray-700">
                            {session!.user!.email}
                        </Text>
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item className="hover:bg-brand-light hover:text-white transition-colors" >
                        <Link href="/api/auth/signout">Log Out</Link>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </Box>
    )
}

export default NavBar