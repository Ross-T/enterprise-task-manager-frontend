# Enterprise Task Manager - Frontend

## Overview

This repository contains the frontend application for the Enterprise Task Manager system, a full-stack task management solution designed for enterprise environments. This React-based interface provides a user-friendly way to interact with the Enterprise Task Manager backend API.

## Project Aim & Objectives

The Enterprise Task Manager frontend aims to provide an intuitive, responsive interface for task and project management with the following objectives:

1. Implement a secure authentication system with JWT tokens
2. Create an intuitive dashboard for task and project visualization
3. Provide responsive design for mobile and desktop use
4. Demonstrate enterprise-level frontend architecture patterns

## Features

- **User Authentication**: Secure login/signup with JWT-based authentication
- **Task Management**: Create, view, update, and delete tasks with various attributes
- **Project Management**: Organize tasks within projects
- **Dashboard**: Visual overview of tasks and projects
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Enterprise Considerations

### Scalability
- Component-based architecture allows for easy feature addition
- Code splitting for optimized bundle sizes
- Environment-based configuration for different deployment environments

### Security
- Secure API communication with JWT authentication
- Input validation and sanitization
- HTTPS enforcement in production
- Environment variable management for sensitive information

### Performance
- Optimized React component rendering
- Material-UI with theming for consistent design
- Lazy loading of components where appropriate

## Technology Stack

- **React 19**: Modern UI framework
- **React Router**: For navigation and routing
- **Material UI**: Component library for a consistent design system
- **Axios**: HTTP client for API requests
- **React Context API**: For state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Access to the Enterprise Task Manager backend API

### Installation

1. Clone the repository:
   `git clone https://github.com/Ross-T/enterprise-task-manager-frontend.git`
   `cd enterprise-task-manager-frontend`

2. Install dependencies:
   `npm install`

3. Create a `.env.development.local` file for configuration:
   `REACT_APP_API_URL=http://localhost:8080/api`

4. Start the development server:
   `npm start`

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects the app from Create React App (irreversible)

## Project Structure

src/
├── api/           # API integration and services
├── assets/        # Static assets (images, fonts)
├── components/    # Reusable UI components
├── context/       # React context for state management
├── hooks/         # Custom React hooks
├── pages/         # Page components for routes
├── utils/         # Utility functions
├── App.js         # Main application component
└── index.js       # Application entry point

## API Integration

This frontend application communicates with the Enterprise Task Manager backend API. The API base URL is configured through environment variables:

- Development: `http://localhost:8080/api`
- Production: Set via `REACT_APP_API_URL` in deployment environment

API requests are managed through service modules in the `src/api` directory, with authentication handled automatically via JWT tokens.

## Deployment

### Build for Production

`npm run build`

This creates an optimized production build in the `build` folder.

### Deployment Options

The application can be deployed to:

1. **Static hosting services** like Netlify, Vercel, or GitHub Pages
2. **Cloud platforms** such as AWS S3 + CloudFront, Azure Static Web Apps
3. **Traditional hosting** by serving the build directory from a web server

Remember to configure the `REACT_APP_API_URL` environment variable to point to your deployed backend API.

## Known Issues & Future Enhancements

- **Offline Support**: Add service workers for offline capability
- **Mobile App**: Potential for React Native conversion
- **Performance Monitoring**: Integrate analytics for performance tracking
- **Accessibility Improvements**: Further enhance accessibility compliance

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Created as part of enterprise software engineering coursework
- UI design inspired by industry-standard task management solutions


## Quality Assurance

### Testing Strategy

This project employs a comprehensive testing approach across multiple levels:

- **Unit Tests**: Individual components and services are tested in isolation using Jest and React Testing Library
- **Integration Tests**: API services and component interactions are tested to verify proper communication
- **E2E Tests**: Cypress is used for end-to-end tests that simulate real user interactions
- **Coverage Goals**: Maintain >80% code coverage for critical application paths

Test configurations are maintained in separate environments to ensure consistency between local development and CI pipeline execution.

### Code Quality

We maintain high code quality standards through:

- **Static Analysis**: ESLint enforces coding standards with custom rule configuration
- **Code Formatting**: Prettier ensures consistent code style across the codebase
- **Pre-commit Hooks**: Husky prevents commits that don't meet quality standards
- **Code Reviews**: Pull request reviews required with at least one approval
- **Type Safety**: PropTypes validation for all components with consideration for TypeScript migration

### Accessibility

The application follows WCAG 2.1 AA standards:

- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus management

## Development Workflow

### CI/CD Pipeline

This project uses a modern continuous integration and deployment workflow:

- **Continuous Integration**: GitHub Actions automatically runs tests on every pull request
- **Automated Testing**: Unit, integration, and E2E tests run in the CI environment
- **Build Verification**: Production builds are created and verified before deployment
- **Deployment Automation**: Successful builds on the main branch trigger automatic deployment
- **Environment Management**: Separate pipelines for staging and production environments

The CI/CD configuration files are maintained in the `.github/workflows` directory.

### Branching Strategy

We follow a GitFlow-inspired branching strategy:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature branches
- `hotfix/*`: Urgent production fixes

Pull requests require passing CI checks and code review approval before merging.

### Backend Reference
This frontend application communicates with the [Enterprise Task Manager Backend](https://github.com/Ross-T/enterprise-task-manager-backend) API.