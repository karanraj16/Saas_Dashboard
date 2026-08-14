import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const RenderChart = ({ transactions }) => {

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [{ date: 'No Data', amount: 0 }];
    
    const groupedData = transactions.reduce((acc, curr) => {
      const dateObj = new Date(curr.date || curr.createdAt || Date.now());
      const dateKey = dateObj.toLocaleDateString();
      
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, amount: 0, timestamp: dateObj.getTime() };
      }
      acc[dateKey].amount += curr.amount; // Sum the amounts for the same day
      return acc;
    }, {});

    return Object.values(groupedData).sort((a, b) => a.timestamp - b.timestamp);
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="var(--text-secondary)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="var(--text-secondary)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `$${value}`} 
        />
        <Tooltip contentStyle={{ background: 'var(--surface-1)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '8px' }} />
        <Line type="monotone" dataKey="amount" stroke="var(--text-accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--fill-accent)' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RenderChart;