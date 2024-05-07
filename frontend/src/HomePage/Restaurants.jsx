import { UseMap } from "./UseMap";
import { Marker, Popup } from "react-map-gl";
import React, { useState, useEffect, useCallback } from "react";
import config from '../../../server/config.json';
import svg from '../assets/restaurant-icon.svg';
import { RestaurantIcon } from './MarkerIcon';

import axios from 'axios';

const URLPREFIX = //`http://${config.server_host}:${config.server_port}/`;
                `https://exploreeat.fly.dev/`; // deployed back-end

export const Restaurants = () => {
    const { bounds } = UseMap();
    const [markers, setMarkers] = useState([]);
    const [selectedRestaurants, setSelectedRestaurants] = useState([]);

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
        }
       }, [bounds]);

    const handleRestaurantClick = (marker) => {
        setSelectedRestaurants(selectedRestaurants.concat(marker));
    };


    useEffect(() => {
        fetchDataInBounds(bounds);
    }, [bounds])

    useEffect(() => {
        console.log(selectedRestaurants)
    }, [selectedRestaurants])

    return (
        <>
        {markers.map(({ ...marker }) => {
            return (
            <Marker onClick={(event) => {
                handleRestaurantClick(marker)
            }} key={marker.business_id} latitude={marker.latitude} longitude={marker.longitude} offsetLeft={-17.5} offsetTop={-38}>
            <RestaurantIcon src={svg} />
            </Marker>
            )})}
        {selectedRestaurants.map((r) => (
                <Popup
                    key={r.key}
                    latitude={r.latitude}
                    longitude={r.longitude}
                    offsetTop={-20}
                    offsetLeft={-20}
                    closeButton={true}
                    onClose={() => {
                        setSelectedRestaurants(selectedRestaurants.filter(marker => r.id !== marker.id && marker.latitude !== r.latitude && marker.longitude !== r.longitude))
                    }}
                    closeOnClick={false}
                    anchor="top">
                        <div style={{ padding: '10px', borderRadius: '10px', color: 'black' }}>
                            <h3>{r.name}</h3> 
                                <span>Stars: {r.stars}</span>
                                <div>
                            {r.food_score && <span>Food Score: {r.food_score}</span>}
                            {r.drink_score && <span>, Drink Score: {r.drink_score}</span>}
                            <br/>
                            {r.service_score && <span>Service Score: {r.service_score}</span>}
                            {r.value_score && <span>, Value Score: {r.value_score}</span>}
                            </div>
                            <span>Address: {r.address}</span>
                        </div>
                </Popup>
            )
            )}
        </>
    )
}