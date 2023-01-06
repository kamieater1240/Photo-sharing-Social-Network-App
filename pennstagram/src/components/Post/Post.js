import * as React from 'react';
import { useRef, useEffect } from 'react';
import {
  Card, CardHeader, CardMedia, CardContent, CardActions, CardActionArea,
  Avatar, IconButton, Typography, Grid,
} from '@mui/material';
import { red, grey } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import HideSourceIcon from '@mui/icons-material/HideSource';
import axios from 'axios';
import PostModal from './PostModal';
import {
  fetchComments, follow, fetchPosts, likePost, unauthorizedUser, hidePost,
} from '../../api';

export async function getFollow(userId, ownerId) {
  const url = new URL(follow());
  const params = new URLSearchParams(url.search);
  params.append('userId', userId);
  params.append('followId', ownerId);
  const newUrl = new URL(`${url.href}?${params}`);
  return fetch(newUrl.toString(), {credentials : 'include'})
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => error);
}

export async function getLike(userId, postId) {
  const url = new URL(likePost());
  const params = new URLSearchParams(url.search);
  params.append('userId', userId);
  params.append('postId', postId);
  const newUrl = new URL(`${url.href}?${params}`);
  return fetch(newUrl.toString(),{credentials : 'include'})
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => error);
}

export async function likePosts(userId, postId) {
  return fetch(`${likePost()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include',
    body: JSON.stringify({ userId, postId }),
  })
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      return response.json()
    })
    .catch((error) => error);
}

export async function unLikePost(likeId) {
  return fetch(`${likePost()}` + `/${likeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include'
  })
  .then((response) => {
    if(response.status === 401) unauthorizedUser()
    return response.json()
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
    body: JSON.stringify({ userId, followId: ownerId }),
  })
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      return response.json()
    })
    .catch((error) => error);
}

export async function unfollowUser(followId) {
  const url = new URL(follow());
  const params = new URLSearchParams(url.search);

  return fetch(`${follow()}` + `/${followId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include'
  })
    .then((response) => {
      if(response.status === 401) unauthorizedUser()
      return response.json()
    })
    .catch((error) => error);
}

export async function deletePost(postid) {
  return fetch(`${fetchPosts()}` + `/${postid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include'
  })
  .then((response) => {
    if(response.status === 401) unauthorizedUser()
    return response.json()
  })
  .catch((error) => error);
}

export async function hideThePost(userId, postId) {
  return fetch(`${hidePost()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include',
    body: JSON.stringify({ userId, postId }),
  })
  .then((response) => {
    if(response.status === 401) unauthorizedUser()
    return  response.json()
  })
  .catch((error) => error);
}

async function fetchPost(pid) {
  const url = `${fetchPosts()}/${pid}`;
  const response = await axios(url, {withCredentials : true});
  if(response.status === 401) unauthorizedUser()
  if (response.status === 200) {
    return response;
  }
}

export default function Post(props) {
  const [userid, setUserid] = React.useState(JSON.parse(localStorage.getItem('user_data')).userId);
  const [userImage, setUserImage] = React.useState(JSON.parse(localStorage.getItem('user_data')).profilePicture);
  const [pid, setPostId] = React.useState(props.value.postId);
  const [ownerid, setOwnerid] = React.useState(props.value.userId);
  const [postTime, setPostTime] = React.useState(new Date(props.value.updateTime).toLocaleDateString("en-US"))
  const [name, setName] = React.useState(props.value.userName);
  const [caption, setCaption] = React.useState(props.value.caption);
  const [isFollow, setFollow] = React.useState(false);
  const [image, setImage] = React.useState(props.value.data);
  const [isLike, setLike] = React.useState(false);
  const [isImage, setIsImage] = React.useState(props.value.isImage);
  const [type, setType] = React.useState(props.value.type);
  const [expanded, setExpanded] = React.useState(false);
  const [tagged, setTagged] = React.useState(props.value.tagged);
  const [filetype, setFiletype] = React.useState(props.value.type);
  const [followid, setFollowid] = React.useState(0);
  const [openDeleteMenu, setopenDeleteMenu] = React.useState(null);
  const [openHideMenu, setopenHideMenu] = React.useState(null);
  const [likeid, setLikeid] = React.useState(0);

  const handleOpen = async () => {
    setExpanded(true);
  };
  const handleClose = () => {
    setExpanded(false);
  };

  const handleFollowClick = async (e) => {
    if (isFollow === false) {
      const data = await followUser(userid, ownerid);
      console.log(data);
      setFollowid(data.id);
      setFollow(true);
    } else {
      await unfollowUser(followid);
      setFollowid(0);
      setFollow(false);
    }
  };

  const handleLikeClick = async (e) => {
    if (isLike === false) {
      const data = await likePosts(userid, pid);
      setLikeid(data.id);
      setLike(true);
    } else {
      await unLikePost(likeid);
      setLikeid(0);
      setLike(false);
    }
  };

  const deleteMenuItems = [
    {
      title: 'Delete Post',
    },
    {
      title: 'Cancel',
    },
  ];
  const open = Boolean(openDeleteMenu);
  const handleDeleteMenuClick = (e) => {
    setopenDeleteMenu(e.currentTarget);
  };
  const handleDeleteMenuClose = () => {
    setopenDeleteMenu(null);
  };
  const handleDeletePostClick = async (e) => {
    await deletePost(pid);
    console.log("deleted");
    // get all posts again
    window.location.reload(false);
    props.fetchPosts();
  };

  const hideMenuItems = [
    {
      title: 'Hide Post',
    },
    {
      title: 'Cancel',
    },
  ];
  const handleHideMenuClick = (e) => {
    setopenHideMenu(e.currentTarget);
  };
  const handleHideMenuClose = () => {
    setopenHideMenu(null);
  };
  const handleHidePostClick = async (e) => {
    await hideThePost(userid, pid);
    console.log("hided");
    // get all posts again
    props.fetchPosts();
    window.location.reload(false);
  };

  const handleCaptionEdit = async () => {
    const data = await fetchPost(pid);
    console.log('Post.js', data);
    setCaption(data.data[0].caption);
  };

  const firstRendering = useRef(true);
  useEffect(() => {
    async function updateFollow() {
      const followStatus = await getFollow(userid, ownerid);
      const likeStatus = await getLike(userid, pid);
      // set follow state
      if (followStatus.followDataId != null) {
        setFollow(true);
        setFollowid(followStatus.followDataId);
      } else {
        setFollow(false);
      }

      // set like post state
      if (likeStatus.likeDataId != null) {
        setLike(true);
        setLikeid(likeStatus.likeDataId);
      } else {
        setLike(false);
      }
    }

    // only load data on the first rendering
    if (firstRendering.current) {
      firstRendering.current = false;
      updateFollow(userid, ownerid);
    }
  });
  return (
    <div data-testid="post-parent">
      <Card data-testid="post-child" sx={{ maxWidth: 500, width: 400 }}>
        {
        (userid === ownerid)
          ? (
            <CardHeader
              avatar={(
                <Avatar src={userImage} aria-label="recipe" />
              )}
              action={(
                <>
                  <IconButton
                    data-testid="follow"
                    aria-label="follows"
                    userid={userid}
                    ownerid={ownerid}
                    onClick={handleDeleteMenuClick}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={openDeleteMenu}
                    keepMounted
                    open={Boolean(openDeleteMenu)}
                    onClose={handleDeleteMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    {deleteMenuItems.map((item) => (
                      item.title === 'Delete Post' ? (
                        <MenuItem onClick={handleDeletePostClick} key={item.title} value={item.title}>
                          {item.title}
                        </MenuItem>
                      )
                        : (
                          <MenuItem onClick={handleDeleteMenuClose} key={item.title} value={item.title}>
                            {item.title}
                          </MenuItem>
                        )
                    ))}
                  </Menu>
                </>
              )}
              title={name}
              subheader={postTime}
            />
          )
          : (
            <CardHeader
              avatar={(
                <Avatar src={userImage} aria-label="recipe" />
              )}
              action={(
                <>
                  <IconButton
                    data-testid="follow"
                    aria-label="follows"
                    userid={userid}
                    ownerid={ownerid}
                    onClick={handleHideMenuClick}
                  >
                    <HideSourceIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={openHideMenu}
                    keepMounted
                    open={Boolean(openHideMenu)}
                    onClose={handleHideMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    {hideMenuItems.map((item) => (
                      item.title === 'Hide Post' ? (
                        <MenuItem onClick={handleHidePostClick} key={item.title} value={item.title}>
                          {item.title}
                        </MenuItem>
                      )
                        : (
                          <MenuItem onClick={handleHideMenuClose} key={item.title} value={item.title}>
                            {item.title}
                          </MenuItem>
                        )
                    ))}
                  </Menu>

                  <IconButton data-testid="follow" aria-label="follows" userid={userid} ownerid={ownerid} onClick={(e) => handleFollowClick(e)}>
                    <PersonAddIcon style={{ color: isFollow ? red[500] : grey[300] }} />
                  </IconButton>
                </>
              )}
              title={name}
              subheader={postTime}
            />
          )
        }

        <CardActionArea data-testid="test-clickableArea" onClick={handleOpen}>
              <CardMedia
                component="img"
                height="194"
                src={`${image}`}
                alt="Image not loaded"
              />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {caption}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions disableSpacing>
          <IconButton data-testid="follow" aria-label="add to favorites" onClick={handleLikeClick}>
            <FavoriteIcon style={{ color: isLike ? red[500] : grey[300] }} />
          </IconButton>
          <IconButton aria-label="comment" onClick={handleOpen}>
            <ChatBubbleOutlineIcon />
          </IconButton >
          <IconButton
            style={{ marginLeft: 'auto' }}
            expand={expanded.toString()}
            onClick={handleOpen}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <OpenInFullIcon />
          </IconButton>
        </CardActions>
      </Card>
      <PostModal
        image={image}
        isImage={isImage}
        type={type}
        postid={pid}
        userid={userid}
        ownerid={ownerid}
        open={expanded}
        isLike={isLike}
        isFollow={isFollow}
        userImage={userImage}
        caption={caption}
        handleClose={handleClose}
        handleLikeClick={handleLikeClick}
        handleFollowClick={handleFollowClick}
        name={name}
        tagged={tagged}
        filetype={filetype}
        handleCaptionEdit={handleCaptionEdit}
        fetchPosts={fetchPosts}
        deletePost={deletePost}
      />
    </div>
  );
}
