import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Comment, { editComment } from '../Comment';

require('jest-fetch-mock').enableMocks();
// const lib = require('../Comment.js')

beforeEach(() => { // if you have an existing `beforeEach` just add the following line to it
  fetchMock.doMock();
});
describe('test comment update', () => {
  test('comment update', () => {
    fetch.mockResponse(JSON.stringify({ status: 200 }));
    editComment(1, 1, 1, 'KuanYuChen19', 'hello!!').then((data) => expect(data.status).toBe(200));
  });

  test('comment update error', () => {
    fetch.mockReject(new Error('no such comment'));
    editComment(1, 1, 1, 'KuanYuChen19', 'hello!!').then((err) => {
      expect(err).not.toBe(undefined);
      expect(err.name).toBe('Error');
      expect(err.message).toBe('no such comment');
    });
  });

  test('comments are rendered', () => {
    const value = {
      id: 4,
      postid: '3',
      userid: '1',
      username: 'Lucy',
      commentText: 'great!!!',
    };
    const { container, getByTestId } = render(<Comment value={value} />);
    const parent = getByTestId('parent');
    const child = getByTestId('child');
    expect(parent).toContainElement(child);
  });
});
