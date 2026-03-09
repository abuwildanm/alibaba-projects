import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';

function Events() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'social'
  });

  // Mock data for events
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: 'Coffee Meetup',
        date: '2026-03-15',
        time: '15:00',
        location: 'Central Park Cafe',
        description: 'Join us for a casual coffee meetup to meet new friends',
        category: 'social',
        attendees: 12,
        image: 'https://picsum.photos/300/200?random=1'
      },
      {
        id: 2,
        title: 'Hiking Adventure',
        date: '2026-03-20',
        time: '09:00',
        location: 'Green Valley Trail',
        description: 'A scenic hike for outdoor enthusiasts',
        category: 'adventure',
        attendees: 8,
        image: 'https://picsum.photos/300/200?random=2'
      },
      {
        id: 3,
        title: 'Board Game Night',
        date: '2026-03-25',
        time: '19:00',
        location: 'Game Hub Downtown',
        description: 'Fun night with board games and snacks',
        category: 'entertainment',
        attendees: 6,
        image: 'https://picsum.photos/300/200?random=3'
      },
      {
        id: 4,
        title: 'Photography Walk',
        date: '2026-03-28',
        time: '16:00',
        location: 'Botanical Gardens',
        description: 'Capture beautiful moments with fellow photographers',
        category: 'hobby',
        attendees: 5,
        image: 'https://picsum.photos/300/200?random=4'
      }
    ];
    
    setEvents(mockEvents);
  }, []);

  const handleCreateEvent = () => {
    const event = {
      ...newEvent,
      id: events.length + 1,
      attendees: 0,
      image: `https://picsum.photos/300/200?random=${events.length + 5}`
    };
    
    setEvents([...events, event]);
    setShowModal(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      category: 'social'
    });
  };

  const handleJoinEvent = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, attendees: event.attendees + 1 } 
        : event
    ));
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Events & Activities</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus me-2"></i>Create Event
            </Button>
          </div>
          <p className="text-muted">Join events to meet people with similar interests</p>
        </Col>
      </Row>

      <Row>
        {events.map(event => (
          <Col key={event.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="event-card h-100">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={event.image} 
                  style={{ height: '160px', objectFit: 'cover' }} 
                />
                <div className="event-date position-absolute top-0 start-0 m-3">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-primary">{event.category}</span>
                  <small className="text-muted">
                    <i className="fas fa-user-friends me-1"></i> {event.attendees}
                  </small>
                </div>
                <Card.Title className="mb-2">{event.title}</Card.Title>
                <Card.Text className="flex-grow-1 text-muted">
                  {event.description.substring(0, 80)}...
                </Card.Text>
                
                <div className="mt-auto">
                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i> {event.time}
                    </small>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="fas fa-map-marker-alt me-1"></i> {event.location}
                    </small>
                  </div>
                  
                  <Button 
                    variant="outline-primary" 
                    className="w-100"
                    onClick={() => handleJoinEvent(event.id)}
                  >
                    Join Event
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Enter event title"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Date & Time</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
                <Form.Control
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="Enter event location"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newEvent.category}
                onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
              >
                <option value="social">Social</option>
                <option value="adventure">Adventure</option>
                <option value="hobby">Hobby</option>
                <option value="entertainment">Entertainment</option>
                <option value="food">Food & Drink</option>
                <option value="fitness">Fitness</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Describe your event"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateEvent}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Events;