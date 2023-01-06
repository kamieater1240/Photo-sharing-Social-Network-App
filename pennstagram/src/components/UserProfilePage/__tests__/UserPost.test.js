import React from 'react';
import { render, screen } from '@testing-library/react';
import UserPost, { getComments } from '../UserPost';

require('jest-fetch-mock').enableMocks();

test('if UserPost is rendered correctly', () => {
  const data = {
    id: 1,
    uid: 1,
    isFollow: true,
    name: 'Lucy Song',
    image: './food1.jpg',
    caption: "My taste buds are still singing from our last visit! The food was cooked to perfection. The waiter did an excellent job. I'm definitely coming back for more!",
    isLike: false,
    title: 'Breakfast',
  };

  const { container } = render(<UserPost value={data} />);
  expect(container.firstChild.classList.contains('UserPost')).toBe(true);
});

const mockComment = [
  {
    id: '1',
    postid: '1',
    userid: '1',
    username: 'Lucy',
    commentText: 'great!!!',
  },
  {
    id: '2',
    postid: '1',
    userid: '1',
    username: 'Lucy',
    commentText: 'great!!!',
  },
];
test('get user post comments', () => {
  fetch.mockResponse(JSON.stringify(mockComment));
  getComments(1).then((data) => expect(data).toMatchObject(mockComment));
});
test('get user post comments error', () => {
  fetch.mockReject(new Error('test get user post comments failed'));
  getComments(1).then((err) => expect(err.message).toBe('test get user post comments failed'));
});
