# Enterprise Task Manager - Frontend

## Introduction

### Solution Overview

This repository contains the frontend of the Enterprise Task Manager application. It's built using React, with a user-friendly interface for interacting with the task management system. It communicates with the backend API (https://github.com/Ross-T/enterprise-task-manager-backend) to handle data and business logic. The UI is designed to be intuitive and responsive, using Material UI components.

### Project Aim & Objectives

**Main Aim:** To develop a scalable, performance-optimised, secure, and robust user interface for the Enterprise Task Manager, demonstrating enterprise qualities.

**Key Objectives:**

1.  **Secure User Authentication:** Use login and registration forms, handle JWT tokens securely, protect routes requiring authentication and integrate with Supabase Auth via the backend
2.  **CRUD Functionality:** Create interfaces for viewing, creating, editing, and deleting projects and tasks.
3.  **A Robust Application:** Implement client-side validation, display clear success/error responses and handle API errors gracefully.
4.  **Implement Global Application State:** Use React Context API to implement global state across the application, like authentication status.
5.  **A Responsive and User-friendly UI:** Use Material UI components to ensure usability across different screen sizes.

## Enterprise Considerations

This frontend application demonstrates several enterprise-level qualities:

* **Performance:**
    * **State Management:** React Context API is used to manage global state, to remove unnecessary re-renders.
    * **Optimised API Calls:** Using Axios for HTTP requests and by fetching data efficiently within components and contexts.
    * **Integrate With Backend Caching:** Utilise Spring caching from the backend to optimise loading times.

* **Scalability:**
    * **Component-Based and Modular Architecture:** Built with React components and organised into separated folders (`pages`, `components`, `api`, `context`, `utils`), making it easier to maintain and extend.
    * **Centralised API Configuration:** API interaction logic is split into service files (`projectService.js`, `taskService.js`, `authService.js`) and the configuration is centralised in (`axiosConfig.js`), making updates simpler.
    * **Handle High Concurrent Users Using a Circuit Breaker:** Using a `CircuitBreaker` (`src/utils/circuitBreaker.js`) for API calls prevents repeated calls to a failing backend service, helping to maintain frontend availability, responsiveness during backend outages and improving stability. This allows increasing numbers of concurrent users to be managed by preventing requests to overwhelmed services.

* **Robustness:**
    * **Error Boundaries:** The `ErrorBoundary` component wraps critical parts of the application to catch JavaScript errors in child components, preventing a full application crash and displaying a fallback UI. (`src/components/common/ErrorBoundary.js`)
    * **Graceful API Error Handling:** API service functions include `.catch` blocks to handle request errors and produce graceful user feedback, complementing the Circuit Breaker.
    * **User Input Validation:** User-input forms include client-side validation checks (e.g., email format checks) to provide immediate feedback.

* **Security:**
    * **Token-Based Authentication:** Interacts with the backend using JWT. Tokens are received upon login/registration (via the backend/Supabase) and stored via `authContext.js`.
    * **Protected Routes:** The `ProtectedRoute` component (`src/components/common/ProtectedRoute.js`) restricts access based on authentication status.
    * **Secure API Communication:** Sends the JWT token in the Authorisation header (`src/api/axiosConfig.js`). HTTPS is implemented via Render (the deployment platform).
    * **Supabase Integration:** Uses Supabase secure authentication via the backend.

* **Deployment:**
    * **Environment Configuration:** Uses `.env` files for backend API URL (`REACT_APP_API_URL`) and Supabase details (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`). See `src/api/config.js`.
    * **Hosting Platform:** Deployed on Render across two environments (dev and prod).

## Installation & Usage Instructions

### Prerequisites

* Node.js v18+
* npm
* Git
* A running instance of the [Enterprise Task Manager Backend API](https://github.com/Ross-T/enterprise-task-manager-backend) configured with its own environment variables

### Setup Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ross-T/enterprise-task-manager-frontend.git
    cd enterprise-task-manager-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root project directory and make sure this file ISN'T committed (add it to .gitignore). Add the following variables:
    ```dotenv
    # URL for the backend API instance
    REACT_APP_API_URL=http://localhost:8080/api

    # Supabase details (replace placeholders)
    REACT_APP_SUPABASE_URL=https://<supabase_project_ref>.supabase.co
    REACT_APP_SUPABASE_ANON_KEY=<supabase_anon_key>
    ```

### Running the Application
1.  **Start the development server:**
    ```bash
    npm start
    ```
2.  Open your web browser and navigate to `http://localhost:3000`.

## Feature Overview

| Feature               | Purpose                                                       | Code Locations                                                                                                | Context                                                                |
| :-------------------- | :------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| User Authentication | Allows users to register and log in via the backend/Supabase.     | `src/pages/LoginPage.js`, `src/pages/RegisterPage.js`, `src/components/auth/Login.js`, `src/components/auth/Register.js`, `src/api/authService.js` | Uses `authContext` for state and token management. Interacts with backend `/auth`. |
| Project Management    | CRUD operations for projects.                                 | `src/pages/ProjectsPage.js`, `src/pages/ProjectDetailPage.js`, `src/pages/ProjectCreatePage.js`, `src/pages/ProjectEditPage.js`, `src/components/projects/*`, `src/api/projectService.js` | Uses `projectContext`. Interacts with backend `/projects`.                   |
| Task Management       | CRUD operations for tasks.                    | `src/pages/TasksPage.js`, `src/pages/TaskDetailPage.js`, `src/pages/TaskCreatePage.js`, `src/pages/TaskEditPage.js`, `src/components/tasks/*`, `src/api/taskService.js` | Uses `taskContext`. Interacts with backend `/tasks`.                         |
| Route Protecting   | Secures routes requiring login.                               | `src/components/common/ProtectedRoute.js`, Route logic within `src/App.js`                                                           | Uses `authContext` to check authentication.                                   |
| Error Handling        | Catches application errors and handles API failures.          | `src/components/common/ErrorBoundary.js`, `src/utils/circuitBreaker.js`, Error handling within API service calls. | Provides fallback UI and user feedback.                                                 |
| Responsive Layout     | Adapts the application to different screen sizes.             | `src/components/layout/Layout.js`, Use of Material UI.                                                 | Core layout structure.                                                                  |

## Known Issues & Future Enhancements

* **Known Issues:**
    * Incomplete/failing test suites.
    * Limited client-side validation.
    * Using `localStorage` for JWT storage has security implications.
    * All users who log in will see the same instance of the app e.g. all tasks made by other users (suitable for internal business use, not suitable for external use)
* **Potential Future Enhancements:**
    * Implement comprehensive testing.
    * Enhance client-side validation.
    * Refine UI/UX.
    * Implement a more secure token handling strategy.
    * Add features like task filtering, sorting, searching.
    * Implement a Kanban-style UI grid
    * Allow different users to have different instances of the app
    * Implement user roles

## References

* React, Material UI, Axios, Render
* Generative AI tools were consulted and all final suggestions were personally reviewed, understood, and adapted.
