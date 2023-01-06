import React from 'react';
import { render, screen } from '@testing-library/react';

import OtherUserPost from '../OtherUserPost';

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

  const { container } = render(<OtherUserPost value={data} />);
  expect(container.firstChild.classList.contains('OtherUserPost')).toBe(true);
});
