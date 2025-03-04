import React from 'react';
import { Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';

const parseGB = (value) => {
  if (!value) return 0;
  const parsed = parseFloat(value.replace(' GB', '').replace(' MB', '').trim());
  return isNaN(parsed) ? 0 : parsed / 1024; // Convertir a TB
};

const DiskUsageHistogram = ({ item }) => {
  if (!item) return null;

  // Filtrar solo las claves que son fechas en formato YYYY-MM-DD y ordenarlas cronológicamente
  const dateKeys = Object.keys(item)
    .filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key))
    .sort((a, b) => new Date(a) - new Date(b));

  // Convertir los datos en un formato adecuado para el gráfico
  const chartData = dateKeys.map((date) => {
    const discos = item[date]?.discos || [];
    const totalUsage = discos.reduce((sum, disk) => sum + parseGB(disk.usado), 0);
    const diskUsages = discos.map(disk => ({ name: disk.nombre, usage: parseGB(disk.usado) }));

    return {
      date,
      usage: totalUsage,
      ...Object.fromEntries(diskUsages.map(disk => [disk.name, disk.usage]))
    };
  });

  // Obtener todas las claves de discos para las líneas del gráfico
  const allDiskNames = Array.from(new Set(chartData.flatMap(data => Object.keys(data).filter(key => key !== 'date' && key !== 'usage'))));

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Uso Total del Disco (TB)</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map(({ date, usage }) => (
            <tr key={date}>
              <td>{date}</td>
              <td>{usage.toFixed(5)} TB</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ width: '50%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'TB', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="usage" fill="#8884d8" />
            {allDiskNames.map((diskName, index) => (
              <Line key={index} type="monotone" dataKey={diskName} stroke={`hsl(${index * 60}, 70%, 50%)`} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DiskUsageHistogram;
