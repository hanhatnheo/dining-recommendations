import { UseMap } from "./UseMap";
import { Marker, Popup } from "react-map-gl";
import { useState, useEffect, useCallback } from "react";
import config from '../../../server/config.json';
import { MarkerIcon } from './MarkerIcon';

import axios from 'axios';

const URLPREFIX = `http://${config.server_host}:${config.server_port}/`;

export const Markers = () => {
    const { bounds } = UseMap();
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);


    const fetchDataInBounds = useCallback(async (bounds) => {
        try {
            const boundsArray = bounds.toArray()
            const minLat = parseFloat(boundsArray[0][1]);
            const minLng = parseFloat(boundsArray[0][0]);
            const maxLng = parseFloat(boundsArray[1][0]);
            const maxLat = parseFloat(boundsArray[1][1]);
            const response = await axios.get(`${URLPREFIX}attractions/current`, {
                params: { minLat, minLng, maxLat, maxLng },
                mode: 'no-cors'
            });
          setMarkers(response.data);
          console.log(response.data); 
        } catch (error) {
          console.error('Error fetching attractions', error);
        }
       }, [bounds]);

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    useEffect(() => {
        console.log(selectedMarker)
    }, [selectedMarker])

    useEffect(() => {
        fetchDataInBounds(bounds);
    }, [bounds]);

    return (
        <>
        {markers.map(({ ...marker }) => {
            return(
            <Marker onClick={(event) => {
                handleMarkerClick(marker)
            }} key={marker.attraction_id} latitude={marker.latitude} longitude={marker.longitude} offsetLeft={-17.5} offsetTop={-38}>
            <MarkerIcon />
            </Marker>
        )}
            )}
            {
            selectedMarker ? (
                
                <Popup
                    key={selectedMarker.key}
                    latitude={selectedMarker.latitude}
                    longitude={selectedMarker.longitude}
                    closeOnClick={true}
                    offsetTop={-20}
                    offsetLeft={20}
                    closeButton={true}
                    onClose={() => setSelectedMarker(null)}
                    anchor="top">
                        <div style={{ background: 'white', padding: '10px', borderRadius: '10px' }}>
                            <h3>{selectedMarker.name}</h3>
                            "Hello World"
                        </div>
                </Popup>
            ) : null}
        </>
    )
}