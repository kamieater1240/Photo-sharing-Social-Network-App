import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import SignupModal, { registerUser } from '../SignupModal';
import { uploadImage } from '../UploadModal';

require('jest-fetch-mock').enableMocks();

let container;

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { reload: jest.fn() },
  });
});

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test('renders login page', () => {
  const { container } = render(<SignupModal />);
  expect(container.firstChild.classList.contains('signUpBox')).toBe(true);
});

test('filling in email and password and pressing show password', async () => {
  act(() => {
    ReactDOM.createRoot(container).render(<SignupModal setOpen setLoginAlert={false} setResult={{}} />);
  });
  const buttons = container.querySelectorAll('button');
  const inputs = container.querySelectorAll('input');
  const testValues = [
    'FirstName',
    'LastName',
    'Email',
    'Password',
    'ConfirmPassword',
  ];
  inputs.forEach((element, index) => {
    act(() => {
      element.value = testValues[index];
    });
  });
  expect(container.querySelectorAll('input')[0].value).toBe('FirstName');
  expect(container.querySelectorAll('input')[1].value).toBe('LastName');
  expect(container.querySelectorAll('input')[2].value).toBe('Email');
  expect(container.querySelectorAll('input')[3].value).toBe('Password');
  await act(() => {
    buttons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await act(() => {
    if (buttons[1]) {
      fireEvent.click(buttons[1]);
    }
  });
});

test('signup modal error test', async () => {
  const message = 'Some error message';
  fetch.mockReject(Error(message));
  await registerUser({});
});

test('testing successful signup', async () => {
  fetch.mockResponse({
    userName: 'pranshu',
    email: 'pranshu@gmail.com',
    password: 'qwerty',
    userBiography: '',
    uid: '5',
    id: 5,

  });
  await uploadImage({});
});
