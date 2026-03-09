import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import ReactPlayer from 'react-player';

function VideoChat() {
  const [activeCall, setActiveCall] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, active, ended
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      status: 'online',
      lastSeen: 'Online now'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      status: 'online',
      lastSeen: 'Online now'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      status: 'away',
      lastSeen: 'Last seen 2 hours ago'
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      status: 'offline',
      lastSeen: 'Last seen yesterday'
    }
  ]);

  const [callDuration, setCallDuration] = useState(0);
  const durationInterval = useRef(null);

  useEffect(() => {
    if (callStatus === 'active') {
      durationInterval.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    }

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [callStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = (contact) => {
    setSelectedContact(contact);
    setCallStatus('connecting');
    setActiveCall(true);

    // Simulate connection delay
    setTimeout(() => {
      setCallStatus('active');
    }, 2000);
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setActiveCall(false);
      setCallStatus('idle');
      setSelectedContact(null);
      setCallDuration(0);
    }, 1000);
  };

  const acceptCall = () => {
    setCallStatus('active');
  };

  const declineCall = () => {
    setCallStatus('idle');
    setActiveCall(false);
    setSelectedContact(null);
  };

  return (
    <Container fluid className="video-container">
      {!activeCall ? (
        <>
          <Row className="mb-4">
            <Col>
              <h2>Video Chat</h2>
              <p className="text-light">Connect with your matches face-to-face</p>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Card className="bg-dark text-white">
                <Card.Header className="bg-secondary">
                  <h5 className="mb-0">Contacts</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="list-group list-group-flush">
                    {contacts.map(contact => (
                      <div 
                        key={contact.id}
                        className="list-group-item bg-dark text-white d-flex align-items-center"
                      >
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="rounded-circle me-3"
                          width="40"
                          height="40"
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <h6 className="mb-0">{contact.name}</h6>
                            <span className={`badge ${contact.status === 'online' ? 'bg-success' : contact.status === 'away' ? 'bg-warning' : 'bg-secondary'}`}>
                              {contact.status}
                            </span>
                          </div>
                          <small className="text-muted">{contact.lastSeen}</small>
                        </div>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => startCall(contact)}
                          disabled={contact.status !== 'online'}
                        >
                          <i className="fas fa-video me-1"></i> Call
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              <Card className="bg-dark text-white h-100">
                <Card.Body className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                  <div className="text-center">
                    <i className="fas fa-video fa-3x text-primary mb-3"></i>
                    <h4>Select a contact to start a video call</h4>
                    <p className="text-muted">Connect with your matches for a more personal experience</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        // Video Call Interface
        <div className="video-call-area">
          <div className="main-video bg-black d-flex align-items-center justify-content-center">
            {callStatus === 'connecting' && (
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <h5>Connecting to {selectedContact?.name}...</h5>
              </div>
            )}
            {callStatus === 'active' && (
              <>
                <div className="position-absolute top-0 start-0 m-4 bg-dark bg-opacity-75 text-white px-3 py-2 rounded">
                  <h5 className="mb-0">{selectedContact?.name}</h5>
                  <small>{formatTime(callDuration)}</small>
                </div>
                <ReactPlayer
                  url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  playing
                  muted
                  width="100%"
                  height="100%"
                  controls={false}
                />
              </>
            )}
            {callStatus === 'ended' && (
              <div className="text-center">
                <i className="fas fa-phone-slash fa-3x text-danger mb-3"></i>
                <h5>Call Ended</h5>
                <p className="text-muted">Call with {selectedContact?.name} has ended</p>
              </div>
            )}
          </div>

          <div className="user-video bg-black d-flex align-items-center justify-content-center">
            <div className="text-center text-white">
              <img
                src="https://randomuser.me/api/portraits/women/12.jpg"
                alt="Your video"
                className="rounded-circle mb-2"
                width="80"
                height="80"
              />
              <p>You</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Controls */}
      {activeCall && callStatus === 'active' && (
        <div className="video-controls">
          <button className="video-btn">
            <i className="fas fa-microphone"></i>
          </button>
          <button className="video-btn">
            <i className="fas fa-video"></i>
          </button>
          <button className="video-btn end-call" onClick={endCall}>
            <i className="fas fa-phone"></i>
          </button>
          <button className="video-btn">
            <i className="fas fa-volume-up"></i>
          </button>
          <button className="video-btn">
            <i className="fas fa-cog"></i>
          </button>
        </div>
      )}

      {/* Incoming Call Modal */}
      {callStatus === 'ringing' && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75">
          <div className="text-center text-white">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Caller"
              className="rounded-circle mb-3"
              width="100"
              height="100"
            />
            <h5>Sarah Johnson is calling you</h5>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button variant="danger" size="lg" onClick={declineCall}>
                <i className="fas fa-phone"></i>
              </Button>
              <Button variant="success" size="lg" onClick={acceptCall}>
                <i className="fas fa-phone"></i>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default VideoChat;