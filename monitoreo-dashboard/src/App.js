import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase'; // Asegúrate de que Firebase esté configurado correctamente

// Función para convertir cadenas como "78.28 GB" a número
const parseGB = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(' GB', ''));
};

const SystemDataDisplay = () => {
  const [systemData, setSystemData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Configuramos la consulta para recuperar los registros, ordenados por fecha (los más recientes primero)
    const q = query(
      collection(db, 'items'),
      orderBy('fecha', 'desc'),
      limit(10) // Puedes ajustar el límite según tus necesidades
    );
    
    // Listener en tiempo real
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          console.warn('No se encontraron documentos');
          setSystemData([]);
          setLoading(false);
          return;
        }
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setSystemData(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error al recuperar datos:', err);
        setError(err);
        setLoading(false);
      }
    );
    
    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Calcular totales globales para discos
  const totalDiskGlobal = systemData.reduce((sum, item) => sum + parseGB(item.totalDisk), 0);
  const useDiskGlobal = systemData.reduce((sum, item) => sum + parseGB(item.useDisk), 0);
  const freeDiskGlobal = systemData.reduce((sum, item) => sum + parseGB(item.freeDisk), 0);

  // Calcular porcentajes de uso y libre
  const percentageUse = totalDiskGlobal > 0 ? ((useDiskGlobal / totalDiskGlobal) * 100).toFixed(2) : 0;
  const percentageFree = totalDiskGlobal > 0 ? ((freeDiskGlobal / totalDiskGlobal) * 100).toFixed(2) : 0;

  // Si hay solo un registro, mostramos los datos en dos columnas
  if (systemData.length === 1) {
    const item = systemData[0];
    return (
      <div style={{ padding: '20px' }}>
        <h1>Resumen Global de Disco</h1>
        <p><strong>Total Disk:</strong> {totalDiskGlobal.toFixed(2)} GB</p>
        <p><strong>Use Disk:</strong> {useDiskGlobal.toFixed(2)} GB</p>
        <p><strong>Free Disk:</strong> {freeDiskGlobal.toFixed(2)} GB</p>
        <p><strong>Porcentaje de Uso:</strong> {percentageUse}%</p>
        <p><strong>Porcentaje Libre:</strong> {percentageFree}%</p>
        <h2>Datos del Cliente</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <tbody>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Name</th>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{systemData[0].name}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Total Disk</th>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{systemData[0].totalDisk}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Use Disk</th>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{systemData[0].useDisk}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Free Disk</th>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{systemData[0].freeDisk}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Total Ram</th>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{systemData[0].totalRam}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Use Ram</th>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{systemData[0].useRam}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Free Ram</th>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{systemData[0].freeRam}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Si hay m\u00e1s de un registro, mostramos una tabla tradicional
  return (
    <div style={{ padding: '20px' }}>
      <h1>Resumen Global de Disco</h1>
      <p><strong>Total Disk:</strong> {totalDiskGlobal.toFixed(2)} GB</p>
      <p><strong>Use Disk:</strong> {useDiskGlobal.toFixed(2)} GB</p>
      <p><strong>Free Disk:</strong> {freeDiskGlobal.toFixed(2)} GB</p>
      <p><strong>Porcentaje de Uso:</strong> {percentageUse}%</p>
      <p><strong>Porcentaje Libre:</strong> {percentageFree}%</p>
      <h2>Datos de Clientes</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Disk</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Use Disk</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Free Disk</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Ram</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Use Ram</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Free Ram</th>
          </tr>
        </thead>
        <tbody>
          {systemData.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.totalDisk}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.useDisk}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.freeDisk}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.totalRam}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.useRam}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.freeRam}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SystemDataDisplay;
