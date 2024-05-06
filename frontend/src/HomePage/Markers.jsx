import { UseMap } from "./UseMap";
import { Marker, Popup, useMap } from "react-map-gl";
import { useState, useEffect, useCallback } from "react";
import config from '../../../server/config.json';
import { MarkerIcon, RestaurantIcon } from './MarkerIcon';
import svg from '../assets/restaurant-icon.svg';

import axios from 'axios';
import './Markers.css';

const URLPREFIX = `http://${config.server_host}:${config.server_port}/`;

export const Markers = ({ attractionsDetails, setAttractionsDetails }) => {
    const { bounds } = UseMap();
    const [markers, setMarkers] = useState([]);
    const [selectedMarkers, setSelectedMarkers] = useState([]);
    const [selectedRestaurants, setSelectedRestaurants] = useState([]);
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

    const handleRestaurantClick = (marker) => {
        setSelectedRestaurants(selectedRestaurants.concat(marker));
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

    const updateAttractionDetails = useCallback(() => {
        const newAttractionsDetails = selectedMarkers.map(marker => {
            const existingDetails = attractionsDetails.find(detail => detail.attraction.attraction_id === marker.attraction_id);
    
            if (existingDetails) {
                const existingRecIds = new Set(existingDetails.recommendations.map(rec => rec.business_id));
                const newRecommendations = recommendedRestaurants.filter(restaurant => {
                    return restaurant.attraction_id === marker.attraction_id && !existingRecIds.has(restaurant.business_id);
                });
                return {
                    attraction: existingDetails.attraction,
                    recommendations: [...existingDetails.recommendations, ...newRecommendations]
                };
            } else {
                const recommendations = recommendedRestaurants.filter(restaurant => restaurant.attraction_id === marker.attraction_id);
                return {
                    attraction: marker,
                    recommendations
                };
            }
        });
    
        setAttractionsDetails(newAttractionsDetails);
    }, [selectedMarkers, recommendedRestaurants, attractionsDetails]);    
    

    useEffect(() => {
        console.log(selectedMarkers)
    }, [selectedMarkers])

    useEffect(() => {
        console.log(selectedRestaurants)
    }, [selectedRestaurants])

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

    useEffect(() => {
        if (attractionsDetails.length > 0) {
            setAttractionsDetails([]);
        }
        updateAttractionDetails();
    }, [recommendedRestaurants]);

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
                        <div style={{ padding: '10px', borderRadius: '10px', color: 'black', overflowWrap: 'break-word', wordWrap: 'break-word'  }}>
                            <h3>{selectedMarker.name}</h3>
                                <span>Type: {selectedMarker.type}</span>
                                <span>Website: {selectedMarker.website && selectedMarker.website !== 'Unknown' ? 
                                    <a href={selectedMarker.website} target="_blank" rel="noopener noreferrer">{selectedMarker.website}</a> :
                                    ' Unknown'
                                }</span>
                                <span>Address: {selectedMarker.address}</span>
                        </div>
                </Popup>
            )
            )}
            {recommendedRestaurants.map(({ ...restaurant }) => {
                return (
                <Marker onClick={(event) => {
                    handleRestaurantClick(restaurant)
                }} key={restaurant.business_id} latitude={restaurant.latitude} longitude={restaurant.longitude} offsetLeft={-17.5} offsetTop={-38}>
                <RestaurantIcon src={svg} />
                </Marker>
                )}
            )}
            {selectedRestaurants.map((r) => (
                <Popup
                    key={r.key}
                    latitude={r.latitude}
                    longitude={r.longitude}
                    offsetTop={-20}
                    offsetLeft={-20}
                    closeButton={true}
                    onClose={() => {
                        setSelectedMarkers(r.filter(marker => marker.name !== r.name && marker.latitude !== r.latitude && marker.longitude !== r.longitude))
                    }}
                    closeOnClick={false}
                    anchor="top">
                        <div style={{ padding: '10px', borderRadius: '10px', color: 'black' }}>
                            <h3>{r.name}</h3> 
                                <span>Stars: {r.stars}</span>
                                <span>Address: {r.address}</span>
                        </div>
                </Popup>
            )
            )}
        </>
    )
}