# Lovara v2 Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Components Overview](#components-overview)
7. [Pages Overview](#pages-overview)
8. [New Features in v2](#new-features-in-v2)
9. [Styling](#styling)
10. [Technologies Used](#technologies-used)

## Overview
Lovara v2 is a modern web application designed for partner matching similar to Tinder. Built with React, Bootstrap, Material UI, and modern web technologies, it provides a complete dating application experience with 7 main user flows.

## Features
- **User Registration & Profile Creation**: Create accounts and build profiles
- **Discovery & Swiping**: Browse potential matches with swipe functionality
- **Matching System**: Connect with other users who like your profile
- **Real-time Messaging**: Communicate with matches
- **Profile Management**: Edit and update personal information
- **Settings & Preferences**: Customize notification and privacy settings
- **Events & Activities**: Join or create events to meet people with similar interests
- **Video Chat**: Real-time video calling functionality
- **Responsive Design**: Works seamlessly on all device sizes

## Project Structure
```
Lovara/v2/
├── public/
│   └── index.html                 # Main HTML file
├── src/
│   ├── components/
│   │   └── Navbar.js             # Navigation component
│   ├── pages/
│   │   ├── Home.js               # Discovery/swiping page
│   │   ├── Register.js           # User registration page
│   │   ├── Login.js              # User login page
│   │   ├── Profile.js            # Profile management page
│   │   ├── Matches.js            # Matches display page
│   │   ├── Messages.js           # Messaging interface
│   │   ├── Settings.js           # Settings and preferences page
│   │   ├── Events.js             # Events & Activities page (NEW)
│   │   └── VideoChat.js          # Video chat interface (NEW)
│   ├── styles/
│   │   └── main.css              # Custom CSS styles
│   ├── assets/
│   │   └── logo.svg              # Lovara logo
│   ├── utils/                    # Utility functions
│   ├── App.js                    # Main application component
│   └── index.js                  # Entry point of the application
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Steps
1. Clone or download the project
2. Navigate to the project directory:
```bash
cd Lovara/v2
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and go to `http://localhost:3000`

## Usage

### Registration & Login
1. Visit the homepage
2. Click "Sign Up" to create a new account
3. Fill in your details and create a profile
4. Alternatively, log in with existing credentials

### Discovery Flow
1. Navigate to the Discover page
2. Browse through profiles displayed as cards
3. Swipe right to like, left to pass, or super like for special interest
4. View detailed profile information and interests

### Matching Flow
1. Access the Matches page
2. View users who have matched with you
3. See match percentages and mutual interests
4. Initiate conversations with matches

### Messaging Flow
1. Go to the Messages page
2. Select a conversation from the sidebar
3. Type and send messages in the chat interface
4. Receive and view incoming messages

### Events & Activities Flow (NEW in v2)
1. Navigate to the Events page
2. Browse upcoming events based on interests
3. Join events that match your interests
4. Create new events for others to join

### Video Chat Flow (NEW in v2)
1. Go to the Video Chat page
2. Select a contact from your matches
3. Start a video call to connect face-to-face
4. Use call controls to mute audio/video as needed

### Profile Management
1. Access the Profile page
2. Edit personal information, bio, and interests
3. Upload or remove profile photos
4. Update your profile picture

### Settings & Preferences
1. Navigate to the Settings page
2. Configure notification preferences
3. Adjust privacy settings
4. Set discovery preferences (age range, distance, etc.)

## Components Overview

### Navbar Component (`src/components/Navbar.js`)
- Provides navigation links to all main sections including new v2 features
- Displays user profile dropdown with profile, settings, and logout options
- Responsive design for mobile and desktop
- Includes the new "Events" and "Video Chat" navigation items

### Page Components

#### Home Page (`src/pages/Home.js`)
- Implements the discovery/swiping functionality
- Displays user profiles in an interactive card layout
- Handles swipe gestures and animations
- Shows profile information, photos, and interests
- Updated with modern UI design

#### Register Page (`src/pages/Register.js`)
- Handles user registration process
- Collects user information (name, email, password, etc.)
- Creates user profile with default settings
- Stores user data in local storage
- Updated with modern UI design

#### Login Page (`src/pages/Login.js`)
- Authenticates existing users
- Validates credentials against stored data
- Redirects to appropriate sections after login
- Updated with modern UI design

#### Profile Page (`src/pages/Profile.js`)
- Displays and allows editing of user profile
- Shows profile picture, bio, and interests
- Manages profile photos
- Tabbed interface for different profile sections
- Updated with modern UI design

#### Matches Page (`src/pages/Matches.js`)
- Displays matched users
- Shows match percentages and mutual interests
- Provides quick access to messaging
- Responsive grid layout for match cards
- Updated with modern UI design

#### Messages Page (`src/pages/Messages.js`)
- Implements real-time messaging interface
- Shows conversation list in sidebar
- Displays message history in chat bubbles
- Allows sending new messages
- Updated with modern UI design

#### Settings Page (`src/pages/Settings.js`)
- Organizes settings into accordion sections
- Manages notification preferences
- Controls privacy settings
- Configures discovery preferences
- Account management options
- Updated with modern UI design

#### Events Page (`src/pages/Events.js`) - NEW in v2
- Displays upcoming events based on user interests
- Allows users to join existing events
- Enables creation of new events
- Shows event details, dates, and locations
- Modern UI with event cards

#### VideoChat Page (`src/pages/VideoChat.js`) - NEW in v2
- Implements real-time video calling functionality
- Shows contact list with online status
- Provides video call interface with controls
- Simulated video experience
- Modern UI with video call controls

## New Features in v2

### Events & Activities
- Browse events based on interests
- Join events to meet people with similar hobbies
- Create new events for others to join
- Categories include social, adventure, hobby, entertainment, food & drink, and fitness

### Video Chat
- Real-time video calling with matches
- Call controls (mute, video toggle, end call)
- Online status indicators
- Call duration timer
- Simulated video experience

### Modern UI Enhancements
- Clean, minimalist interface with ample white space
- Modern color palette with soft gradients and subtle shadows
- Improved card designs with better animations
- Enhanced profile viewing experience
- Better responsive design for all devices
- Modern typography using the Inter font family
- Consistent design language throughout the application

## Styling

### CSS Framework
- Bootstrap 5 for responsive layout and components
- Material UI components for enhanced UI elements
- Custom CSS in `src/styles/main.css` for specific styling

### Custom Styles
- Modern gradient backgrounds
- Enhanced card animations and transitions
- Improved swipe button styling
- Chat interface design with modern bubbles
- Responsive adjustments for different screen sizes
- Consistent color scheme and typography

## Technologies Used

### Frontend Framework
- **React 18**: Component-based UI library
- **React Router DOM**: Client-side routing
- **React Bootstrap**: Pre-styled components
- **Material UI**: Enhanced UI components

### Styling
- **Bootstrap 5**: Responsive CSS framework
- **Material UI**: Advanced component library
- **Custom CSS**: Additional styling and animations

### Utilities
- **Axios**: HTTP client (for future API integration)
- **Font Awesome**: Icon library
- **React Player**: Video player component
- **Emotion**: CSS-in-JS library

### Development Tools
- **Create React App**: Project scaffolding
- **ESLint**: Code linting
- **Babel**: JavaScript compiler

### API Integration Points
While the current implementation uses mock data and localStorage, the application is structured to easily integrate with a backend API:

- Authentication endpoints
- User profile management
- Matching algorithms
- Real-time messaging
- Photo upload services
- Event management
- Video calling services

## Future Enhancements
- Backend API integration
- Real-time matching with WebSocket
- Advanced filtering options
- Push notifications
- Social media integration
- Payment integration for premium features
- Machine learning for better matching

## Troubleshooting

### Common Issues
1. **Page not loading**: Ensure all dependencies are installed with `npm install`
2. **Styles not applying**: Check that Bootstrap CSS is properly linked in index.html
3. **Routing issues**: Verify React Router is correctly configured in App.js

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit a pull request

## License
This project is created for educational purposes and demonstration of React application development.