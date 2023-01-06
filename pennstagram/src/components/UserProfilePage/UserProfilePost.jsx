import React, { useEffect, useState, useRef } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import UserPost from './UserPost';
import './UserProfilePost.css';

function UserProfilePost(props) {
  const { posts } = props;
  return (
    <ImageList
      sx={{
        position: 'absolute', top: 400, left: 210, width: 1000, height: 600,
      }}
      cols={3}
      className="UserProfilePost"
    >
      {posts.map((item, index) => (
        <ImageListItem key={index}>
          <UserPost value={item} />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export default UserProfilePost;
