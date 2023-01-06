import React from 'react';
import { render, screen } from '@testing-library/react';

import App from '../App';

test('App', () => {
  const { container } = render(<App />);
  expect(container.firstChild.classList.contains('App')).toBe(true);
});
