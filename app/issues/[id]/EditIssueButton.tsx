import { Pencil2Icon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'

const EditIssueButton = ({ issueId }: { issueId: number }) => {
    return (
        <Button>
            <Pencil2Icon />
            <Link href={`/issues/${issueId}/edit`}>Edit Issue</Link>
            {/* didn't use our customised Link as we want simple client side navigation here */}
        </Button>
    )
}

export default EditIssueButton