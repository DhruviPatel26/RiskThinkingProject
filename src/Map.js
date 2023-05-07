import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const greenMarkerIcon = L.icon({
    iconUrl: '/icons/green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -40],
});

const yellowMarkerIcon = L.icon({
    iconUrl: "/icons/yellow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -40],
});

const redMarkerIcon = L.icon({
    iconUrl: "/icons/red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -40],
});
function Map({ locations, setSelectedLocation }) {
    const mapRef = useRef(null);

    useEffect(() => {
        // Initialize Leaflet map
        const map = L.map(mapRef.current).setView([50, -100], 4);

        // Load and set up the tile layer
        const tiles = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                maxZoom: 18,
            }
        );
        tiles.addTo(map);

        // Add location markers to the map
        locations.forEach((loc) => {
            const { Lat, Long, "Risk Rating": risk } = loc;

            // Set marker icon based on risk rating
            let markerIcon;

            if (risk < 0.33) {
                markerIcon = greenMarkerIcon;
            } else if (risk < 0.67) {
                markerIcon = yellowMarkerIcon;
            } else {
                markerIcon = redMarkerIcon;
            }

            // Create marker and add to map
            const marker = L.marker([Lat, Long], { icon: markerIcon }).on('click', () => {
                console.log(Lat);
                setSelectedLocation([Lat, Long]);
            });
            marker.bindPopup(
                `<strong>${loc["Asset Name"]}</strong><br/>
                Category: ${loc["Business Category"]}<br/>
                Risk Rating: ${loc["Risk Rating"]}`
            );

            marker.addTo(map);
        });

        return () => {
            map.remove();
        };
    }, [locations]);

    return <div id="map" style={{ height: "80vh" }} ref={mapRef}></div>;
}
export default Map; 