import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import FollowerSuggestion from '../FollowerSuggestion';

require('jest-fetch-mock').enableMocks();

const mockedFunction = jest.fn();

test('unfollow other user error', async () => {
  fetch.mockResponse(JSON.stringify([
    {
      id: 1,
      userName: 'KuanYuChen19',
      email: 'kycjosh@seas.upenn.edu',
      password: '1',
      userBiography: 'Hi~ My name is Kuan-Yu Chen!!!',
      uid: '1',
    },
  ]));
  await act(async () => {
    await render(<FollowerSuggestion uId={1} userFollowingIds={[]} setUserFollowingIds={mockedFunction} userFollowingData={{}} />);
  });
});
