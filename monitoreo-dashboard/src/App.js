import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { FaHdd } from 'react-icons/fa';
import logo from './Img/images.png';

const parseGB = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(' GB', ''));
};

const SystemDataDisplay = () => {
  const [systemData, setSystemData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'items'),
      orderBy('hora_fecha', 'desc')
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

  const activeDevices = systemData.filter(item => item.conectado); // Solo los activos
  const totalDiskGlobal = activeDevices.reduce((sum, item) => sum + parseGB(item.disco?.total), 0);
  const useDiskGlobal = activeDevices.reduce((sum, item) => sum + parseGB(item.disco?.usado), 0);
  const freeDiskGlobal = activeDevices.reduce((sum, item) => sum + parseGB(item.disco?.libre), 0);

  const reportedCount = activeDevices.length; // Solo contar los que están activos

  const percentageUse = totalDiskGlobal > 0 
    ? ((useDiskGlobal / totalDiskGlobal) * 100).toFixed(2) 
    : 0;
  const percentageFree = totalDiskGlobal > 0 
    ? ((freeDiskGlobal / totalDiskGlobal) * 100).toFixed(2) 
    : 0;

  

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '20px', 
          padding: '10px', 
          borderRadius: '8px', 
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)' 
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
            backgroundColor: '#3498db'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {systemData.map((item) => {
          const hasData = item.conectado;
          const total = parseGB(item.disco?.total);
          const used = parseGB(item.disco?.usado);
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
              <div style={{ marginBottom: '10px' }}>
                <FaHdd size={32} color={usagePercent > 80 ? '#e74c3c' : '#444'} />
              </div>

              <div className={`fw-bold mb-2 ${hasData ? 'text-black' : 'text-danger'}`}>
                {item.nombre_dispositivo}
              </div>

              {hasData ? (
                <>
                <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                  <div>
                    {item.disco?.total} <strong>Total</strong>
                  </div>
                  <div>
                    {item.disco?.usado} <strong>En uso</strong>
                  </div>
                  <div>
                    {item.disco?.libre} <strong>Libre</strong>
                  </div>
                </div>

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
                      backgroundColor: usagePercent > 80 ? '#c0392b' : '#2ecc71',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>

                <button
                onClick={() => toggleExpand(item.id)}
                className="btn btn-success btn-sm rounded-pill mt-2"
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                Ver más
              </button>

              {expandedCard === item.id && (
                <div style={{ marginTop: '10px', fontSize: '14px', textAlign: 'left' }}>
                <div><strong>Nombre:</strong> {item.disco?.nombre}</div>
                <div><strong>Tipo:</strong> {item.disco?.tipo}</div>
                <div><strong>Procesador:</strong> {item.procesador || 'Desconocido'}</div>
                <hr />
                <div><strong>Total RAM:</strong> {item.ram?.total}</div>
                <div><strong>RAM Disponible:</strong> {item.ram?.disponible}</div>
                <div><strong>RAM Utilizada:</strong> {item.ram?.usada}</div>
              </div>
              )}
              </>
              ) : (
                <div className='text-secondary'>No reporta</div>
              )}

              
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemDataDisplay;
