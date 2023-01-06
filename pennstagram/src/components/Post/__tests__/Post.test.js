import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Post, {
  deletePost, getFollow, getLike, likePosts, unfollowUser, unLikePost,
} from '../Post';

require('jest-fetch-mock').enableMocks();

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

test('render post', () => {
  const data = {
    id: 1,
    uid: 2,
    isFollow: true,
    name: 'Lucy Song',
    image: './food1.jpg',
    caption: "My taste buds are still singing from our last visit! The food was cooked to perfection. The waiter did an excellent job. I'm definitely coming back for more!",
    isLike: false,
  };
  const { container, getByRole, getByTestId } = render(<Post value={data} />);
  const parent = getByTestId('parent');
  const child = getByTestId('child');
  const buttons = container.querySelectorAll('button svg');
  // test render post
  expect(parent).toContainElement(child);
  // test click unfollow
  act(() => {
    if (buttons[0]) {
      fireEvent.click(buttons[0]);
    }
  });
  const stylesFollow = getComputedStyle(buttons[0]);

  expect(stylesFollow.color).toBe('rgb(224, 224, 224)');

  // test click like
  act(() => {
    if (buttons[1]) {
      fireEvent.click(buttons[1]);
    }
  });
  const stylesLike = getComputedStyle(buttons[1]);

  expect(stylesLike.color).toBe('rgb(224, 224, 224)');
});

test('click follow and unlike', () => {
  const data = {
    id: 1,
    uid: '2',
    isFollow: false,
    name: 'Lucy Song',
    image: './food1.jpg',
    caption: "My taste buds are still singing from our last visit! The food was cooked to perfection. The waiter did an excellent job. I'm definitely coming back for more!",
    isLike: true,
  };
  const { container, getByRole, getByTestId } = render(<Post value={data} />);
  const parent = getByTestId('parent');
  const child = getByTestId('child');
  const buttons = container.querySelectorAll('button svg');
  // test render post
  expect(parent).toContainElement(child);
  // // test click follow
  // act(() => {
  //     if (buttons[0]) {
  //         fireEvent.click(buttons[0]);
  //     }
  // })
  // const stylesFollow = getComputedStyle(buttons[0]);

  // expect(stylesFollow.color).toBe('rgb(244, 67, 54)');

  // test click unlike
  act(() => {
    if (buttons[1]) {
      fireEvent.click(buttons[1]);
    }
  });
  const stylesLike = getComputedStyle(buttons[1]);

  expect(stylesLike.color).toBe('rgb(224, 224, 224)');
});

test('testing getFollow', async () => {
  fetch.mockResponse(JSON.stringify([{
    userid: '5',
    followid: '1',
    id: 5,
  }, {
    userid: '3',
    followid: '1',
    id: 6,
  }]));
  await getFollow(1, 2);
});

test('testing unfollowUser', async () => {
  fetch.mockResponse(JSON.stringify({}));
  await unfollowUser(1);
});

test('testing getLike', async () => {
  fetch.mockResponse(JSON.stringify({
    userid: '1',
    postid: '3',
    id: 3,
  }));
  await getLike(1, 2);
});

test('testing unlikePost', async () => {
  fetch.mockResponse(JSON.stringify({}));
  await unLikePost(1);
});

test('testing postLike', async () => {
  fetch.mockResponse(JSON.stringify({
    userid: '1',
    postid: '3',
    id: 3,
  }));
  await likePosts(1, 2);
});

test('testing deletePost', async () => {
  fetch.mockResponse(JSON.stringify({}));
  await deletePost(1);
});
