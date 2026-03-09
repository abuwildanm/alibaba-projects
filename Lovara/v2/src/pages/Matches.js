import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

function Matches() {
  const [matches, setMatches] = useState([]);

  // Mock data for matches
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockMatches = [
        {
          id: '1',
          name: 'Sarah',
          age: 26,
          bio: 'Loves hiking and photography. Looking for someone to explore the world with.',
          lastActive: 'Online now',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          mutualInterests: ['Travel', 'Photography', 'Hiking'],
          commonConnections: 2,
          matchPercentage: 92
        },
        {
          id: '2',
          name: 'Michael',
          age: 29,
          bio: 'Foodie and coffee enthusiast. Enjoy trying new restaurants and cafes.',
          lastActive: '2 hours ago',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          mutualInterests: ['Cooking', 'Coffee', 'Movies'],
          commonConnections: 1,
          matchPercentage: 85
        },
        {
          id: '3',
          name: 'Emma',
          age: 24,
          bio: 'Artist and book lover. Passionate about creativity and literature.',
          lastActive: 'Online now',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          mutualInterests: ['Art', 'Reading', 'Music'],
          commonConnections: 3,
          matchPercentage: 97
        },
        {
          id: '4',
          name: 'David',
          age: 31,
          bio: 'Fitness enthusiast and tech geek. Love staying active and learning new things.',
          lastActive: 'Yesterday',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          mutualInterests: ['Gym', 'Technology', 'Gaming'],
          commonConnections: 0,
          matchPercentage: 78
        }
      ];

      setMatches(mockMatches);
    }, 1000);
  }, []);

  return (
    <Container className="py-4">
      <Row>
        <Col md={12}>
          <h3 className="mb-4 text-gradient">Your Matches</h3>

          {matches.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-heart text-danger" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3">No matches yet</h4>
              <p className="text-muted">Start swiping to find your perfect match!</p>
              <Button variant="primary" href="/discover" className="px-4 py-2">
                Discover People
              </Button>
            </div>
          ) : (
            <Row>
              {matches.map((match) => (
                <Col key={match.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="h-100 shadow-sm text-center border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={match.avatar}
                        className="rounded-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <Badge
                        bg="success"
                        className="position-absolute top-0 end-0 m-2"
                        style={{ borderRadius: '12px', padding: '5px 10px' }}
                      >
                        {match.matchPercentage}% Match
                      </Badge>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-gradient">{match.name}, {match.age}</Card.Title>
                      <Card.Text className="flex-grow-1">
                        {match.bio.substring(0, 80)}...
                      </Card.Text>

                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="fas fa-circle text-success me-1"></i>
                          {match.lastActive}
                        </small>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="fas fa-users me-1"></i>
                          {match.commonConnections} common connections
                        </small>
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex flex-wrap justify-content-center gap-1 mb-3">
                          {match.mutualInterests.slice(0, 3).map((interest, idx) => (
                            <Badge key={idx} bg="primary" className="px-2 py-1">
                              {interest}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          variant="outline-success"
                          className="w-100 py-2"
                          href={`/messages?userId=${match.id}`}
                        >
                          <i className="fas fa-comment me-2"></i>Message
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Matches;