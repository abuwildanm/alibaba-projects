import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    bio: '',
    interests: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Parse interests from comma-separated string
    const interestsArray = formData.interests ? 
      formData.interests.split(',').map(i => i.trim()).filter(i => i) : [];

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          interests: interestsArray
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Successful registration
        onLogin(data.user, data.token);
        navigate('/discover');
      } else {
        // Error occurred
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '16px' }}>
            <Card.Header className="bg-gradient text-white text-center py-4" style={{
              background: 'linear-gradient(135deg, #e91e63, #9c27b0)',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <h3 className="mb-0">Create Your Profile</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="border-radius-10"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="border-radius-10"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="border-radius-10"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    className="border-radius-10"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border-radius-10"
                    disabled={loading}
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
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    className="border-radius-10"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formInterests">
                  <Form.Label>Interests</Form.Label>
                  <Form.Control
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="Add your interests (comma separated)"
                    className="border-radius-10"
                    disabled={loading}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" disabled={loading}>
                  {loading ? 'Creating Profile...' : 'Create Profile'}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center bg-light" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <p className="mb-0">
                Already have an account? <a href="/login">Log in</a>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;