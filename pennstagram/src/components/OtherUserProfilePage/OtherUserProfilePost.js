import React, { useEffect, useState, useRef } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import OtherUserPost from './OtherUserPost';
import './OtherUserProfilePost.css';

function OtherUserProfilePost(props) {
  return (
    <ImageList
      sx={{
        position: 'absolute', top: 400, left: 210, width: 1000, height: 600,
      }}
      cols={3}
      className="OtherUserProfilePost"
    >
      {props.posts.map((item, index) => (
        <ImageListItem key={index}>
          <OtherUserPost value={item} id={props.id}/>
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export default OtherUserProfilePost;
