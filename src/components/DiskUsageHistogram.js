import React from 'react';

const parseGB = (value) => {
  if (!value) return 0;
  const parsed = parseFloat(value.replace(' GB', '').replace(' MB', '').trim());
  return isNaN(parsed) ? 0 : parsed / 1024; // Convertir a TB
};

const DiskUsageTable = ({ item }) => {
  const currentDate = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const currentData = item[currentDate];

  const totalUsageInTB = currentData?.discos?.reduce((sum, disk) => sum + parseGB(disk.usado), 0) || 0;
  console.log(item);
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Uso del Disco (TB)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{currentDate}</td>
          <td>{totalUsageInTB.toFixed(2)} TB</td>
        </tr>
      </tbody>
    </table>
  );
};

export default DiskUsageTable;
