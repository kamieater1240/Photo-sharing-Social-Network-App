import React, { useEffect, useState, useRef } from 'react';
import './UserProfilePage.css';
import UserInfo from './UserInfo';
import FollowerSuggestion from './FollowerSuggestion';
import UserProfilePost from './UserProfilePost';
import {fetchUserPost, unauthorizedUser} from '../../api';
import { getAllUserData, getUserFollowingIds, getUserFollowerIds} from './UserInfo';
import {IconButton} from "@mui/material";
import {AddAPhoto} from "@mui/icons-material";

export async function getUserPost(uid) {
  return fetch(`${fetchUserPost()}${uid}`, {credentials : "include"})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => error);
}

function UserProfilePage() {
  const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('user_data')).userId);
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
    <div className="UserProfilePage">
      <UserInfo 
        postNum={postNum} 
        userFollowingIds={userFollowingIds} 
        setUserFollowingIds={setUserFollowingIds}
        userFollowerIds={userFollowerIds}
        userFollowingData={userFollowingData}
        userFollowerData={userFollowerData}
      />
      <FollowerSuggestion 
        uId={userId}
        userFollowingIds={userFollowingIds} 
        setUserFollowingIds={setUserFollowingIds}
        userFollowingData={userFollowingData}
      />
      <UserProfilePost posts={posts} />
    </div>
  );
}

export default UserProfilePage;
