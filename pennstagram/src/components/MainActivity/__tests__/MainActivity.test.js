import React from 'react';
import { render, screen } from '@testing-library/react';
import MainActivity from '../MainActivity';

test('renders main page if user is null', () => {
  const { container } = render(<MainActivity />);
  expect(container.firstChild.classList.contains('boxMainPage')).toBe(true);
});

test('renders main page if user is not null', () => {
  localStorage.setItem('UID', '1');
  const { getByRole, getByTestId } = render(<MainActivity />);
  const root = getByRole('root');
  const parent = getByTestId('parent');
  expect(root).toContainElement(parent);
});
