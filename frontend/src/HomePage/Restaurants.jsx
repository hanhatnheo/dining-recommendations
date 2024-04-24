import { UseMap } from "./UseMap";
import { Marker } from "react-map-gl";
import { useState, useEffect, useCallback } from "react";
import config from '../../../server/config.json';
import svg from '../assets/restaurant-icon.svg';
import { RestaurantIcon } from './MarkerIcon';

import axios from 'axios';

const URLPREFIX = `http://${config.server_host}:${config.server_port}/`;

export const Restaurants = () => {
    const { bounds } = UseMap();
    const [markers, setMarkers] = useState([]);

    const fetchDataInBounds = useCallback(async (bounds) => {
        try {
            const boundsArray = bounds.toArray()
            const minLat = parseFloat(boundsArray[0][1]);
            const minLng = parseFloat(boundsArray[0][0]);
            const maxLng = parseFloat(boundsArray[1][0]);
            const maxLat = parseFloat(boundsArray[1][1]);
            const response = await axios.get(`${URLPREFIX}all_restaurants/current`, {
                params: { minLat, minLng, maxLat, maxLng }
            });
          setMarkers(response.data);
          console.log(response.data); 
        } catch (error) {
          console.error('Error fetching restaurants', error);
        }
       }, [bounds]);


    useEffect(() => {
        fetchDataInBounds(bounds);
    }, [bounds])

    
    return (
        <>
        {markers.map(({ ...marker }) => {
            return (
            <Marker key={marker.business_id} latitude={marker.latitude} longitude={marker.longitude} offsetLeft={-17.5} offsetTop={-38}>
            <RestaurantIcon src={svg} />
            </Marker>
            )})}
        </>
    )
}