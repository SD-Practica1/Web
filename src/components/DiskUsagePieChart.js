import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const parseGB = (value) => {
  if (!value) return 0;

  // Si el valor ya es un número, lo devolvemos directamente
  if (!isNaN(value)) return parseFloat(value);

  const units = { "MB": 1 / 1024, "GB": 1, "TB": 1024 };
  const match = value.match(/([\d.]+)\s*(MB|GB|TB)?/);

  if (match) {
    const [, num, unit] = match;
    return parseFloat(num) * (units[unit] || 1); // Si no hay unidad, asumimos GB
  }

  return 0;
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