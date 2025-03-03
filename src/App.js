import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { FaHdd } from 'react-icons/fa';
import logo from './Img/images.png';
import DeviceCard from './components/DeviceCard';

const parseGB = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(' GB', ''));
};

const SystemDataDisplay = () => {
  const [systemData, setSystemData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('hora_fecha', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
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
    }, (err) => {
      console.error('Error al recuperar datos:', err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const activeDevices = systemData.filter(item => item.conectado);
  const totalDiskGlobal = activeDevices.reduce((sum, item) => {
    return sum + (item.discos ? item.discos.reduce((diskSum, disk) => diskSum + parseGB(disk.total), 0) : 0);
  }, 0);
  
  const useDiskGlobal = activeDevices.reduce((sum, item) => {
    return sum + (item.discos ? item.discos.reduce((diskSum, disk) => diskSum + parseGB(disk.usado), 0) : 0);
  }, 0);
  
  const freeDiskGlobal = totalDiskGlobal - useDiskGlobal;
  const reportedCount = activeDevices.length;

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
        <img src={logo} alt="Logo" style={{ width: '100px', marginRight: '20px' }} />
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>
            Monitor nacional de almacenamiento
          </h1>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            <span style={{ marginRight: '20px' }}><strong>Total:</strong> {totalDiskGlobal.toFixed(2)} GB</span>
            <span style={{ marginRight: '20px' }}><strong>Usado:</strong> {useDiskGlobal.toFixed(2)} GB</span>
            <span><strong>Libre:</strong> {freeDiskGlobal.toFixed(2)} GB</span>
          </div>
          <div style={{ fontSize: '18px' }}>Reportado {reportedCount} de {systemData.length}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {systemData.map((item) => <DeviceCard key={item.id} item={item} />)}
      </div>
    </div>
  );
};

export default SystemDataDisplay;