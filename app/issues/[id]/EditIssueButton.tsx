import { Pencil2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'

const EditIssueButton = ({ issueId }: { issueId: number }) => {
    return (
        <Link 
            href={`/issues/edit/${issueId}`}
            className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors duration-200 text-sm font-medium"
        >
            <Pencil2Icon className="w-4 h-4" />
            Edit Issue
        </Link>
    )
}

export default EditIssueButton