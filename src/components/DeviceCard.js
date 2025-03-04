import React, { useState } from 'react';
import { FaHdd } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import DiskUsagePieChart from './DiskUsagePieChart';
import DiskUsageHistogram from './DiskUsageHistogram';
import InterfaceTable from './InterfaceTable';
import RamUsageHistogram from './RamUsageHistogram';

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

const DeviceCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [showPopout, setShowPopout] = useState(false); // Estado para el modal de disco
  const [showRamPopout, setshowRamPopout] = useState(false); // Estado para el modal de RAM
  const [showTablePopout, setShowTablePopout] = useState(false); // Estado para el modal de interfaces

  const toggleExpand = () => setExpanded(!expanded);
  const togglePopout = () => setShowPopout(!showPopout);
  const toggleRamPopout = () => setshowRamPopout(!showRamPopout);
  const toggleTablePopout = () => setShowTablePopout(!showTablePopout);

  const hasData = item.conectado; // Se utiliza conectado directamente

  // Obtener la fecha actual en formato YYYY-MM-DD
  const currentDate = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  // Verificar si hay datos para la fecha actual
  const currentData = item[currentDate];

  const total = currentData?.discos?.reduce((sum, disk) => sum + parseGB(disk.total), 0) || 0;
  const used = currentData?.discos?.reduce((sum, disk) => sum + parseGB(disk.usado), 0) || 0;
  const free = total - used;
  const usagePercent = total > 0 ? (used / total) * 100 : 0;

  return (
    <div className="card shadow-sm text-center" style={{ width: '220px' }}>
      <div className="card-body">
        <div className="mb-2">
          <FaHdd size={32} color={usagePercent > 80 ? '#e74c3c' : '#444'} />
        </div>
        <h5 className={`fw-bold ${hasData ? 'text-dark' : 'text-danger'}`}>{item.nombre_dispositivo}</h5>
        {hasData ? (
          <>
            <p className="mb-2">
              <span className="d-block">{total} <strong>Total</strong></span>
              <span className="d-block">{used} <strong>En uso</strong></span>
              <span className="d-block">{free} <strong>Libre</strong></span>
            </p>

            {/* Progress Bar */}
            {/*
            <div className="progress" style={{ height: '10px' }}>
              <div
                className={`progress-bar ${usagePercent > 80 ? 'bg-danger' : 'bg-success'}`}
                role="progressbar"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            */}

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

                    <DiskUsagePieChart total={disk.total} used={disk.usado} />
                    <hr />
                  </div>
                ))}
                <div>
                  <h6>RAM:</h6>
                  <p className="mb-1"><strong>Total:</strong> {currentData.ram.total}</p>
                  <p className="mb-1"><strong>Usado:</strong> {currentData.ram.usada}</p>
                  <p className="mb-1"><strong>Libre:</strong> {currentData.ram.disponible}</p>
                </div>

                <Button onClick={togglePopout} className="w-100 mt-3 bg-primary" >
                  Ver Histograma Discos
                </Button>

                <Button onClick={toggleRamPopout} className="w-100 mt-3 bg-success" >
                  Ver Histograma RAM
                </Button>

                <Button onClick={toggleTablePopout} className="w-100 mt-3 bg-info">
                  Ver Tabla Interfaces
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-secondary">No reporta</p>
        )}
      </div>

      {/* Modal de Histograma Discos */}
      <Modal show={showPopout} onHide={togglePopout} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Histograma de Discos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DiskUsageHistogram item={item} />
        </Modal.Body>
      </Modal>

      {/* Modal de Histograma RAM */}
      <Modal show={showRamPopout} onHide={toggleRamPopout} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Histograma de RAM</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RamUsageHistogram item={item} />
        </Modal.Body>
      </Modal>

      {/* Modal de Tabla de Interfaces */}
      <Modal show={showTablePopout} onHide={toggleTablePopout} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Tabla de Interfaces</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InterfaceTable interfaces={item.interfaces} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DeviceCard;
