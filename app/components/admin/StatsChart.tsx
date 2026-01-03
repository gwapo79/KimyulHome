
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Series {
    key: string;
    name: string;
    color: string;
}

interface StatsChartProps {
    type: 'BAR' | 'LINE';
    data: any[];
    series: Series[];
    height?: number;
}

export default function StatsChart({ type, data, series, height = 300 }: StatsChartProps) {

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg text-sm z-50">
                    <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-slate-500 w-24">{entry.name}:</span>
                            <span className="font-mono font-bold text-slate-700">
                                {entry.value?.toLocaleString() ?? 0}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderChart = () => {
        if (type === 'BAR') {
            return (
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    {series.map((s) => (
                        <Bar
                            key={s.key}
                            dataKey={s.key}
                            name={s.name}
                            fill={s.color}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        />
                    ))}
                </BarChart>
            );
        } else if (type === 'LINE') {
            return (
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    {series.map((s, index) => (
                        <Line
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            name={s.name}
                            stroke={s.color}
                            strokeWidth={index === 0 ? 3 : 2}
                            strokeDasharray={index === 0 ? "" : "5 5"}
                            dot={index === 0 ? { r: 4, fill: s.color, strokeWidth: 2, stroke: '#fff' } : false}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            );
        }
    };

    return (
        <div style={{ width: '100%', height: height }}>
            <ResponsiveContainer>
                {renderChart() as any}
            </ResponsiveContainer>
        </div>
    );
}
