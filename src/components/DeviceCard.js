import React, { useState, useEffect } from 'react';
import { FaHdd } from 'react-icons/fa';

const parseGB = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(' GB', ''));
};

const DeviceCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [filteredItem, setFilteredItem] = useState(null);
  const toggleExpand = () => setExpanded(!expanded);

  // Obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const currentDate = getCurrentDate(); // Fecha actual
    if (item && item[currentDate]) {
      setFilteredItem(item[currentDate]); // Filtrar el objeto que coincide con la fecha actual
    }
  }, [item]);

  if (!filteredItem) return <p>No se encontraron datos para hoy.</p>;

  const {nombre_dispositivo, discos, ram } = filteredItem;
  const conectado = item.conectado;
  const total = discos ? discos.reduce((sum, disk) => sum + parseGB(disk.total), 0) : 0;
  const used = discos ? discos.reduce((sum, disk) => sum + parseGB(disk.usado), 0) : 0;
  const usagePercent = total > 0 ? (used / total) * 100 : 0;
  const free = total - used;

  return (
    <div 
      className="card text-center"
      style={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)' }}
    >
      <div className="card-body">
        <div className="mb-2">
          <FaHdd size={32} color={usagePercent > 80 ? '#e74c3c' : '#444'} />
        </div>
        <h5 className={`fw-bold ${conectado ? 'text-dark' : 'text-danger'}`}>{nombre_dispositivo}</h5>
        {conectado ? (
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
                {discos?.map((disk, index) => (
                  <div key={index} className="mb-2">
                    <p className="mb-1"><strong>Nombre:</strong> {disk.nombre}</p>
                    <p className="mb-1"><strong>Tipo:</strong> {disk.tipo}</p>
                    <p className="mb-1"><strong>Montaje:</strong> {disk.montaje}</p>
                    <p className="mb-1"><strong>Total:</strong> {disk.total}</p>
                    <p className="mb-1"><strong>Usado:</strong> {disk.usado}</p>
                    <p className="mb-1"><strong>Libre:</strong> {disk.libre}</p>
                    <hr />
                  </div>
                ))}
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
