import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom/client';
import { wait } from '@testing-library/user-event/dist/utils';
import UploadModal, { fetchUsers, uploadImage } from '../UploadModal';
import { editComment } from '../../Post/Comment';
import LoginModal from '../LoginModal';

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
  global.URL.createObjectURL = jest.fn();
  const { container } = render(<UploadModal />);
  expect(container.firstChild.classList.contains('uploadBox')).toBe(true);
});

test('filling in email and password and pressing show password', async () => {
  global.URL.createObjectURL = jest.fn();
  fetch.mockResponse(JSON.stringify(
    [
      {
        id: 1,
        userName: 'KuanYuChen19',
        email: 'kycjosh@seas.upenn.edu',
        password: '1',
        userBiography: 'Hi~ My name is Kuan-Yu Chen!!!',
        uid: '1',
      },
      {
        userName: 'pranshu',
        email: 'pranshu@gmail.com',
        password: 'qwerty',
        userBiography: '',
        uid: '5',
        id: 5,
      },
    ],
  ));
  const onSubmit = jest.fn((e) => e.preventDefault());
  act(() => {
    ReactDOM.createRoot(container).render(<UploadModal setOpen />);
  });
  const buttons = container.querySelectorAll('button');
  await act(async () => {
    fireEvent.click(buttons[0]);
  });
  await wait(() => expect(buttons[0]).toHaveBeenCalled());
});

test('fetchUsers', async () => {
  fetch.mockResponseOnce(JSON.stringify([
    {
      id: 1,
      userName: 'KuanYuChen19',
      email: 'kycjosh@seas.upenn.edu',
      password: '1',
      userBiography: 'Hi~ My name is Kuan-Yu Chen!!!',
      uid: '1',
    },
    {
      userName: 'pranshu',
      email: 'pranshu@gmail.com',
      password: 'qwerty',
      userBiography: '',
      uid: '5',
      id: 5,
    },
  ]));
  await fetchUsers();
});

test('input Caption', async () => {
  global.URL.createObjectURL = jest.fn();
  fetch.mockResponse(JSON.stringify(
    [
      {
        id: 1,
        userName: 'KuanYuChen19',
        email: 'kycjosh@seas.upenn.edu',
        password: '1',
        userBiography: 'Hi~ My name is Kuan-Yu Chen!!!',
        uid: '1',
      },
      {
        userName: 'pranshu',
        email: 'pranshu@gmail.com',
        password: 'qwerty',
        userBiography: '',
        uid: '5',
        id: 5,
      },
    ],
  ));
  render(<UploadModal setOpen />);
  const caption = screen.getByTestId('test-caption').querySelector('textarea');
  // const password = screen.getByTestId('add-password-input').querySelector('input');
  const button = screen.getByTestId('submitButton');
  await act(async () => {
    await fireEvent.change(caption, { target: { value: 'Test Caption' } });
    await fireEvent.click(button);
  });
});

test('testing Upload Image Error', async () => {
  const message = 'Some error message';
  fetch.mockReject(Error(message), { status: 305 });
  await uploadImage({});
});
