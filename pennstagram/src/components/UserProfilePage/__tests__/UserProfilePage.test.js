import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfilePage, { getUserPost } from '../UserProfilePage';

// require('jest-fetch-mock').enableMocks()

test('if the user profile page is rendered', () => {
  const { container } = render(<UserProfilePage />);
  expect(container.firstChild.classList.contains('UserProfilePage')).toBe(true);
});

// const mockPost = [
//     {
//       "id": 6,
//       "uid": "1",
//       "isFollow": true,
//       "name": "KuanYuChen19",
//       "image": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//       "caption": "My taste buds are still singing from our last visit! The food was cooked to perfection. The waiter did an excellent job. I'm definitely coming back for more!",
//       "isLike": false,
//       "isImage": true,
//       "filetype": "image/jpg"
//     },
//     {
//       "caption": "My taste buds are still singing from our last visit! The food was cooked to perfection. The waiter did an excellent job. I'm definitely coming back for more!",
//       "id": 7,
//       "uid": "1",
//       "isFollow": false,
//       "isImage": true,
//       "isLike": false,
//       "image": "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
//       "name": "KuanYuChen19"
//     }
//   ];
//   test('test get user post', () => {
//     fetch.mockResponse(JSON.stringify(mockPost))
//     getUserPost(1).then((data) => expect(data).toMatchObject(mockPost));
//   });
//   test('test get user post error', () => {
//     fetch.mockReject(new Error('test get user post failed'));
//     getUserPost(1).then((err) => expect(err.message).toBe('test get user post failed'));
//   });
