import { render, screen } from '@testing-library/react';
import App from './App';

test('renders enterprise task manager title', () => {
  render(<App />);
  const headingElement = screen.getByText(/Enterprise Task Manager/i);
  expect(headingElement).toBeInTheDocument();
});
