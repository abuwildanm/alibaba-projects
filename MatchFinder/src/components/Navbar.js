import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function NavigationBar({ currentUser, setCurrentUser }) {
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('appSettings');
    setCurrentUser(null);
  };

  return (
    <Navbar bg="light" expand="lg" className="navbar-custom mb-4">
      <Container>
        <LinkContainer to="/discover">
          <Navbar.Brand className="text-white">
            <i className="fas fa-heart me-2"></i>MatchFinder
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/discover">
              <Nav.Link className="text-white">
                <i className="fas fa-compass me-1"></i>Discover
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/matches">
              <Nav.Link className="text-white">
                <i className="fas fa-heart me-1"></i>Matches
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/messages">
              <Nav.Link className="text-white">
                <i className="fas fa-comment me-1"></i>Messages
              </Nav.Link>
            </LinkContainer>
          </Nav>
          
          <Nav>
            <NavDropdown 
              title={
                <span>
                  <img 
                    src={currentUser?.profilePic || `https://randomuser.me/api/portraits/${currentUser?.gender === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`} 
                    alt="Profile" 
                    className="rounded-circle me-2" 
                    width="30" 
                    height="30" 
                  />
                  {currentUser?.name || 'User'}
                </span>
              } 
              id="basic-nav-dropdown"
              align="end"
            >
              <LinkContainer to="/profile">
                <NavDropdown.Item>
                  <i className="fas fa-user me-2"></i>Profile
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/settings">
                <NavDropdown.Item>
                  <i className="fas fa-cog me-2"></i>Settings
                </NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;