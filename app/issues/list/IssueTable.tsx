import { IssueStatusBadge } from '@/app/components'
import { Issue, Issue_status } from '@prisma/client'
import { ArrowUpIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Avatar } from '@radix-ui/themes'
import * as Tooltip from '@radix-ui/react-tooltip'

export interface IssueQuery {
    status: Issue_status
    orderBy: keyof Issue;
    page: string;
    projectId?: string;
}

interface Props {
    searchParams: IssueQuery,
    issues: Issue[]
}

const IssueTable = ({ searchParams, issues }: Props) => {

    return (
        <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-brand-light overflow-hidden rounded-lg text-xs sm:text-sm">
                <thead className="bg-brand-light">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.value} className={`px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider ${column.className}`}>
                                <Link href={{
                                    query: {
                                        ...searchParams, orderBy: column.value
                                    }
                                }} className="flex items-center gap-1 hover:underline  transition">
                                    {column.label}
                                    {column.value === searchParams.orderBy && <ArrowUpIcon className="w-3 h-3" />}
                                </Link>
                            </th>
                        ))}
                        <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">Organization</th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">Project</th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Creator</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-light">
                    {issues.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 2} className="text-center py-8 sm:py-12 font-medium text-sm sm:text-lg md:text-xl">
                                No issues currently present in this category.
                            </td>
                        </tr>
                    ) : (
                        issues.map((issue: any) => (
                            <tr key={issue.id} className="transition hover:bg-brand-light/5">
                                <td className="px-2 sm:px-3 md:px-4 py-2">
                                    <Link href={`/issues/${issue.id}`}
                                        className="text-blue-700 hover:underline hover:text-brand-dark font-medium transition text-xs sm:text-sm">
                                        {issue.title}
                                    </Link>
                                    <div className="block md:hidden mt-1">
                                        <IssueStatusBadge status={issue.status} />
                                    </div>
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 hidden md:table-cell">
                                    <IssueStatusBadge status={issue.status} />
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 hidden md:table-cell text-xs sm:text-sm text-gray-600">
                                    {issue.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 hidden md:table-cell text-xs sm:text-sm text-gray-600">
                                    {issue.organization?.name || '-'}
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 hidden md:table-cell text-xs sm:text-sm text-gray-600">
                                    {issue.Project?.name || '-'}
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2">
                                    {issue.creator && (
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <Avatar
                                                    src={issue.creator.image}
                                                    fallback={issue.creator.name?.[0] || '?'}
                                                    radius="full"
                                                    size="3"
                                                />
                                            </Tooltip.Trigger>
                                            <Tooltip.Portal>
                                                <Tooltip.Content side="top" align="center" className="bg-brand text-white px-2 py-1 rounded shadow">
                                                    {issue.creator.name || issue.creator.email || 'Unknown'}
                                                    <Tooltip.Arrow className="fill-brand" />
                                                </Tooltip.Content>
                                            </Tooltip.Portal>
                                        </Tooltip.Root>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
const columns: {
    label: string;
    value: keyof Issue;
    className?: string;
}[] = [
        { label: "Issue", value: "title" },
        { label: "Status", value: "status", className: "hidden md:table-cell" },
        { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
    ];

export const columnNames = columns.map(column => column.value);

export default IssueTable