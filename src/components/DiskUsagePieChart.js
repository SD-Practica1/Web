import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const parseGB = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(' GB', ''));
};

const DiskUsagePieChart = ({ total, used }) => {
  const totalGB = parseGB(total);
  const usedGB = parseGB(used);
  const freeGB = totalGB - usedGB;

  const data = [
    { name: 'Usado', value: usedGB },
    { name: 'Libre', value: freeGB },
  ];

  const COLORS = ['#28a745', '#d3d3d3']; // Verde para usado, gris para libre

  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default DiskUsagePieChart;