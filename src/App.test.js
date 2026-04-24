import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the logistics dashboard headline', () => {
  render(<App />);
  expect(screen.getByText(/Lowen Corp AI Logistics/i)).toBeInTheDocument();
});
