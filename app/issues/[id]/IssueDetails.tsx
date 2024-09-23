import { IssueStatusBadge } from '@/app/components'
import { Issue } from '@prisma/client'
import { Avatar } from '@radix-ui/themes'
import ReactMarkdown from 'react-markdown'
import * as Tooltip from '@radix-ui/react-tooltip'

const IssueDetails = ({ issue, ownerName, creatorImage }: { issue: any, ownerName?: string, creatorImage?: string }) => {
    return (
        <div className="bg-white border border-brand-light rounded-lg p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <Avatar
                            src={creatorImage}
                            fallback={ownerName?.[0] || '?'}
                            radius="full"
                            size="4"
                        />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content side="top" align="center" className="bg-brand text-white px-2 py-1 rounded shadow">
                            {ownerName || 'Unknown'}
                            <Tooltip.Arrow className="fill-brand" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
                
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-brand-dark mb-2">{issue.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        {ownerName && (
                            <span>Owner: {ownerName}</span>
                        )}
                        <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
                <IssueStatusBadge status={issue.status} />
            </div>

            {/* Description */}
            <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Description</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <ReactMarkdown className="text-gray-700 leading-relaxed">
                        {issue.description}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

export default IssueDetails