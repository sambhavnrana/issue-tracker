import { Button, Flex } from '@radix-ui/themes'
import Link from 'next/link'
import React from 'react'
import IssueStatusFilter from './IssueStatusFilter'

const IssueActions = () => {
    return (
        <Flex justify="between">
            <IssueStatusFilter />
            <Button
                size="3">
                <Link href="/issues/new">
                    New Issue
                </Link>
            </Button>
        </Flex>
    )
}

export default IssueActions