# Lovara Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Components Overview](#components-overview)
7. [Pages Overview](#pages-overview)
8. [Styling](#styling)
9. [Data Flow](#data-flow)
10. [Technologies Used](#technologies-used)

## Overview
Lovara is a web application designed for partner matching similar to Tinder. Built with React, Bootstrap, and modern web technologies, it provides a complete dating application experience with 5 main user flows.

## Features
- **User Registration & Profile Creation**: Create accounts and build profiles
- **Discovery & Swiping**: Browse potential matches with swipe functionality
- **Matching System**: Connect with other users who like your profile
- **Real-time Messaging**: Communicate with matches
- **Profile Management**: Edit and update personal information
- **Settings & Preferences**: Customize notification and privacy settings
- **Responsive Design**: Works seamlessly on all device sizes

## Project Structure
```
Lovara/
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
│   │   └── Settings.js           # Settings and preferences page
│   ├── styles/
│   │   └── main.css              # Custom CSS styles
│   ├── utils/                    # Utility functions (empty)
│   ├── assets/                   # Static assets (empty)
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
cd Lovara
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
- Provides navigation links to all main sections
- Displays user profile dropdown with profile, settings, and logout options
- Responsive design for mobile and desktop

### Page Components

#### Home Page (`src/pages/Home.js`)
- Implements the discovery/swiping functionality
- Displays user profiles in an interactive card layout
- Handles swipe gestures and animations
- Shows profile information, photos, and interests

#### Register Page (`src/pages/Register.js`)
- Handles user registration process
- Collects user information (name, email, password, etc.)
- Creates user profile with default settings
- Stores user data in local storage

#### Login Page (`src/pages/Login.js`)
- Authenticates existing users
- Validates credentials against stored data
- Redirects to appropriate sections after login

#### Profile Page (`src/pages/Profile.js`)
- Displays and allows editing of user profile
- Shows profile picture, bio, and interests
- Manages profile photos
- Tabbed interface for different profile sections

#### Matches Page (`src/pages/Matches.js`)
- Displays matched users
- Shows match percentages and mutual interests
- Provides quick access to messaging
- Responsive grid layout for match cards

#### Messages Page (`src/pages/Messages.js`)
- Implements real-time messaging interface
- Shows conversation list in sidebar
- Displays message history in chat bubbles
- Allows sending new messages

#### Settings Page (`src/pages/Settings.js`)
- Organizes settings into accordion sections
- Manages notification preferences
- Controls privacy settings
- Configures discovery preferences
- Account management options

## Styling

### CSS Framework
- Bootstrap 5 for responsive layout and components
- Custom CSS in `src/styles/main.css` for specific styling

### Custom Styles
- Profile card animations and transitions
- Swipe button styling
- Chat interface design
- Responsive adjustments for different screen sizes
- Color scheme and typography

## Data Flow

### State Management
- React hooks (useState, useEffect) for component state
- Local storage for persisting user data and settings
- Props drilling for passing data between components

### Data Persistence
- User profiles stored in localStorage
- Settings and preferences saved in localStorage
- Temporary data for current session managed in component state

### Mock Data
- Sample profiles for demonstration
- Predefined conversation data
- Example settings configurations

## Technologies Used

### Frontend Framework
- **React 18**: Component-based UI library
- **React Router DOM**: Client-side routing
- **React Bootstrap**: Pre-styled components

### Styling
- **Bootstrap 5**: Responsive CSS framework
- **Custom CSS**: Additional styling and animations

### Utilities
- **Axios**: HTTP client (for future API integration)
- **Font Awesome**: Icon library

### Development Tools
- **Create React App**: Project scaffolding
- **ESLint**: Code linting
- **Babel**: JavaScript compiler

## API Integration Points
While the current implementation uses mock data and localStorage, the application is structured to easily integrate with a backend API:

- Authentication endpoints
- User profile management
- Matching algorithms
- Real-time messaging
- Photo upload services

## Future Enhancements
- Backend API integration
- Real-time matching with WebSocket
- Advanced filtering options
- Video calling functionality
- Location-based services
- Push notifications
- Social media integration

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