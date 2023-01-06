import React from 'react';
import { render, screen } from '@testing-library/react';

import OtherUserProfilePost from '../OtherUserProfilePost';

test('If UserProfilePost is rendered correctly', () => {
  const data = [
    {
      id: 1,
      uid: '63464682d8dd6b8e6d472d8a',
      isFollow: true,
      name: 'KuanYuChen19',
      image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      caption: "My taste buds are still singing from our last visit! The food was cooked to perfection. The waiter did an excellent job. I'm definitely coming back for more!",
      isLike: false,
      title: 'Breakfast',
    },
    {
      id: 6,
      uid: '63464682d8dd6b8e6d472d8a',
      isFollow: true,
      name: 'KuanYuChen19',
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      caption: "My taste buds are still singing from our last visit! The food was cooked to perfection. The waiter did an excellent job. I'm definitely coming back for more!",
      isLike: false,
      title: 'Lunch',
    },
    {
      id: 7,
      uid: '63464682d8dd6b8e6d472d8a',
      isFollow: true,
      name: 'KuanYuChen19',
      image: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      caption: "My taste buds are still singing from our last visit! The food was cooked to perfection. The waiter did an excellent job. I'm definitely coming back for more!",
      isLike: false,
      title: 'Dinner',
    },
    {
      id: 8,
      uid: '63464682d8dd6b8e6d472d8a',
      isFollow: true,
      name: 'KuanYuChen19',
      image: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      caption: "My taste buds are still singing from our last visit! The food was cooked to perfection. The waiter did an excellent job. I'm definitely coming back for more!",
      isLike: false,
      title: 'Camera',
    },
  ];

  const { container } = render(<OtherUserProfilePost posts={data} />);
  expect(container.firstChild.classList.contains('OtherUserProfilePost')).toBe(true);
});
