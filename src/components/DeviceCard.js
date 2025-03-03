import React, { useState } from 'react';
import { FaHdd } from 'react-icons/fa';

const parseGB = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(' GB', ''));
};

const DeviceCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  const hasData = item.conectado; // Se utiliza conectado directamente
  console.log(item);

  // Obtener la fecha actual en formato YYYY-MM-DD
  const currentDate = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  // Verificar si hay datos para la fecha actual
  const currentData = item[currentDate];

  const total = currentData && currentData.discos ? currentData.discos.reduce((sum, disk) => sum + parseGB(disk.total), 0) : 0;
  const used = currentData && currentData.discos ? currentData.discos.reduce((sum, disk) => sum + parseGB(disk.usado), 0) : 0;
  const usagePercent = total > 0 ? (used / total) * 100 : 0;
  const free = total - used;

  return (
    <div className="card shadow-sm text-center" style={{ width: '220px' }}>
      <div className="card-body">
        <div className="mb-2">
          <FaHdd size={32} color={usagePercent > 80 ? '#e74c3c' : '#444'} />
        </div>
        <h5 className={`fw-bold ${hasData ? 'text-dark' : 'text-danger'}`}>{item.nombre_dispositivo}</h5>
        {hasData? (
          <>
            <p className="mb-2">
              <span className="d-block">{total} <strong>Total</strong></span>
              <span className="d-block">{used} <strong>En uso</strong></span>
              <span className="d-block">{free} <strong>Libre</strong></span>
            </p>
            <div className="progress" style={{ height: '10px' }}>
              <div
                className={`progress-bar ${usagePercent > 80 ? 'bg-danger' : 'bg-success'}`}
                role="progressbar"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <button onClick={toggleExpand} className="btn btn-success btn-sm rounded-pill mt-2">
              {expanded ? 'Ocultar' : 'Ver más'}
            </button>
            {expanded && (
              <div className="mt-3 text-start">
                {currentData.discos?.map((disk, index) => (
                  <div key={index} className="mb-2">
                    <h6>Disco {disk.nombre}</h6>
                    <p className="mb-1"><strong>Tipo:</strong> {disk.tipo}</p>
                    <p className="mb-1"><strong>Montaje:</strong> {disk.montaje}</p>
                    <p className="mb-1"><strong>Total:</strong> {disk.total}</p>
                    <p className="mb-1"><strong>Usado:</strong> {disk.usado}</p>
                    <p className="mb-1"><strong>Libre:</strong> {disk.libre}</p>
                    <hr />
                  </div>
                ))}
                <div>
                  <h6>RAM:</h6>
                  <p className="mb-1"><strong>Total:</strong> {currentData.ram.total}</p>
                  <p className="mb-1"><strong>Usado:</strong> {currentData.ram.usada}</p>
                  <p className="mb-1"><strong>Libre:</strong> {currentData.ram.disponible}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-secondary">No reporta</p>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;
