import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';

function Profile({ user }) {
  const [userData, setUserData] = useState(user || {});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFormData({
      name: userData.name || '',
      age: userData.age || '',
      bio: userData.bio || '',
      interests: userData.interests || '',
      gender: userData.gender || '',
      email: userData.email || ''
    });
  }, [userData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Update user data
    const updatedUser = {
      ...userData,
      ...formData
    };

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update parent state
    setUserData(updatedUser);
    setEditMode(false);
    setMessage('Profile updated successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset form data to original values
    setFormData({
      name: userData.name || '',
      age: userData.age || '',
      bio: userData.bio || '',
      interests: userData.interests || '',
      gender: userData.gender || '',
      email: userData.email || ''
    });
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>My Profile</h4>
              {!editMode && (
                <Button variant="outline-primary" onClick={() => setEditMode(true)}>
                  <i className="fas fa-edit me-2"></i>Edit Profile
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              
              <Tabs
                id="profile-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="profile" title="Profile Info">
                  <Row>
                    <Col md={4} className="text-center">
                      <img 
                        src={userData.profilePic || `https://randomuser.me/api/portraits/${userData.gender === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`} 
                        alt="Profile" 
                        className="profile-image-large img-fluid rounded-circle mb-3" 
                      />
                      <h5>{userData.name}</h5>
                      <p className="text-muted">{userData.age ? `${userData.age} years old` : 'Age not specified'}</p>
                      
                      {editMode && (
                        <div className="mt-3">
                          <Button variant="secondary" size="sm" className="me-2">
                            <i className="fas fa-camera me-1"></i>Change Photo
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <i className="fas fa-images me-1"></i>Add Photos
                          </Button>
                        </div>
                      )}
                    </Col>
                    
                    <Col md={8}>
                      {editMode ? (
                        <Form>
                          <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3" controlId="formAge">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3" controlId="formGender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </Form.Select>
                          </Form.Group>
                          
                          <Form.Group className="mb-3" controlId="formBio">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3" controlId="formInterests">
                            <Form.Label>Interests (comma separated)</Form.Label>
                            <Form.Control
                              type="text"
                              name="interests"
                              value={formData.interests}
                              onChange={handleInputChange}
                              placeholder="e.g., Travel, Photography, Hiking"
                            />
                          </Form.Group>
                          
                          <div className="d-flex gap-2">
                            <Button variant="success" onClick={handleSave}>
                              Save Changes
                            </Button>
                            <Button variant="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </div>
                        </Form>
                      ) : (
                        <div>
                          <h6>About Me</h6>
                          <p>{userData.bio || 'No bio added yet.'}</p>
                          
                          <h6>Interests</h6>
                          <div className="d-flex flex-wrap">
                            {userData.interests ? (
                              userData.interests.split(',').map((interest, index) => (
                                <span key={index} className="badge bg-primary me-2 mb-2">
                                  {interest.trim()}
                                </span>
                              ))
                            ) : (
                              <p className="text-muted">No interests added yet.</p>
                            )}
                          </div>
                          
                          <hr />
                          
                          <h6>Additional Information</h6>
                          <p><strong>Email:</strong> {userData.email}</p>
                          <p><strong>Location:</strong> {userData.location || 'Not specified'}</p>
                          <p><strong>Distance:</strong> {userData.distance ? `${userData.distance} km away` : 'Not specified'}</p>
                          <p><strong>Status:</strong> <span className="text-success">{userData.lastActive}</span></p>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Tab>
                
                <Tab eventKey="photos" title="My Photos">
                  <Row>
                    {(userData.photos || []).map((photo, index) => (
                      <Col key={index} xs={6} md={3} className="mb-3">
                        <img 
                          src={photo} 
                          alt={`Profile photo ${index + 1}`} 
                          className="w-100 h-100 rounded" 
                          style={{ objectFit: 'cover', aspectRatio: '3/4' }} 
                        />
                        {editMode && (
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="mt-1 w-100"
                            onClick={() => {
                              const updatedPhotos = [...userData.photos];
                              updatedPhotos.splice(index, 1);
                              setUserData({...userData, photos: updatedPhotos});
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </Col>
                    ))}
                    
                    {editMode && (
                      <Col xs={6} md={3} className="mb-3 d-flex align-items-center justify-content-center">
                        <Button variant="outline-secondary">
                          <i className="fas fa-plus me-2"></i>Add Photo
                        </Button>
                      </Col>
                    )}
                  </Row>
                  
                  {!editMode && (!userData.photos || userData.photos.length === 0) && (
                    <p className="text-muted text-center">No photos added yet.</p>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;