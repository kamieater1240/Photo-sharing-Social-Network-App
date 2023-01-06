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
  fetchUserData, fetchUserFollowing, fetchUserFollower, fetchAllUser, follow, uploadProfilePic, unauthorizedUser,
} from '../../api';
import './UserInfo.css';
import {AddAPhoto} from "@mui/icons-material";
import {Button} from "@mui/material";

export async function getUserData(uid) {
  return fetch(`${fetchUserData()}${uid}` , {credentials : "include"})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => error);
}

export async function getUserFollowingIds(uid) {
  return fetch(`${fetchUserFollowing()}${uid}`, {credentials : "include"})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => error);
}

export async function getUserFollowerIds(uid) {
  return fetch(`${fetchUserFollower()}${uid}`, {credentials : "include"})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => error);
}

export async function getAllUserData() {
  return fetch(`${fetchAllUser()}`, {credentials : "include"})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => error);
}

export async function followUser(userId, ownerId) {
  return fetch(`${follow()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include',
    body: JSON.stringify({ userId: userId, followId: ownerId }),
  })
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => {
      console.log(error.message)
      throw error
    });
}

export async function unfollowUser(followId) {
  const url = new URL(follow());

  return fetch(`${follow()}/${followId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include'
  })
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => error);
}

export async function getFollow(userId, ownerId) {
  const url = new URL(follow());
  const params = new URLSearchParams(url.search);
  params.append('userId', userId);
  params.append('followId', ownerId);
  const newUrl = new URL(`${url.href}?${params}`);
  return fetch(newUrl.toString(), {credentials : "include"})
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => error);
}

export async function uploadProfilePicture(data) {
  return fetch(`${uploadProfilePic()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : "include",
    body: JSON.stringify(data),
  })
      .then((response) => {
        if(response.status === 401) unauthorizedUser()
        if (response.status >= 200 && response.status <= 304) {
          return response.json();
        }
      })
      .catch((error) => error);
}

function UserInfo(props) {
  const {
    postNum, userFollowingIds, setUserFollowingIds,
    userFollowerIds, userFollowingData, userFollowerData,
  } = props;
  const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('user_data')).userId);
  const [userProfilePicture, setUserProfilePicture] = useState(JSON.parse(localStorage.getItem('user_data')).profilePicture);
  const [biography, setBiography] = useState(JSON.parse(localStorage.getItem('user_data')).biography);
  const [userData, setUserData] = useState({});
  const [showFollower, setShowFollower] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const firstRendering = useRef(true);
  useEffect(() => {
    async function updateUserData() {
      const data = await getUserData(userId);
      setUserData(data);
    }

    // only load data on the first rendering
    if (firstRendering.current) {
      firstRendering.current = false;
      updateUserData(userId);
    }
  });

  const followerClickHandler = () => {
    const followerBlock = document.getElementById('Follower-block');
    const followingBlock = document.getElementById('Following-block');
    if (!showFollower) {
      followerBlock.style.display = 'block';
      setShowFollower(true);
      followingBlock.style.display = 'none';
      setShowFollowing(false);
    } else {
      followerBlock.style.display = 'none';
      setShowFollower(false);
    }
  };

  const followingClickHandler = () => {
    const followingBlock = document.getElementById('Following-block');
    const followerBlock = document.getElementById('Follower-block');
    if (!showFollowing) {
      followingBlock.style.display = 'block';
      setShowFollowing(true);
      followerBlock.style.display = 'none';
      setShowFollower(false);
    } else {
      followingBlock.style.display = 'none';
      setShowFollowing(false);
    }
  };

  const closeIconClickHandler = (e) => {
    if (e.target.parentElement.id === 'Follower-block') {
      const followerBlock = document.getElementById(e.target.parentElement.id);
      followerBlock.style.display = 'none';
      setShowFollower(false);
    } else if (e.target.parentElement.id === 'Following-block') {
      const followingBlock = document.getElementById(e.target.parentElement.id);
      followingBlock.style.display = 'none';
      setShowFollower(false);
    }
  };

  const hFClick = async (e, theUserId, otherUserId, isFollow) => {
    if (isFollow === false) {
      await followUser(theUserId, otherUserId);

      const followingData = await getUserFollowingIds(theUserId);
      const followingIds = followingData.map((x) => x.followId);
      setUserFollowingIds(followingIds);
    } else {
      const data = await getFollow(theUserId, otherUserId);
      const followId = data.followDataId;
      await unfollowUser(followId);

      const followingData = await getUserFollowingIds(theUserId);
      const followingIds = followingData.map((x) => x.followId);
      setUserFollowingIds(followingIds);
    }
  };


  const onLoadCallBack = async (fileString) => {
    try {
      const response = await uploadProfilePicture({userId: userId, profilePicture: fileString})
      if (response.message === "Profile Picture updated successfully") {
        const user_data = await JSON.parse(localStorage.getItem('user_data'))
        user_data['profilePicture'] = fileString
        await localStorage.setItem('user_data',JSON.stringify(user_data))
        setUserProfilePicture(fileString)
      } else {
        throw Error("Error Uploading Profile Picture Please Try Again")
      }
    } catch (err) {
     alert(err.message)
    }
  }


  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      onLoadCallBack(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  const setProfilePic = async (e) => {
    try {
      getBase64(e.target.files[0])
      // console.log(fileData)
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <div className="UserInfoBlock" id="UserInfoBlock">
      <div>
        <img src={userProfilePicture} className="App-logo" alt="logo" />
        <p style = {{float : "left"}}>
          <label htmlFor="upload-profile-pic">
            <input
                style={{ display: 'none', zIndex : "999999"}}
                id="upload-profile-pic"
                name="upload-profile-pic"
                type="file"
                accept={"image/jpeg"}
                onChange={(e) => setProfilePic(e)}
            />
            Upload Profile Picture
          </label>
        </p>
      </div>
      <b className="User-name">{userData.userName}</b>
      <b className="Post-number">
        {postNum}
        {' '}
        Posts
      </b>
      <b className="Follower-number" data-testid={"test-followerClick"} onClick={followerClickHandler} onKeyDown={followerClickHandler}>
        {userFollowerIds && userFollowerIds.length}
        {' '}
        Followers
      </b>
      <b className="Following-number" onClick={followingClickHandler} onKeyDown={followingClickHandler}>
        {userFollowingIds && userFollowingIds.length}
        {' '}
        Followings
      </b>
      <p className="User-biography">{userData.biography}</p>
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
              <ListItem key={item.userId}>
                <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                  <Avatar src={item.profilePicture} />
                </ListItemDecorator>
                <ListItemContent>
                  <Typography>{item.userName}</Typography>
                </ListItemContent>
                <IconButton
                  aria-label="settings"
                  onClick={(e) => hFClick(e, userId, item.userId, userFollowingIds.includes(item.userId))}
                >
                  <PersonAddIcon style={{ color: userFollowingIds.includes(item.userId) ? red[500] : grey[300] }} />
                </IconButton>
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
              <ListItem key={item.userId}>
                <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                  <Avatar src={item.profilePicture} />
                </ListItemDecorator>
                <ListItemContent>
                  <Typography>{item.userName}</Typography>
                </ListItemContent>
                <IconButton
                  aria-label="settings"
                  onClick={(e) => hFClick(e, userId, item.userId, userFollowingIds.includes(item.userId))}
                >
                  <PersonAddIcon style={{ color: userFollowingIds.includes(item.userId) ? red[500] : grey[300] }} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </div>
  );
}

export default UserInfo;
