import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (severity) => {
  const color = severity === 'Severe' ? '#dc2626' : severity === 'Moderate' ? '#f59e0b' : '#10b981';
  return L.divIcon({
    className: 'custom-alert-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const AlertMap = ({ alerts = [], selectedAlert = null, onAlertClick }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (selectedAlert && mapRef.current) {
      const map = mapRef.current;
      const coords = selectedAlert.coordinates[0];
      if (coords) {
        map.setView([coords[0], coords[1]], 8);
      }
    }
  }, [selectedAlert]);

  return (
    <div className="h-96 w-full rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {alerts.map((alert) => {
          if (!alert.coordinates || alert.coordinates.length === 0) return null;
          
          const coords = alert.coordinates[0];
          return (
            <Marker
              key={alert.id}
              position={[coords[0], coords[1]]}
              icon={createCustomIcon(alert.severity)}
              eventHandlers={{
                click: () => onAlertClick && onAlertClick(alert),
              }}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-sm mb-2">{alert.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full text-white ${
                      alert.severity === 'Severe' ? 'bg-red-500' :
                      alert.severity === 'Moderate' ? 'bg-orange-500' : 'bg-green-500'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-gray-500">{alert.area}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AlertMap;