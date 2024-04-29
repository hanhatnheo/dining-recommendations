import React from 'react';

const Navbar = () => {
  const navbarStyles = {
    backgroundColor: '#333',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
  };

  const linkStyles = {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '18px',
  };


  //maybe replace this with logo image later
  const brandStyles = {
    color: '#fff',
    fontFamily: 'Arial, sans-serif', 
    fontSize: '24px',
    fontWeight: 'bold',
  };

  return (
    <nav style={navbarStyles}>
      <div style={brandStyles}>Penn Eats</div>
      <ul style={{ listStyle: 'none', display: 'flex', alignItems: 'center' }}>
        <li>
          <a href="#" style={linkStyles}>
            All Restaurants
          </a>
        </li>
        <li>
          <a href="#" style={linkStyles}>
            Leaderboards
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;