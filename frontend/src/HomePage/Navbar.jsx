import React from 'react';
import { Link } from 'react-router-dom';

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

  /*
  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='PennEats' isMain />
          <NavText href='/restaurants' text='All Restaurants' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
<NavText href='/songs' text='SONGS' /> this goes under 'All Restaurants'
*/
            
return (
    <nav style={navbarStyles}>
      <div style={brandStyles}>Penn Eats</div>
      <ul style={{ listStyle: 'none', display: 'flex', alignItems: 'center' }}>
        <li>
          <Link to="/" style={linkStyles}>
            Map
          </Link>
        </li>
        <li>
          <a href="/restaurants" style={linkStyles}>
            Search Restaurants
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;