"use client";

import { Card } from '@radix-ui/themes';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid } from 'recharts';
import React, { useEffect, useState } from 'react'

interface Props {
    open: number;
    inProgress: number;
    closed: number;
}

const IssueChart = ({ open, inProgress, closed }: Props) => {
    const [chartData, setChartData] = useState([
        { label: 'Open', value: open, fill: '#ec4899' },
        { label: 'In Progress', value: inProgress, fill: '#8B5CF6' },
        { label: 'Closed', value: closed, fill: '#10B981' },
    ]);

    useEffect(() => {
        setChartData([
            { label: 'Open', value: open, fill: '#ec4899' },
            { label: 'In Progress', value: inProgress, fill: '#8B5CF6' },
            { label: 'Closed', value: closed, fill: '#10B981' },
        ]);
    }, [open, inProgress, closed]);

    const CustomTick = ({ x, y, payload }: any) => {
        const label = payload.value;
        let color = 'text-gray-600';
        
        switch (label) {
            case 'Open':
                color = 'text-red-700';
                break;
            case 'In Progress':
                color = 'text-purple-700';
                break;
            case 'Closed':
                color = 'text-green-700';
                break;
            default:
                color = 'text-gray-600';
        }

        return (
            <g transform={`translate(${x},${y})`}>
                <text 
                    x={0} 
                    y={0} 
                    dy={16} 
                    textAnchor="middle" 
                    fill="currentColor"
                    className={`text-lg font-medium ${color}`}
                >
                    {label}
                </text>
            </g>
        );
    };

    return (
        <Card>
            <ResponsiveContainer width="100%" height={300} >
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                        dataKey="label" 
                        tick={<CustomTick />}
                        axisLine={true}
                        tickLine={true}
                    />
                    <YAxis 
                        axisLine={true}
                        tickLine={true}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Bar
                        key={`${open}-${inProgress}-${closed}`}
                        dataKey="value"
                        barSize={70}
                        isAnimationActive={true}
                        animationBegin={500}
                        animationDuration={1400}
                        animationEasing="ease-in-out"
                        radius={[12, 12, 0, 0]}
                    />                
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default IssueChart