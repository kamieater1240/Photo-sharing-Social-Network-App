import React, { useEffect, useState, useRef } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';

import IconButton from '@mui/material/IconButton';
import { red, grey } from '@mui/material/colors';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import {
  fetchUserData, fetchUserFollowing, fetchUserFollower, fetchAllUser, follow, unauthorizedUser,
} from '../../api';
import './OtherUserInfo.css';

export async function getUserData(uid) {
  return fetch(`${fetchUserData()}${uid}`, {credentials : 'include'})
    .then((data) => {
        if(data.status === 401) unauthorizedUser()
        return data.json()
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

export async function getUserFollowingIds(uid) {
  return fetch(`${fetchUserFollowing()}${uid}`,{credentials : 'include'})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

export async function getUserFollowerIds(uid) {
  return fetch(`${fetchUserFollower()}${uid}`,{credentials : 'include'})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

export async function getAllUserData() {
  return fetch(`${fetchAllUser()}`,{credentials : 'include'})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

export async function followUser(userId, ownerId) {
  return fetch(`${follow()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include',
    body: JSON.stringify({ userId, followId: ownerId }),
  })
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

export async function unfollowUser(followId) {
  const url = new URL(follow());

  return fetch(`${follow()}` + `/${followId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include',
  })
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

export async function getFollow(userId, ownerId) {
  const url = new URL(follow());
  const params = new URLSearchParams(url.search);
  params.append('userId', userId);
  params.append('followId', ownerId);
  const new_url = new URL(`${url.href}?${params}`);
  return fetch(new_url.toString(), {credentials : 'include'})
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

function OtherUserInfo(props) {
  const { postNum, id, userFollowingIds, setUserFollowingIds,
    userFollowerIds, setUserFollowerIds, userFollowingData, userFollowerData, } = props;
  const [loggedInUserId, setLoggedInUserId] = useState(JSON.parse(localStorage.getItem('user_data')).userId);
  const [loggedInUserFollowingIds, setLoggedInUserFollowingIds] = useState([]);
  const [userId, setUserId] = useState(id);
  const [userData, setUserData] = useState({});
  const [showFollower, setShowFollower] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);



  const firstRendering = useRef(true);
  useEffect(() => {
    async function updateUserData() {
      let data = await getUserData(userId);
      setUserData(data);
      
      data = await getUserFollowingIds(loggedInUserId);
      const loggedUserFollowingIds = data.map((x) => x.followId);
      setLoggedInUserFollowingIds(loggedUserFollowingIds);
    }

    // only load data on the first rendering
    if (firstRendering.current) {
      firstRendering.current = false;
      updateUserData(userId);
    }
  });

  const followerClickHandler = () => {
    const follower_block = document.getElementById('Follower-block');
    const following_block = document.getElementById('Following-block');
    if (!showFollower) {
      follower_block.style.display = 'block';
      setShowFollower(true);
      following_block.style.display = 'none';
      setShowFollowing(false);
    } else {
      follower_block.style.display = 'none';
      setShowFollower(false);
    }
  };

  const followingClickHandler = () => {
    const following_block = document.getElementById('Following-block');
    const follower_block = document.getElementById('Follower-block');
    if (!showFollowing) {
      following_block.style.display = 'block';
      setShowFollowing(true);
      follower_block.style.display = 'none';
      setShowFollower(false);
    } else {
      following_block.style.display = 'none';
      setShowFollowing(false);
    }
  };

  const closeIconClickHandler = (e) => {
    if (e.target.parentElement.id === 'Follower-block') {
      const follower_block = document.getElementById(e.target.parentElement.id);
      follower_block.style.display = 'none';
      setShowFollower(false);
    } else if (e.target.parentElement.id === 'Following-block') {
      const following_block = document.getElementById(e.target.parentElement.id);
      following_block.style.display = 'none';
      setShowFollower(false);
    }
  };

  const handleFollowClick = async (e, loggedInUserId, otherUserId, isFollow) => {
    if (isFollow === false) {
      await followUser(loggedInUserId, otherUserId);

      let followerData = await getUserFollowerIds(userId);
      let followerIds = followerData.map((x) => x.userId);
      setUserFollowerIds(followerIds);

      let followingData = await getUserFollowingIds(loggedInUserId);
      let followingIds = followingData.map((x) => x.followId);
      setLoggedInUserFollowingIds(followingIds);
    } else {
      const data = await getFollow(loggedInUserId, otherUserId);
      const followId = data.followDataId;
      await unfollowUser(followId);

      let followerData = await getUserFollowerIds(userId);
      let followerIds = followerData.map((x) => x.userId);
      setUserFollowerIds(followerIds);
      
      let followingData = await getUserFollowingIds(loggedInUserId);
      let followingIds = followingData.map((x) => x.followId);
      setLoggedInUserFollowingIds(followingIds);
    }
  };

  return (
    <div className="OtherUserInfoBlock" id="OtherUserInfoBlock">
      <img src={userData.profilePicture} className="App-logo" alt="logo" />
      <b className="User-name">{userData.userName}</b>
      <IconButton aria-label="settings"  onClick={(event) => handleFollowClick(event, loggedInUserId, userId, loggedInUserFollowingIds.includes(userId))}>
        <PersonAddIcon style={{ color: loggedInUserFollowingIds.includes(userId) ? red[500] : grey[300] }} />
      </IconButton>
      <b className="Post-number">
        {postNum}
        {' '}
        Posts
      </b>
      <b className="Follower-number" onClick={followerClickHandler}>
        {userFollowerIds && userFollowerIds.length}
        {' '}
        Followers
      </b>
      <b className="Following-number" onClick={followingClickHandler}>
        {userFollowingIds && userFollowingIds.length}
        {' '}
        Followings
      </b>
      <p className="User-biography">{userData.userBiography}</p>
      <Paper
        style={{
          height: 300, maxWidth: 450, overflow: 'auto', position: 'absolute', top: 250, left: 600, zIndex: 1000,
        }}
        id="Following-block"
        className="Following-block"
      >
        <HighlightOffIcon className="Close-icon" onClick={closeIconClickHandler} />
        <Box sx={{ width: 400 }}>
          <Typography
            id="ellipsis-list-demo"
            level="body4"
            textTransform="uppercase"
            fontWeight="xl"
            mb={1}
            sx={{ letterSpacing: '0.15rem' }}
          >
            Following
          </Typography>
          <List
            aria-labelledby="ellipsis-list-demo"
            sx={{ '--List-decorator-size': '56px' }}
          >
            {Object.values(userFollowingData).map((item, index) => (
              <ListItem key={index}>
                <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                  <Avatar src={item.profilePicture} />
                </ListItemDecorator>
                <ListItemContent>
                  <Typography>{item.userName}</Typography>
                </ListItemContent>
                {
                  loggedInUserId !== item.userId &&
                  <IconButton aria-label="settings" onClick={(event) => handleFollowClick(event, loggedInUserId, item.userId, userFollowingIds.includes(item.userId))}>
                    <PersonAddIcon style={{ color: userFollowingIds.includes(item.userId) ? red[500] : grey[300] }} />
                  </IconButton>
                }
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      <Paper
        style={{
          height: 300, maxWidth: 450, overflow: 'auto', position: 'absolute', top: 250, left: 600, zIndex: 1000,
        }}
        id="Follower-block"
        className="Follower-block"
      >
        <HighlightOffIcon className="Close-icon" onClick={closeIconClickHandler} />
        <Box sx={{ width: 400 }}>
          <Typography
            id="ellipsis-list-demo"
            level="body4"
            textTransform="uppercase"
            fontWeight="xl"
            mb={1}
            sx={{ letterSpacing: '0.15rem' }}
          >
            Follower
          </Typography>
          <List
            aria-labelledby="ellipsis-list-demo"
            sx={{ '--List-decorator-size': '56px' }}
          >
            {Object.values(userFollowerData).map((item, index) => (
              <ListItem key={index}>
                <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                  <Avatar src={item.profilePicture} />
                </ListItemDecorator>
                <ListItemContent>
                  <Typography>{item.userName}</Typography>
                </ListItemContent>
                {
                  loggedInUserId !== item.userId &&
                  <IconButton aria-label="settings" onClick={(event) => handleFollowClick(event, loggedInUserId, item.userId, userFollowingIds.includes(item.userId))}>
                    <PersonAddIcon style={{ color: userFollowingIds.includes(item.userId) ? red[500] : grey[300] }} />
                  </IconButton>
                }
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </div>
  );
}

export default OtherUserInfo;
