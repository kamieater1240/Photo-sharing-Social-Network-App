import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import Navbar from '../Navbar';

const { createMemoryHistory } = require('history');

let container;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test('renders login page', () => {
  const history = createMemoryHistory();
  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Navbar />
    </Router>,
  );
});

test('navbar logout', async () => {
  localStorage.setItem('UID', '111');
  const history = createMemoryHistory();
  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Navbar />
    </Router>,
  );
  const button = container.querySelectorAll('button');
  await act(() => {
    if (button[2]) {
      fireEvent.click(button[2]);
    }
  });
  expect(localStorage.getItem('UID')).toBeNull();
});

test('navbar logout', async () => {
  localStorage.setItem('UID', '111');
  const history = createMemoryHistory();
  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Navbar />
    </Router>,
  );
  const button = container.querySelectorAll('button');
  await act(() => {
    if (button[2]) {
      fireEvent.click(button[2]);
    }
  });
  expect(localStorage.getItem('UID')).toBeNull();
});

test('navbar userprofile', async () => {
  localStorage.setItem('UID', '111');
  const history = createMemoryHistory();
  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Navbar />
    </Router>,
  );
  const button = container.querySelectorAll('button');
  const input = container.querySelector('input');
  await act(() => {
    if (button[1]) {
      fireEvent.click(button[1]);
    }
  });
  await act(() => {
    if (input) {
      fireEvent.click(input);
    }
  });
  expect(localStorage.getItem('UID')).toBe('111');
});

test('navbar login', async () => {
  const history = createMemoryHistory();
  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Navbar />
    </Router>,
  );
  const button = container.querySelectorAll('button');
  await act(() => {
    if (button[0]) {
      fireEvent.click(button[1]);
    }
  });
});

test('navbar signup', async () => {
  const history = createMemoryHistory();
  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Navbar />
    </Router>,
  );
  const button = container.querySelectorAll('button');
  await act(() => {
    if (button[1]) {
      fireEvent.click(button[1]);
    }
  });
});
