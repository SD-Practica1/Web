import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';
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
    const q = query(collection(db, 'items'));
    
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
      console.log(data);
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
  const diskUsagePercentage = totalDiskGlobal > 0 ? (useDiskGlobal / totalDiskGlobal) * 100 : 0;

  return (
    <div className="p-4" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="d-flex align-items-center mb-4 p-3 rounded shadow-sm">
        <img src={logo} alt="Logo" className="me-4" style={{ width: '100px' }} />
        <div>
          <h1 className="fs-4 mb-3">
            Monitor nacional de almacenamiento
          </h1>
          <div className="fs-5 mb-3">
            <span className="me-4"><strong>Total:</strong> {totalDiskGlobal.toFixed(2)} GB</span>
            <span className="me-4"><strong>Usado:</strong> {useDiskGlobal.toFixed(2)} GB</span>
            <span><strong>Libre:</strong> {freeDiskGlobal.toFixed(2)} GB</span>
          </div>
          <div className="fs-5">Reportado {reportedCount} de {systemData.length}</div>
        </div>
      </div>
  
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="progress" style={{ height: '20px', boxShadow: '0 6px 12px rgba(0,0,0,0.4)' }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${diskUsagePercentage}%` }}
            aria-valuenow={diskUsagePercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      <div className="d-flex flex-wrap gap-4">
        {systemData.map((item) => <DeviceCard key={item.id} item={item} />)}
      </div>
    </div>
  );
};

export default SystemDataDisplay;
