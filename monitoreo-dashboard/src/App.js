import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase'; // Asegúrate de que Firebase esté configurado correctamente
import { FaHdd } from 'react-icons/fa'; // npm install react-icons
import logo from './Img/images.png'; // Ajusta el nombre y ruta de la imagen si es necesario

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
    const q = query(
      collection(db, 'items'),
      orderBy('fecha', 'desc'),
      limit(10)
    );
    
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
  const percentageUse = totalDiskGlobal > 0 
    ? ((useDiskGlobal / totalDiskGlobal) * 100).toFixed(2) 
    : 0;
  const percentageFree = totalDiskGlobal > 0 
    ? ((freeDiskGlobal / totalDiskGlobal) * 100).toFixed(2) 
    : 0;

  // Calcular cuántos reportan datos
  const reportedCount = systemData.filter(
    (item) => item.totalDisk && item.useDisk && item.freeDisk
  ).length;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Header con logo y textos */}
      <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '20px', 
          background: '#', 
          padding: '10px', 
          borderRadius: '8px', 
          boxShadow: '0 6px 12px rgba(0,0,0,0)' 
        }}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: '100px', height: 'auto', marginRight: '20px' }}
        />
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>
            Monitor nacional de almacenamiento
          </h1>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            <span style={{ marginRight: '20px' }}>
              <strong>Total:</strong> {totalDiskGlobal.toFixed(2)} GB
            </span>
            <span style={{ marginRight: '20px' }}>
              <strong>Usado:</strong> {useDiskGlobal.toFixed(2)} GB
            </span>
            <span>
              <strong>Libre:</strong> {freeDiskGlobal.toFixed(2)} GB
            </span>
          </div>
          <div style={{ fontSize: '18px' }}>
            Reportado {reportedCount} de {systemData.length}
          </div>
        </div>
      </div>

      {/* Barra de uso global */}
      <div
        style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#bdc3c7',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '20px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentageUse}%`,
            backgroundColor: '#3498db'  // Celeste vibrante
          }}
        />
      </div>

      {/* Grid de tarjetas (cada item) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {systemData.map((item) => {
          // Verificar si el cliente "reporta" datos
          const hasData = item.totalDisk && item.useDisk && item.freeDisk;
          // Calcular porcentaje de uso si hay datos
          const total = parseGB(item.totalDisk);
          const used = parseGB(item.useDisk);
          const usagePercent = total > 0 ? (used / total) * 100 : 0;

          return (
            <div
              key={item.id}
              style={{
                width: '220px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                textAlign: 'center',
                boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
              }}
            >
              {/* Ícono */}
              <div style={{ marginBottom: '10px' }}>
                <FaHdd size={32} color="#444" />
              </div>

              {hasData ? (
                <>
                  {/* Nombre del servidor/cliente */}
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '10px'
                    }}
                  >
                    {item.name}
                  </div>

                  {/* Información de uso y libre */}
                  <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                    <div>
                      {item.totalDisk} <strong>Total</strong>
                    </div>
                    <div>
                      {item.useDisk} <strong>Uso</strong>
                    </div>
                    <div>
                      {item.freeDisk} <strong>Libre</strong>
                    </div>
                  </div>

                  {/* Barra de uso individual */}
                  <div
                    style={{
                      width: '100%',
                      height: '10px',
                      backgroundColor: '#bdc3c7',
                      borderRadius: '5px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${usagePercent}%`,
                        backgroundColor: usagePercent > 80 ? '#c0392b' : '#2ecc71', // Verde vibrante
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Si no hay datos, mostrar nombre en rojo y "No reporta" */}
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                      color: '#e74c3c'
                    }}
                  >
                    {item.name}
                  </div>
                  <div style={{ color: '#e74c3c', fontSize: '16px' }}>No reporta</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemDataDisplay;
