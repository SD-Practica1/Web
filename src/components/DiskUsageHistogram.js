import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Función para convertir el valor en GB a número flotante
const parseGB = (value) => {
  if (!value) return 0;
  const parsed = parseFloat(value.replace(' GB', '').trim()); // Eliminamos ' GB' y cualquier espacio extra
  return isNaN(parsed) ? 0 : parsed;
};

// Componente DiskUsageHistogram
const DiskUsageHistogram = ({ disk }) => {
  // Comprobamos que el objeto disk tenga los datos correctos
  const data = [
    { name: 'Usado', value: parseGB(disk.usado) },
    { name: 'Libre', value: parseGB(disk.libre) },
    { name: 'Total', value: parseGB(disk.total) },
  ];

  return (
    <BarChart width={400} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#3498db" />
    </BarChart>
  );
};

export default DiskUsageHistogram;
