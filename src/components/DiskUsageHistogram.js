import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const parseGB = (value) => {
  if (!value) return 0;
  const parsed = parseFloat(value.replace(' GB', '').replace(' MB', '').trim());
  return isNaN(parsed) ? 0 : parsed / 1024; // Convertir a TB
};

const DiskUsageTable = ({ item }) => {
  if (!item) return null;

  // Filtrar solo las claves que son fechas en formato YYYY-MM-DD y ordenarlas cronológicamente
  const dateKeys = Object.keys(item)
    .filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key))
    .sort((a, b) => new Date(a) - new Date(b));

  // Convertir los datos en un formato adecuado para el gráfico
  const chartData = dateKeys.map((date) => ({
    date,
    usage: item[date]?.discos?.reduce((sum, disk) => sum + parseGB(disk.usado), 0) || 0,
  }));

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Tabla de datos */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Uso del Disco (TB)</th>
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

      {/* Gráfico de barras */}
      <div style={{ width: '50%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'TB', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="usage" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DiskUsageTable;
