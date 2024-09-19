import { Status } from '@prisma/client';
import { Card, Flex, Text } from '@radix-ui/themes'
import Link from 'next/link';
import React from 'react'

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueSummary = ({ open, inProgress, closed }: Props) => {
  const containers: {
    label: string;
    value: number;
    status: Status;
  }[] = [
      { label: 'Open Issues', value: open, status: 'OPEN' },
      { label: 'In-Progress Issues', value: inProgress, status: 'IN_PROGRESS' },
      { label: 'Closed Issues', value: closed, status: 'CLOSED' },
    ]
  return (
    <Flex className='pl-10 gap-8 pb-6'>
      {containers.map(container => (
        <Link
          key={container.label}
          className='text-sm font-medium hover:text-brand-dark'
          href={`/issues/list?status=${container.status}`}>
          <Card className='shadow-xl m-2 p-5'
            style={{ border: '1px solid #ec4899' }}
          >
            <Flex direction="column" >
              {container.label}
              <Text size="5" className='font-bold' >{container.value}</Text>
            </Flex>
          </Card>
        </Link>
      ))}
    </Flex>
  )
}

export default IssueSummary