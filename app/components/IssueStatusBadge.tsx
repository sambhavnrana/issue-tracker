import { Issue_status } from '@prisma/client'
import { Badge } from '@radix-ui/themes'

const statusMap: Record<
    Issue_status,
    { label: string, color: "red" | "violet" | "green" }> = {
    OPEN: { label: 'Open', color: 'red' },
    CLOSED: { label: 'Closed', color: 'green' },
    IN_PROGRESS: { label: 'In Progress', color: 'violet' },
}

const IssueStatusBadge = ({ status }: { status: Issue_status }) => {
    return (
        <Badge color={statusMap[status].color}>
            {statusMap[status].label}
        </Badge>
    )
}

export default IssueStatusBadge