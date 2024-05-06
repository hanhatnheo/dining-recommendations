import React from 'react';

export const Sidebar = ({ attractionsDetails }) => {
    if (attractionsDetails.length === 0) {
        return <div className="sidebar" style={sidebarStyle}>Click on attractions to see recommendations.</div>;
    }

    return (
        <div className="sidebar" style={sidebarStyle}>
            {attractionsDetails.map(({ attraction, recommendations }) => (
                <div key={attraction.attraction_id}>
                    <h4>{attraction.name}</h4>
                    <p>Type: {attraction.type}</p>
                    <h5>Recommended Restaurants:</h5>
                    {recommendations.length > 0 ? (
                <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>  
                    {recommendations.map(restaurant => (
                        <li key={restaurant.business_id} style={{
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <p style={{ fontWeight: 'bold', margin: '0', fontSize: '10px' }}>{restaurant.name} - {restaurant.stars} Stars</p>
                            <p style={{ margin: '5px 0' }}>{restaurant.address}</p>
                        </li>
                    ))}
                </ul>
            ) : <p>No recommendations available.</p>}
                </div>
            ))}
        </div>
    );
};

const sidebarStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '250px',
    height: '90%',
    backgroundColor: 'white',
    padding: '20px',
    overflowY: 'auto',
    zIndex: 2,
    color: 'black',
    fontSize: '12px'
};

