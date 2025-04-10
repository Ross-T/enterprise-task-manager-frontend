import Layout from "./components/layout/Layout";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Context Providers
import { AuthProvider } from "./context/authContext";
import { TaskProvider } from "./context/taskContext";
import { ProjectProvider } from "./context/projectContext";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import TasksPage from "./pages/TasksPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TaskCreatePage from "./pages/TaskCreatePage";
import TaskEditPage from "./pages/TaskEditPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectCreatePage from "./pages/ProjectCreatePage";
import ProjectEditPage from "./pages/ProjectEditPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <TaskProvider>
            <ProjectProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Dashboard />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/tasks"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <TasksPage />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/tasks/create"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <TaskCreatePage />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/tasks/edit/:id"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <TaskEditPage />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/tasks/:id"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <TaskDetailPage />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/projects"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <ProjectsPage />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/projects/create"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <ProjectCreatePage />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/projects/edit/:id"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <ProjectEditPage />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/projects/:id"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <ProjectDetailPage />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Routes>
              </Router>
            </ProjectProvider>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
