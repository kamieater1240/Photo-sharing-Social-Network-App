import { render, fireEvent, getByTestId } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import UserInfo, {
  getUserData, getAllUserData, getUserFollowingIds, getUserFollowerIds, followUser, unfollowUser, getFollow,
} from '../UserInfo';

require('jest-fetch-mock').enableMocks();

const mockresp = [
  {
    id: 1,
    userName: 'KuanYuChen19',
    email: 'kycjosh@seas.upenn.edu',
    password: '1',
    userBiography: 'Hi~ My name is Kuan-Yu Chen!!!',
    uid: '1',
  },
  {
    userName: 'qwerqwer',
    email: 'qwer',
    password: 'qwer',
    userBiography: '',
    uid: '2',
    id: 2,
  },
];
test('fetch user data', async () => {
  // expected fetch response
  fetch.mockResponse(JSON.stringify(mockresp[0]));
  getUserData(1).then((data) => expect(data).toMatchObject(mockresp[0]));
});
test('fetch user data failed', () => {
  fetch.mockReject(new Error('get user data failed'));
  getUserData(1).then((err) => expect(err.message).toBe('get user data failed'));
});
test('fetch all user data', async () => {
  // expected fetch response
  fetch.mockResponse(JSON.stringify(mockresp));
  getAllUserData(1).then((data) => expect(data).toMatchObject(mockresp));
});
test('fetch user all data failed', () => {
  fetch.mockReject(new Error('get user all data failed'));
  getAllUserData(1).then((err) => expect(err.message).toBe('get user all data failed'));
});

const mockFollowingIds = [
  {
    userid: '1',
    followid: '5',
    id: 4,
  },
  {
    userid: '1',
    followid: '4',
    id: 7,
  },
  {
    userid: '1',
    followid: '3',
    id: 8,
  },
  {
    userid: '1',
    followid: '2',
    id: 9,
  },
];
test('fetch user following data', async () => {
  // expected fetch response
  fetch.mockResponse(JSON.stringify(mockFollowingIds));
  getUserFollowingIds(1).then((data) => expect(data).toMatchObject(mockFollowingIds));
});
test('fetch user following data failed', () => {
  fetch.mockReject(new Error('get user following data failed'));
  getUserFollowingIds(1).then((err) => expect(err.message).toBe('get user following data failed'));
});

const mockFollowerIds = [
  {
    userid: '5',
    followid: '1',
    id: 5,
  },
  {
    userid: '3',
    followid: '1',
    id: 6,
  },
];
test('fetch user follower data', async () => {
  // expected fetch response
  fetch.mockResponse(JSON.stringify(mockFollowerIds));
  getUserFollowerIds(1).then((data) => expect(data).toMatchObject(mockFollowerIds));
});
test('fetch user follower data failed', () => {
  fetch.mockReject(new Error('get user follower data failed'));
  getUserFollowerIds(1).then((err) => expect(err.message).toBe('get user follower data failed'));
});

const mockFollowId = [
  {
    userid: '1',
    followid: '5',
    id: 4,
  },
];
test('get follow id', () => {
  fetch.mockResponse(JSON.stringify(mockFollowId));
  getFollow(1, 8).then((data) => expect(data).toMatchObject(mockFollowId));
});
test('get follow id error', () => {
  fetch.mockReject(new Error('get follow id failed'));
  getFollow(1, 8).then((err) => expect(err.message).toBe('get follow id failed'));
});

test('follow other user', () => {
  fetch.mockResponse(JSON.stringify({ status: 200 }));
  followUser(1, 8).then((data) => expect(data.status).toBe(200));
});
test('follow other user error', () => {
  fetch.mockReject(new Error('no such user'));
  followUser(1, 8).then((err) => {
    expect(err).not.toBe(undefined);
    expect(err.name).toBe('Error');
    expect(err.message).toBe('no such user');
  });
});

test('unfollow other user', () => {
  fetch.mockResponse(JSON.stringify({ status: 200 }));
  unfollowUser(8).then((data) => expect(data.status).toBe(200));
});
test('unfollow other user error', () => {
  fetch.mockReject(new Error('no such user'));
  unfollowUser(8).then((err) => {
    expect(err).not.toBe(undefined);
    expect(err.name).toBe('Error');
    expect(err.message).toBe('no such user');
  });
});

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
    await render(<UserInfo postNum={1} userFollowingIds={[]} setUserFollowingIds={mockedFunction} userFollowerIds={[]} userFollowingData={{}} userFollowerData={{}} />);
  });
});

// test('test unfollow other user error', async () => {
//     fetch.mockResponse(JSON.stringify([
//         {
//             "id": 1,
//             "userName": "KuanYuChen19",
//             "email": "kycjosh@seas.upenn.edu",
//             "password": "1",
//             "userBiography": "Hi~ My name is Kuan-Yu Chen!!!",
//             "uid": "1"
//         }
//     ]));
//     await act(async()=>{
//         await render(<UserInfo postNum={1} userFollowingIds={[]} setUserFollowingIds={mockedFunction} userFollowerIds={[]} userFollowingData={{}} userFollowerData={{}}/>)
//     });

//     const followerButton = screen.getByTestId('test-followerClick')
//     await act(async () => {
//         await fireEvent.click(followerButton);
//     })
// });
