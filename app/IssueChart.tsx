"use client";

import { Card } from '@radix-ui/themes';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts';
import React, { useEffect, useState } from 'react'

interface Props {
    open: number;
    inProgress: number;
    closed: number;
}

const IssueChart = ({ open, inProgress, closed }: Props) => {
    const [chartData, setChartData] = useState([
        { label: 'In Progress', value: inProgress },
        { label: 'Open', value: open },
        { label: 'Closed', value: closed },
    ]);

    useEffect(() => {
        setChartData([
            { label: 'In Progress', value: inProgress },
            { label: 'Open', value: open },
            { label: 'Closed', value: closed },
        ]);
    }, [open, inProgress, closed]);

    console.log('IssueChart received:', { open, inProgress, closed });
    console.log('Chart data:', chartData);

    return (
        <Card>
            <ResponsiveContainer width="100%" height={300} >
                <BarChart data={chartData}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Bar dataKey="value" style={{ fill: 'var(--accent-9)' }} barSize={80} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default IssueChart