import { Skeleton } from '@/app/components'
import { Box } from '@radix-ui/themes'

const LoadingNewIssuePage = () => {
    return (
        <Box className='max-w-xl'>
            <Skeleton />
            <Skeleton height="5rem" />
        </Box>
    )
}

export default LoadingNewIssuePage