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
            { label: 'Open', value: open },
            { label: 'In Progress', value: inProgress },
            { label: 'Closed', value: closed },
        ]);
    }, [open, inProgress, closed]);

    return (
        <Card>
            <ResponsiveContainer width="100%" height={300} >
                <BarChart data={chartData}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Bar
                        key={`${open}-${inProgress}-${closed}`} // ensures React animates on data change
                        dataKey="value"
                        fill="var(--accent-9)"
                        barSize={70}
                        isAnimationActive={true}
                        animationBegin={400}
                        animationDuration={1200}
                        animationEasing="ease-in-out"
                        radius={[8, 8, 0, 0]} // rounded top corners for a smoother look
                    />                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default IssueChart