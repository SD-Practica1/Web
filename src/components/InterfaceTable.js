import React from "react";

const InterfaceTable = ({ interfaces }) => {
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg border table table-striped">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Interface</th>
              <th className="py-2 px-4 text-left">IP Address</th>
              <th className="py-2 px-4 text-left">MAC Address</th>
            </tr>
          </thead>
          <tbody>
            {interfaces.map((iface, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{iface.interface}</td>
                <td className="py-2 px-4">{iface.ip}</td>
                <td className="py-2 px-4">{iface.mac}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterfaceTable;
