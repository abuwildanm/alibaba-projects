import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Accordion } from 'react-bootstrap';

function Settings({ user }) {
  const [settings, setSettings] = useState({
    notifications: {
      likes: true,
      matches: true,
      messages: true,
      events: false
    },
    privacy: {
      showMe: true,
      showDistance: true,
      showAge: true,
      profileVerification: false
    },
    discovery: {
      ageRange: { min: 18, max: 50 },
      distance: 50,
      showOnlyOnline: false,
      genderPreference: 'all'
    },
    account: {
      emailNotifications: true,
      SMSNotifications: false,
      deleteAccount: false
    }
  });
  
  const [message, setMessage] = useState('');

  // Load settings from localStorage if available
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleNotificationChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const handlePrivacyChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: !prev.privacy[setting]
      }
    }));
  };

  const handleDiscoveryChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      discovery: {
        ...prev.discovery,
        [setting]: value
      }
    }));
  };

  const handleAccountChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        [setting]: !prev.account[setting]
      }
    }));
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setMessage('Settings saved successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      notifications: {
        likes: true,
        matches: true,
        messages: true,
        events: false
      },
      privacy: {
        showMe: true,
        showDistance: true,
        showAge: true,
        profileVerification: false
      },
      discovery: {
        ageRange: { min: 18, max: 50 },
        distance: 50,
        showOnlyOnline: false,
        genderPreference: 'all'
      },
      account: {
        emailNotifications: true,
        SMSNotifications: false,
        deleteAccount: false
      }
    };
    
    setSettings(defaultSettings);
    setMessage('Settings reset to default!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Settings & Preferences</h4>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success" className="mb-4">{message}</Alert>}
              
              <Accordion defaultActiveKey={['0']} alwaysOpen>
                {/* Notification Settings */}
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <i className="fas fa-bell me-2"></i> Notifications
                  </Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Check 
                        type="switch"
                        id="notify-likes"
                        label="Notify me when someone likes my profile"
                        checked={settings.notifications.likes}
                        onChange={() => handleNotificationChange('notifications', 'likes')}
                      />
                      <Form.Check 
                        type="switch"
                        id="notify-matches"
                        label="Notify me when I get a match"
                        checked={settings.notifications.matches}
                        onChange={() => handleNotificationChange('notifications', 'matches')}
                      />
                      <Form.Check 
                        type="switch"
                        id="notify-messages"
                        label="Notify me when I receive a message"
                        checked={settings.notifications.messages}
                        onChange={() => handleNotificationChange('notifications', 'messages')}
                      />
                      <Form.Check 
                        type="switch"
                        id="notify-events"
                        label="Notify me about special events and promotions"
                        checked={settings.notifications.events}
                        onChange={() => handleNotificationChange('notifications', 'events')}
                      />
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
                
                {/* Privacy Settings */}
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <i className="fas fa-lock me-2"></i> Privacy
                  </Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Check 
                        type="switch"
                        id="privacy-show-me"
                        label="Show me on other people's recommendations"
                        checked={settings.privacy.showMe}
                        onChange={() => handlePrivacyChange('showMe')}
                      />
                      <Form.Check 
                        type="switch"
                        id="privacy-show-distance"
                        label="Show my distance from other users"
                        checked={settings.privacy.showDistance}
                        onChange={() => handlePrivacyChange('showDistance')}
                      />
                      <Form.Check 
                        type="switch"
                        id="privacy-show-age"
                        label="Show my age to other users"
                        checked={settings.privacy.showAge}
                        onChange={() => handlePrivacyChange('showAge')}
                      />
                      <Form.Check 
                        type="switch"
                        id="privacy-profile-verification"
                        label="Enable profile verification badge"
                        checked={settings.privacy.profileVerification}
                        onChange={() => handlePrivacyChange('profileVerification')}
                      />
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
                
                {/* Discovery Settings */}
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <i className="fas fa-search me-2"></i> Discovery Preferences
                  </Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Age Range: {settings.discovery.ageRange.min} - {settings.discovery.ageRange.max}</Form.Label>
                        <div className="d-flex gap-3">
                          <Form.Group>
                            <Form.Label>Min Age</Form.Label>
                            <Form.Control 
                              type="range" 
                              min="18" 
                              max="100" 
                              value={settings.discovery.ageRange.min} 
                              onChange={(e) => handleDiscoveryChange('ageRange', {...settings.discovery.ageRange, min: parseInt(e.target.value)})}
                            />
                            <div>{settings.discovery.ageRange.min}</div>
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Max Age</Form.Label>
                            <Form.Control 
                              type="range" 
                              min="18" 
                              max="100" 
                              value={settings.discovery.ageRange.max} 
                              onChange={(e) => handleDiscoveryChange('ageRange', {...settings.discovery.ageRange, max: parseInt(e.target.value)})}
                            />
                            <div>{settings.discovery.ageRange.max}</div>
                          </Form.Group>
                        </div>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Maximum Distance: {settings.discovery.distance} km</Form.Label>
                        <Form.Control 
                          type="range" 
                          min="1" 
                          max="100" 
                          value={settings.discovery.distance} 
                          onChange={(e) => handleDiscoveryChange('distance', parseInt(e.target.value))}
                        />
                        <div>{settings.discovery.distance} km</div>
                      </Form.Group>
                      
                      <Form.Check 
                        type="switch"
                        id="discovery-online-only"
                        label="Show only online users"
                        checked={settings.discovery.showOnlyOnline}
                        onChange={() => handleDiscoveryChange('showOnlyOnline', !settings.discovery.showOnlyOnline)}
                      />
                      
                      <Form.Group className="mt-3">
                        <Form.Label>Gender Preference</Form.Label>
                        <Form.Select 
                          value={settings.discovery.genderPreference}
                          onChange={(e) => handleDiscoveryChange('genderPreference', e.target.value)}
                        >
                          <option value="all">All genders</option>
                          <option value="male">Men only</option>
                          <option value="female">Women only</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
                
                {/* Account Settings */}
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <i className="fas fa-user-cog me-2"></i> Account Settings
                  </Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Check 
                        type="switch"
                        id="account-email-notifications"
                        label="Receive email notifications"
                        checked={settings.account.emailNotifications}
                        onChange={() => handleAccountChange('emailNotifications')}
                      />
                      <Form.Check 
                        type="switch"
                        id="account-sms-notifications"
                        label="Receive SMS notifications"
                        checked={settings.account.SMSNotifications}
                        onChange={() => handleAccountChange('SMSNotifications')}
                      />
                      
                      <hr />
                      
                      <h6>Danger Zone</h6>
                      <Button variant="outline-danger" className="mt-2">
                        Deactivate Account
                      </Button>
                      <p className="text-muted mt-1" style={{ fontSize: '0.9em' }}>
                        Your account will be deactivated temporarily. You can reactivate anytime.
                      </p>
                      
                      <Button variant="outline-danger" className="mt-2">
                        Delete Account Permanently
                      </Button>
                      <p className="text-muted mt-1" style={{ fontSize: '0.9em' }}>
                        This action cannot be undone. All your data will be deleted permanently.
                      </p>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              
              <div className="d-flex gap-2 mt-4">
                <Button variant="primary" onClick={handleSave}>
                  Save Settings
                </Button>
                <Button variant="outline-secondary" onClick={handleReset}>
                  Reset to Default
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;