import React from 'react';
import {
  fireEvent, render, screen, configure,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import LoginModal from '../LoginModal';

require('jest-fetch-mock').enableMocks();

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

let container;
beforeEach(() => {
  fetchMock.doMock();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test('renders login page', () => {
  const { container } = render(<LoginModal />);
  expect(container.firstChild.classList.contains('loginBox')).toBe(true);
});

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { reload: jest.fn() },
  });
});

test('filling in email and password and pressing show password', async () => {
  act(() => {
    ReactDOM.createRoot(container).render(<LoginModal setOpen setLoginAlert={false} setResult={{}} />);
  });
  const onSubmit = jest.fn((e) => e.preventDefault());
  const buttons = container.querySelectorAll('button');
  const inputs = container.querySelectorAll('input');
  const email = inputs[0];
  const password = inputs[1];
  await act(() => {
    email.value = 'KuanYuChen19';
    password.value = 'hahaha';
  });
  expect(container.querySelectorAll('input')[0].value).toBe('KuanYuChen19');
  expect(container.querySelectorAll('input')[1].value).toBe('hahaha');
  await act(() => {
    buttons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
});

test('filling in email and password and pressing login', async () => {
  fetch.mockResponse(JSON.stringify([{
    userName: 'pranshu',
    email: 'pranshu@gmail.com',
    password: 'qwerty',
    userBiography: '',
    uid: '5',
    id: 5,
  }]));
  render(<LoginModal setOpen setLoginAlert={false} />);
  const input = screen.getByTestId('add-email-input').querySelector('input');
  const password = screen.getByTestId('add-password-input').querySelector('input');
  const button = screen.getByTestId('submitButton');

  await act(async () => {
    await fireEvent.change(input, { target: { value: 'pranshu@gmail.com' } });
    await fireEvent.change(password, { target: { value: 'qwerty' } });
    await fireEvent.click(button);
  });
});

test('filling in email and password and pressing login errorLogin', async () => {
  fetch.mockResponse(JSON.stringify([]));
  render(<LoginModal setOpen setLoginAlert={false} />);
  const input = screen.getByTestId('add-email-input').querySelector('input');
  const password = screen.getByTestId('add-password-input').querySelector('input');
  const button = screen.getByTestId('submitButton');

  await act(async () => {
    await fireEvent.change(input, { target: { value: 'pranshu@gmail.com' } });
    await fireEvent.change(password, { target: { value: 'wrongpassword' } });
    await fireEvent.click(button);
  });
});

test('filling in email and password and pressing login errorLogin', async () => {
  const message = 'some error message';
  fetch.mockReject(Error(message));
  render(<LoginModal setOpen setLoginAlert={false} />);
  const input = screen.getByTestId('add-email-input').querySelector('input');
  const password = screen.getByTestId('add-password-input').querySelector('input');
  const button = screen.getByTestId('submitButton');

  await act(async () => {
    await fireEvent.change(input, { target: { value: 'pranshu@gmail.com' } });
    await fireEvent.change(password, { target: { value: 'wrongpassword' } });
    await fireEvent.click(button);
  });
});
