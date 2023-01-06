import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'
import './OtherUserProfilePage.css';
import OtherUserInfo from './OtherUserInfo';
import OtherUserProfilePost from './OtherUserProfilePost';
import {fetchUserPost, unauthorizedUser} from '../../api';
import { getAllUserData, getUserFollowingIds, getUserFollowerIds } from './OtherUserInfo';

async function getUserPost(uid) {
  return fetch(`${fetchUserPost()}${uid}`,{credentials : 'include'})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => {
      console.log(error);
    });
}

function OtherUserProfilePage() {
  const {id} = useParams();
  const [userId, setUserId] = useState(id);
  const [posts, setPosts] = useState([]);
  const [userFollowingIds, setUserFollowingIds] = useState([]);
  const [userFollowerIds, setUserFollowerIds] = useState([]);
  const [userFollowingData, setUserFollowingData] = useState({});
  const [userFollowerData, setUserFollowerData] = useState({});

  const firstRendering = useRef(true);
  useEffect(() => {
    async function updateUserPost() {
      let data = await getUserPost(userId);
      setPosts(data);

      data = await getUserFollowingIds(userId);
      const followingIds = data.map((x) => x.followId);
      setUserFollowingIds(followingIds);

      data = await getUserFollowerIds(userId);
      const followerIds = data.map((x) => x.userId);
      setUserFollowerIds(followerIds);

      data = await getAllUserData();
      const followingData = data.filter((x) => followingIds.includes(x.userId));
      setUserFollowingData(followingData);
      const followerData = data.filter((x) => followerIds.includes(x.userId));
      setUserFollowerData(followerData);
    }

    // only load data on the first rendering
    if (firstRendering.current) {
      firstRendering.current = false;
      updateUserPost(userId);
    }
  });

  const postNum = posts.length;

  return (
    <div className="OtherUserProfilePage">
      <OtherUserInfo
        postNum={postNum}
        id={userId}
        userFollowingIds={userFollowingIds} 
        setUserFollowingIds={setUserFollowingIds}
        userFollowerIds={userFollowerIds}
        setUserFollowerIds={setUserFollowerIds}
        userFollowingData={userFollowingData}
        userFollowerData={userFollowerData}
      />
      <OtherUserProfilePost posts={posts} id={userId}/>
    </div>
  );
}

export default OtherUserProfilePage;
