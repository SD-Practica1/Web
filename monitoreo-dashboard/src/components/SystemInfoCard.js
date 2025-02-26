import React from 'react';

const SystemInfoCard = ({ clientsData }) => {
  // Existing calculation logic remains the same

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-6xl mx-auto">
      {/* Encabezado con diseño más moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex items-center space-x-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Monitor Nacional de Almacenamiento</h1>
          <p className="text-sm text-blue-100 opacity-75">Resumen Detallado de Almacenamiento</p>
        </div>
      </div>

      {/* Resumen con diseño más elegante */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg shadow-md p-4 transform transition-all hover:scale-105">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatNumber(totalStorage)} GB
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wider">Almacenamiento Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 transform transition-all hover:scale-105">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {formatNumber(totalUsed)} GB
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wider">Usado</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 transform transition-all hover:scale-105">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatNumber(totalFree)} GB
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wider">Libre</div>
          </div>
        </div>
        
        {/* Barra de Progreso con diseño más refinado */}
        <div className="mt-6 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 ${
              usagePercentage > 70 ? 'bg-red-500' : 
              usagePercentage > 30 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`} 
            style={{ 
              width: `${usagePercentage}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
        
        <div className="text-center mt-3 text-sm text-gray-600">
          {usagePercentage}% Usado - Reportaron {reportingCount} de {clientsData.length} clientes
        </div>
      </div>

      {/* Cuadrícula de Clientes con diseño más atractivo */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {clientsData.map((client) => {
          const usagePercentage = client.reporting && client.total > 0 ? (client.used / client.total) * 100 : 0;
          return (
            <div 
              key={client.name} 
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
            >
              <div className="p-4">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-blue-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">
                  {client.name}
                </h3>
                
                {client.reporting ? (
                  <>
                    <div className="text-center text-sm text-gray-600 mb-2">
                      {formatNumber(client.total)} GB total
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                      <div
                        className={`h-2.5 ${
                          usagePercentage >= 70 ? 'bg-red-500' : 
                          usagePercentage >= 30 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ 
                          width: `${usagePercentage}%`,
                          transition: 'width 0.5s ease-in-out'
                        }}
                      ></div>
                    </div>
                    <div className="text-center text-xs text-gray-500">
                      {formatNumber(client.used)} GB usado, {formatNumber(client.free)} GB libre
                    </div>
                  </>
                ) : (
                  <p className="text-center text-red-600 font-bold text-xs">No reporta</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemInfoCard;