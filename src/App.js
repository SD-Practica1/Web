import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';
import logo from './Img/images.png';
import DeviceCard from './components/DeviceCard';
import DiskUsagePieChart from './components/DiskUsagePieChart';

const parseGB = (value) => {
  if (!value) return 0;

  const units = { "MB": 1 / 1024, "GB": 1, "TB": 1024 };
  const match = value.match(/([\d.]+)\s*(MB|GB|TB)/);

  if (match) {
    const [, num, unit] = match;
    return parseFloat(num) * units[unit];
  }

  return 0;
};

const getLatestData = (item) => {
  const dates = Object.keys(item).filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key)); // Filtra claves con formato de fecha
  if (dates.length === 0) return null;
  const latestDate = dates.sort((a, b) => new Date(b) - new Date(a))[0]; // Ordena y toma la más reciente
  return item[latestDate] || null;
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

  if (loading) return <div className="text-center mt-3">Cargando...</div>;
  if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

  const activeDevices = systemData.filter(item => item.conectado);

  const totalDiskGlobal = activeDevices.reduce((sum, item) => {
    const latestData = getLatestData(item);
    if (!latestData || !latestData.discos) return sum;

    return sum + latestData.discos.reduce((diskSum, disk) => diskSum + parseGB(disk.total), 0);
  }, 0);

  const useDiskGlobal = activeDevices.reduce((sum, item) => {
    const latestData = getLatestData(item);
    if (!latestData || !latestData.discos) return sum;

    return sum + latestData.discos.reduce((diskSum, disk) => diskSum + parseGB(disk.usado), 0);
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

        {/* Sección de discos a la derecha */}
        <div className="ms-auto bg-light rounded shadow-sm" style={{ minWidth: '250px', display: 'flex', flexDirection: 'row-reverse' }}>
          <div>
            <DiskUsagePieChart total={totalDiskGlobal} used={useDiskGlobal} />
          </div>
          <div className="ms-3 mt-5">
            <p><strong>{activeDevices.reduce((count, item) => count + (getLatestData(item)?.discos?.length || 0), 0)} Discos</strong> </p>
            <p><strong>{parseFloat(diskUsagePercentage.toFixed(2))} %</strong></p>
          </div>
        </div>

      </div>
  
      {/* Progress Bar */}
      {/*
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
      */}

      <div className="d-flex flex-wrap gap-4">
        {systemData.map((item) => <DeviceCard key={item.id} item={item} />)}
      </div>
    </div>
  );
};

export default SystemDataDisplay;
