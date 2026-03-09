import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button, InputGroup } from 'react-bootstrap';

function Messages() {
  const [conversations, setConversations] = useState([
    {
      id: '1',
      name: 'Sarah',
      lastMessage: 'Hey! How are you doing?',
      time: '10:30 AM',
      unread: 2,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      messages: [
        { id: 1, text: 'Hi there! How are you?', sender: 'other', time: '10:25 AM' },
        { id: 2, text: 'I\'m doing great! Just exploring the city today.', sender: 'me', time: '10:26 AM' },
        { id: 3, text: 'That sounds fun! Want to meet up later?', sender: 'other', time: '10:28 AM' },
        { id: 4, text: 'Sure, where would you like to meet?', sender: 'me', time: '10:29 AM' },
        { id: 5, text: 'Hey! How are you doing?', sender: 'other', time: '10:30 AM' }
      ]
    },
    {
      id: '2',
      name: 'Michael',
      lastMessage: 'See you tomorrow!',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      messages: [
        { id: 1, text: 'Are we still meeting for coffee?', sender: 'me', time: 'Yesterday' },
        { id: 2, text: 'Yes, 3 PM at the usual place!', sender: 'other', time: 'Yesterday' }
      ]
    },
    {
      id: '3',
      name: 'Emma',
      lastMessage: 'Thanks for the recommendation!',
      time: 'Mar 7',
      unread: 0,
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      messages: [
        { id: 1, text: 'Have you tried the new restaurant downtown?', sender: 'other', time: 'Mar 7' },
        { id: 2, text: 'Yes, it was amazing! The pasta was delicious.', sender: 'me', time: 'Mar 7' }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        id: selectedConversation.messages.length + 1,
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: newMessage,
            time: 'Just now'
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, message]
      });
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation.messages]);

  return (
    <Container fluid className="chat-container">
      <Row className="h-100 g-0">
        {/* Conversation List */}
        <Col md={4} className="sidebar">
          <Card className="h-100 border-0 rounded-0">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Messages</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {conversations.map((conversation) => (
                <ListGroup.Item
                  key={conversation.id}
                  action
                  onClick={() => setSelectedConversation(conversation)}
                  active={selectedConversation.id === conversation.id}
                  className="border-start-0 border-end-0"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-0">{conversation.name}</h6>
                        <small className="text-muted">{conversation.time}</small>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="mb-0 text-muted" style={{ fontSize: '0.9em' }}>
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="badge bg-danger">{conversation.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Chat Area */}
        <Col md={8} className="chat-area">
          {selectedConversation ? (
            <>
              <Card className="h-100 border-0 rounded-0">
                <Card.Header className="bg-white d-flex align-items-center">
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    className="rounded-circle me-3"
                    width="40"
                    height="40"
                  />
                  <div>
                    <h6 className="mb-0">{selectedConversation.name}</h6>
                    <small className="text-muted">Online now</small>
                  </div>
                </Card.Header>
                <Card.Body className="messages p-0">
                  <div className="p-3">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-bubble d-flex ${
                          message.sender === 'me' ? 'sent ms-auto' : 'received me-auto'
                        }`}
                      >
                        <div className="flex-grow-1">
                          <p className="mb-0">{message.text}</p>
                          <small className={`d-block mt-1 ${message.sender === 'me' ? 'text-light' : 'text-muted'}`}>
                            {message.time}
                          </small>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </Card.Body>
                <Card.Footer className="message-input bg-white">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                    />
                    <Button
                      variant="success"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </Button>
                  </InputGroup>
                </Card.Footer>
              </Card>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <h5 className="text-muted">Select a conversation to start chatting</h5>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Messages;