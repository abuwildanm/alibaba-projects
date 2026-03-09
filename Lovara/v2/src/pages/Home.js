import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

function Home() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Mock data for potential matches
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProfiles = [
        {
          id: '1',
          name: 'Sarah',
          age: 26,
          bio: 'Loves hiking and photography. Looking for someone to explore the world with.',
          distance: 5,
          photos: [
            'https://randomuser.me/api/portraits/women/44.jpg',
            'https://picsum.photos/400/600?random=1',
            'https://picsum.photos/400/600?random=2'
          ],
          interests: ['Travel', 'Photography', 'Hiking']
        },
        {
          id: '2',
          name: 'Michael',
          age: 29,
          bio: 'Foodie and coffee enthusiast. Enjoy trying new restaurants and cafes.',
          distance: 8,
          photos: [
            'https://randomuser.me/api/portraits/men/32.jpg',
            'https://picsum.photos/400/600?random=3',
            'https://picsum.photos/400/600?random=4'
          ],
          interests: ['Cooking', 'Coffee', 'Movies']
        },
        {
          id: '3',
          name: 'Emma',
          age: 24,
          bio: 'Artist and book lover. Passionate about creativity and literature.',
          distance: 3,
          photos: [
            'https://randomuser.me/api/portraits/women/68.jpg',
            'https://picsum.photos/400/600?random=5',
            'https://picsum.photos/400/600?random=6'
          ],
          interests: ['Art', 'Reading', 'Music']
        },
        {
          id: '4',
          name: 'David',
          age: 31,
          bio: 'Fitness enthusiast and tech geek. Love staying active and learning new things.',
          distance: 12,
          photos: [
            'https://randomuser.me/api/portraits/men/22.jpg',
            'https://picsum.photos/400/600?random=7',
            'https://picsum.photos/400/600?random=8'
          ],
          interests: ['Gym', 'Technology', 'Gaming']
        },
        {
          id: '5',
          name: 'Lisa',
          age: 27,
          bio: 'Animal lover and volunteer. Passionate about helping others and making a difference.',
          distance: 7,
          photos: [
            'https://randomuser.me/api/portraits/women/33.jpg',
            'https://picsum.photos/400/600?random=9',
            'https://picsum.photos/400/600?random=10'
          ],
          interests: ['Volunteering', 'Animals', 'Nature']
        }
      ];

      setProfiles(mockProfiles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      // User liked - add to matches
      alert(`You liked ${profiles[currentIndex]?.name}!`);
    } else if (direction === 'left') {
      // User passed
      alert(`You passed on ${profiles[currentIndex]?.name}`);
    } else if (direction === 'super') {
      // Super like
      alert(`You super liked ${profiles[currentIndex]?.name}!`);
    }

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset to beginning when no more profiles
      setCurrentIndex(0);
    }
  };

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <Container className="text-center py-5">
        <h3>No more profiles to show</h3>
        <p>Check back later for new matches!</p>
        <Button variant="primary">Refresh Profiles</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <div className="card-container">
            <div
              className="profile-card"
              style={{ backgroundImage: `url(${currentProfile.photos[selectedPhotoIndex]})` }}
            >
              <div className="profile-info">
                <h3>{currentProfile.name}, {currentProfile.age}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {currentProfile.distance} km away</p>
                <p>{currentProfile.bio}</p>

                <div className="mt-2">
                  <strong>Interests:</strong>
                  <div className="d-flex flex-wrap mt-1">
                    {currentProfile.interests.map((interest, index) => (
                      <span key={index} className="badge bg-primary me-1 mb-1">{interest}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="swipe-buttons d-flex justify-content-center gap-4">
              <Button
                variant="danger"
                size="lg"
                className="d-flex flex-column align-items-center"
                onClick={() => handleSwipe('left')}
                title="Not Like"
              >
                <i className="fas fa-times"></i>
                <span className="mt-1">Not Like</span>
              </Button>

              <Button
                variant="info"
                size="lg"
                className="d-flex flex-column align-items-center"
                onClick={() => handleSwipe('super')}
                title="Super Like"
              >
                <i className="fas fa-star"></i>
                <span className="mt-1">Super Like</span>
              </Button>

              <Button
                variant="success"
                size="lg"
                className="d-flex flex-column align-items-center"
                onClick={() => handleSwipe('right')}
                title="Like"
              >
                <i className="fas fa-heart"></i>
                <span className="mt-1">Like</span>
              </Button>
            </div>
          </div>

          {/* Photo thumbnails */}
          <div className="swiper-container mt-3">
            {currentProfile.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Profile ${index}`}
                className={`swiper-slide ${index === selectedPhotoIndex ? 'active' : ''}`}
                onClick={() => {
                  // Highlight the selected photo instead of swapping
                  setSelectedPhotoIndex(index);
                }}
              />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;