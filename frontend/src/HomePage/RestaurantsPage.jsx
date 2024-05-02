import React, { useState } from 'react';
import GradientSlider from './GradientSlider';
import LazyTable from './LazyTable';

const RestaurantsPage = () => {
  // ...

  return (
    <div>
      <div>
        <GradientSlider
          label="Distance"
          min={0}
          max={10}
          step={0.1}
          value={5}
          onChange={(value) => console.log('Distance:', value)}
        />
        // add other components 
      </div>
      <div>
        <LazyTable
          route="/api/restaurants"
          columns={[
            { headerName: 'Name', field: 'name' },
            { headerName: 'Distance', field: 'distance' },
            { headerName: 'Ratings', field: 'ratings' },
            { headerName: 'Value', field: 'value' },
            { headerName: 'Ambiance', field: 'ambiance' },
            { headerName: 'Food', field: 'food' },
            { headerName: 'Service', field: 'service' },
          ]}
          defaultPageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </div>
    </div>
  );
};

export default RestaurantsPage;