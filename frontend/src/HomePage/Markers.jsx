import { UseMap } from "./UseMap";
import { Marker, Popup, useMap } from "react-map-gl";
import { useState, useEffect, useCallback } from "react";
import config from '../../../server/config.json';
import { MarkerIcon, RestaurantIcon } from './MarkerIcon';
import svg from '../assets/restaurant-icon.svg';

import axios from 'axios';
import './Markers.css';

const URLPREFIX = `http://${config.server_host}:${config.server_port}/`;

export const Markers = () => {
    const { bounds } = UseMap();
    const [markers, setMarkers] = useState([]);
    const [selectedMarkers, setSelectedMarkers] = useState([]);
    const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
    const [zoom, setZoom] = useState(5);

    const { current: map } = useMap();


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
          setMarkers(response.data.slice(0, zoom * 40));
          console.log(response.data); 
        } catch (error) {
          console.error('Error fetching attractions', error);
        }
       }, [bounds]);

    const handleMarkerClick = (marker) => {
        setSelectedMarkers(selectedMarkers.concat(marker));
    };

    const showRestaurant = async (marker) => {
        const id = marker.attraction_id;
            const response = await axios.get(`${URLPREFIX}restaurant_recommendations/id`, {
                params: { id },
                mode: 'no-cors'
            });
        setRecommendedRestaurants(recommendedRestaurants.concat(response.data))
        console.log(recommendedRestaurants);
    }

    useEffect(() => {
        console.log(selectedMarkers)
    }, [selectedMarkers])

    useEffect(() => {
        console.log(recommendedRestaurants)
    }, [recommendedRestaurants])

    useEffect(() => {
        fetchDataInBounds(bounds);
    }, [bounds]);

    useEffect(() => {
        if (map) {
            setZoom(map.getZoom());
        }
    }, [map, map.getZoom()]);

    return (
        <>
            {markers.map(({ ...marker }) => {
                return(
                    <Marker onClick={(event) => {
                        handleMarkerClick(marker)
                        showRestaurant(marker)
                    }} key={marker.attraction_id} latitude={marker.latitude} longitude={marker.longitude} offsetLeft={-17.5} offsetTop={-38}>
                    <MarkerIcon />
                    </Marker>
                )}
            )}
            {selectedMarkers.map((selectedMarker) => (
                <Popup
                    key={selectedMarker.key}
                    latitude={selectedMarker.latitude}
                    longitude={selectedMarker.longitude}
                    offsetTop={-20}
                    offsetLeft={-20}
                    closeButton={true}
                    onClose={() => {
                        setSelectedMarkers(selectedMarkers.filter(marker => marker.name !== selectedMarker.name && marker.latitude !== selectedMarker.latitude && marker.longitude !== selectedMarker.longitude))
                        setRecommendedRestaurants(recommendedRestaurants.filter(marker => marker.attraction_id !== selectedMarker.attraction_id))
                    }}
                    closeOnClick={false}
                    anchor="top">
                        <div style={{ padding: '10px', borderRadius: '10px', color: 'black' }}>
                            <h3>{selectedMarker.name}</h3>
                                <span>Type: {selectedMarker.type}</span>
                                <span>Website: {selectedMarker.website}</span>
                                <span>Address: {selectedMarker.address}</span>
                        </div>
                </Popup>
            )
            )}
            {recommendedRestaurants.map(({ ...restaurant }) => {
                return (
                <Marker key={restaurant.business_id} latitude={restaurant.latitude} longitude={restaurant.longitude} offsetLeft={-17.5} offsetTop={-38}>
                <RestaurantIcon src={svg} />
                </Marker>
                )}
            )}
        </>
    )
}