"use client";

import { Select } from '@radix-ui/themes'

const AssigneeSelect = () => {
    return (
        <Select.Root defaultValue="orange">
            <Select.Trigger>
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    <Select.Label>Suggestions</Select.Label>
                    <Select.Item value="orange" disabled>Select...</Select.Item>
                    <Select.Item value='1'>Sam Rana</Select.Item>
                    <Select.Item value='2'>Rana Sam</Select.Item>
                </Select.Group>
            </Select.Content>
        </Select.Root>
    )
}

export default AssigneeSelect