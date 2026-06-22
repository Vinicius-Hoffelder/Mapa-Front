import { useEffect, useState } from "react";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";
import pinImg from "../assets/ping.png";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -28.2627800,
  lng: -52.4066700,
};

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [pendingPoint, setPendingPoint] = useState(null);
  const [problemDescription, setProblemDescription] = useState("");
  const [isSavingPoint, setIsSavingPoint] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getPoints(token);
        setMarkers(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchMarkers();
  }, [token]);

  const handleMapClick = async (event) => {
    setSelectedMarker(null);
    setProblemDescription("");
    setPendingPoint({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleCancelPoint = () => {
    setPendingPoint(null);
    setProblemDescription("");
  };

  const handleSavePoint = async (event) => {
    event.preventDefault();

    const description = problemDescription.trim();

    if (!description || !pendingPoint) {
      return;
    }

    const newPoint = {
      latitude: pendingPoint.lat,
      longitude: pendingPoint.lng,
      descricao: description,
    };

    setIsSavingPoint(true);

    try {
      const savedPoint = await postPoint(token, newPoint);
      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.descricao || "Novo Ponto",
        description: savedPoint.descricao || "Novo Ponto",
        position: {
          lat: savedPoint.latitude,
          lng: savedPoint.longitude,
        },
      };
      setMarkers((prev) => [...prev, savedMarker]);
      handleCancelPoint();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSavingPoint(false);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onClick={handleMapClick}
        >
          {markers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.title}
              icon={{
                url: pinImg,
                scaledSize: new window.google.maps.Size(45, 45),
              }}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <strong>{selectedMarker.description || selectedMarker.title || "Ponto"}</strong>
                <p>Latitude: {selectedMarker.position.lat.toFixed(6)}</p>
                <p>Longitude: {selectedMarker.position.lng.toFixed(6)}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <div>Carregando mapa...</div>
      )}

      {pendingPoint && (
        <form
          onSubmit={handleSavePoint}
          style={{
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
            left: "50%",
            padding: "16px",
            position: "absolute",
            top: "16px",
            transform: "translateX(-50%)",
            width: "min(360px, calc(100% - 32px))",
            zIndex: 10,
          }}
        >
          <label
            htmlFor="problem-description"
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            Qual o problema neste ponto?
          </label>
          <input
            autoFocus
            id="problem-description"
            onChange={(event) => setProblemDescription(event.target.value)}
            placeholder="Digite o problema..."
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
              width: "100%",
            }}
            type="text"
            value={problemDescription}
          />
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              marginTop: "12px",
            }}
          >
            <button
              disabled={isSavingPoint}
              onClick={handleCancelPoint}
              type="button"
            >
              Cancelar
            </button>
            <button disabled={isSavingPoint} type="submit">
              {isSavingPoint ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
