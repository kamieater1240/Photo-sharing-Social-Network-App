import React from 'react';
import {
  fireEvent, render, screen, getByTestId,
} from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import PostModal, { getComments, saveComment, deleteComments } from '../PostModal';

jest.mock('axios');

require('jest-fetch-mock').enableMocks();

let container;
const onCaptionEdit = jest.fn();

beforeEach(() => {
  fetchMock.doMock();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

const comments = [
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
  {
    id: '3',
    postid: '2',
    userid: '1',
    username: 'Lucy',
    commentText: 'great!!!',
  },
  {
    id: '4',
    postid: '3',
    userid: '1',
    username: 'Lucy',
    commentText: 'great!!!',
  },
  {
    id: '5',
    postid: '4',
    userid: '1',
    username: 'Lucy',
    commentText: 'great!!!',
  },
  {
    id: '6',
    postid: '5',
    userid: '1',
    username: 'Lucy',
    commentText: 'great!!!',
  },
];

describe('test comments operation', () => {
  test('renders post modals', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: [
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
    }));

    await act(async () => {
      await render(<PostModal postid="1" userid="1" open isLike={false} isFollow userImage="./user.png" caption="11" name="Lucy Song" comments={comments} />);
    });
    const parent = screen.getByTestId('parent');
    const child = screen.getByTestId('child');
    expect(parent).toContainElement(child);
  });

  test('comment get success', () => {
    fetch.mockResponse(JSON.stringify(comments));

    getComments(1).then((data) => expect(data).toMatchObject(comments));
  });

  //   test('test comment update error', () => {
  //     fetch.mockReject(new Error('no such comment'));
  //     editComment(1, 1, 1, "KuanYuChen19", "hello!!").then((err) => {
  //         expect(err).not.toBe(undefined);
  //         expect(err.name).toBe('Error');
  //         expect(err.message).toBe('no such comment');
  //     });
  // });

  test('comment get failed', () => {
    fetch.mockReject(new Error('get comment failed'));
    getComments(1).then((err) => expect(err.message).toBe('get comment failed'));
  });

  test('comment add success', () => {
    fetch.mockResponse(JSON.stringify({ status: 200 }));
    const newCmt = {
      id: '11',
      postid: '1',
      userid: '1',
      username: 'Lucy',
      commentText: 'great!!!',
    };
    // saveComment(newCmt.id, newCmt.userid, newCmt.username, newCmt.commentText).then((data) => expect(data.status).toBe(200));
  });

  // test('comment add failed', () => {
  //   fetch.mockReject(new Error('add comment failed'));
  //   const newCmt = {
  //     id: '11',
  //     postid: '1',
  //     userid: '1',
  //     username: 'Lucy',
  //     commentText: 'great!!!',
  //   };
  //   addComment(newCmt.id, newCmt.userid, newCmt.username, newCmt.commentText).then((err) => expect(err.message).toBe('add comment failed'));
  // });

  // test('comment delete success', () => {
  //   fetch.mockResponse(JSON.stringify({ status: 200 }));
  //   deleteComments(1).then((data) => expect(data.status).toBe(200));
  // });

  test('comment delete failed', () => {
    fetch.mockReject(new Error('delete comment failed'));
    deleteComments(1).then((err) => expect(err.message).toBe('delete comment failed'));
  });

  test('edit Caption Cancel', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: [
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
    }));
    render(<PostModal
      postid="1"
      userid="1"
      ownerid="1"
      open
      isLike={false}
      isFollow
      userImage="./user.png"
      caption="11"
      name="Lucy Song"
      comments={comments}
      handleCaptionEdit={onCaptionEdit}
    />);
    const editCaptionButton = screen.getByTestId('test-editCaptionButton');
    await act(async () => {
      await fireEvent.click(editCaptionButton);
    });
    const cancelCaptionEditButton = screen.getByTestId('test-cancelCaptionEditButton');
    await act(async () => {
      await fireEvent.click(cancelCaptionEditButton);
    });
  });

  test('submit comment success', async () => {
    
  
    localStorage.setItem('user_data', {
      "_id": "638bd8be53ec7a04da11456c",
      "userId": "296d3369-fe9d-414f-a272-b73314bf5ab3",
      "userName": "TestUser",
      "firstName": "Test",
      "lastName": "User",
      "email": "testuser@gmail.com",
      "biography": "Graduate Student",
  });
  console.log(localStorage.getItem('user_data'));
    axios.get.mockImplementation(() => Promise.resolve({
      data: [
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
    }));
    axios.post.mockImplementation(() => Promise.resolve({ status: 201, data: {} }));
    await act(async () => {
      render(<PostModal
        postid="1"
        ownerid="1"
        userid="296d3369-fe9d-414f-a272-b73314bf5ab3"
        open
        isLike={false}
        isFollow
        userImage="./user.png"
        caption="11"
        name="Lucy Song"
        comments={comments}
        handleCaptionEdit={onCaptionEdit}
      />);
    });
    const newComment = screen.getByTestId('test-newCommentField');
    const submitCommentButton = screen.getByTestId('test-submitCommentButton');
    await act(async () => {
      await fireEvent.change(newComment, { target: { value: 'Test Comment' } });
    });
    await act(async () => {
      fetch.mockResponse(JSON.stringify(comments));
      await fireEvent.click(submitCommentButton);
    });
  });

  test('submit Caption success', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: [
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
    }));
    axios.put.mockImplementation(() => Promise.resolve({
      status: 201,
      data: {
        id: '1',
        uid: '1',
        isFollow: true,
        name: 'testName',
        image: 'testImage',
        caption: 'testCaption',
        isLike: false,
        isImage: true,
        filetype: 'image/jpg',
        tagged: [],
      },
    }));
    await act(async () => {
      render(<PostModal
        postid="1"
        userid="1"
        ownerid="1"
        open
        isLike={false}
        isFollow
        userImage="./user.png"
        caption="11"
        name="Lucy Song"
        comments={comments}
        handleCaptionEdit={onCaptionEdit}
      />);
    });
    const editCaptionButton = screen.getByTestId('test-editCaptionButton');
    await act(async () => {
      await fireEvent.click(editCaptionButton);
    });
    const submitCaptionButton = screen.getByTestId('test-submitCaptionButton');
    const captionTextField = screen.getByTestId('test-captionTextField').querySelector('textarea');
    await act(async () => {
      await fireEvent.change(captionTextField, { target: { value: 'Test Caption' } });
    });
    await act(async () => {
      await fireEvent.click(submitCaptionButton);
    });
  });
});
