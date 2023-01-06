import React from 'react';
import { render, screen } from '@testing-library/react';
import OtherUserProfilePage from '../OtherUserProfilePage';

test('if the user profile page is rendered', () => {
  const { container } = render(<OtherUserProfilePage />);
  expect(container.firstChild.classList.contains('OtherUserProfilePage')).toBe(true);
});
