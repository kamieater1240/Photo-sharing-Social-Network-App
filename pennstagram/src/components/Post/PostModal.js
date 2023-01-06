import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {grey, red} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import {Check, Clear, ModeEdit} from '@mui/icons-material';
import {Mention, MentionsInput} from 'react-mentions';
import {createComment, deleteComment, fetchAllUser, fetchComments, unauthorizedUser, updateCaption,} from '../../api';
import Comment from './Comment';
import './style.css';
import {Avatar, Box, Divider, IconButton, List, Modal, TextField,} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const modalStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid grey[300]',
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

const mentionStyle = {
  width: '-webkit-fill-available',
  control: {
    /* WebKit-based browsers will ignore this. */
    width: '-webkit-fill-available', /* Mozilla-based browsers will ignore this. */
    backgroundColor: '#fff',
    fontSize: 16,
    // fontWeight: 'normal',
  },
  '&multiLine': {
    control: {
      fontFamily: 'monospace',
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
      border: '1px solid silver',
    },
  },
  '&singleLine': {
    display: 'inline-block',
    width: 180,
    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
    },
  },
  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 16,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
};

export async function getComments(pid) {
  return fetch(`${fetchComments()}${pid}`, {credentials : 'include'})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => error);
}

export async function deleteComments(commentid) {
  return fetch(`${deleteComment()}` + `/${commentid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include',
  })
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
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

export default function PostModal(props) {
  const [comments, setComments] = React.useState(props.comments | []);
  const [newComment, setNewComment] = React.useState('');
  const [caption, setCaption] = useState(props.caption);
  const [captionEdit, setCaptionEdit] = useState(false);
  const [users, setUsers] = useState([]);
  const [openDeleteMenu, setopenDeleteMenu] = React.useState(null);

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
    await props.deletePost(props.postid);
    console.log("deleted in modal");
    // get all posts again
    props.fetchPosts();
  };


  useEffect(() => {
    axios.get(fetchAllUser(), {withCredentials : true}).then((result) => {
      const fetchedUsers = result.data;
      const userObject = [];
      fetchedUsers.forEach((user) => {
        const temp = {};
        temp.id = user.userId;
        temp.display = user.userName;
        userObject.push(temp);
      });
      setUsers(userObject);
    }).catch((error) => {
      if(error.response.status === 401) unauthorizedUser()
    });
  }, []);

  function captionEditFunction(e) {
    const newCaption = e.target.value;
    setCaption(newCaption);
  }

  async function saveComment() {
    let currentComment = newComment;
    currentComment = currentComment.split('@@@__').join('<a href="/user/');
    currentComment = currentComment.split('^^^__').join('">');
    currentComment = currentComment.split('@@@^^^').join('</a>');
    if (currentComment !== '') {
      const comment = currentComment.trim();
      const requestBody = {
        postId: props.postid,
        userId: localStorage.getItem('UID'),
        userName: JSON.parse(JSON.stringify(localStorage.getItem('user_data'))).userName,
        commentText: comment,
      };
      const url = createComment();
      const response = await axios.post(url, requestBody, {withCredentials : true} );
      if(response.status === 401) unauthorizedUser()
      if (response.status === 200) {
        // TODO : Pass props from parent component
        const update = await getComments(props.postid);
        setComments(update);
        setNewComment('');
      }

    }
  }

  function cancelCaptionEdit() {
    setCaption(props.caption);
    setCaptionEdit(!captionEdit);
  }

  async function submitCaption() {
    console.log(props);
    const requestBody = {
      caption,
      postId: props.postid,
    };
    const url = `${updateCaption()}`;
    const response = await axios.put(url, requestBody, {withCredentials : true});
    if(response.status === 401) unauthorizedUser()
    if (response.status >= 200 && response.status < 300) {
      setCaptionEdit(!captionEdit);
      // TODO : handleCaptionEdit in Post.js
      props.handleCaptionEdit();
    }
  }

  const handleDeleteComment = async (e) => {
    const commentid = e.currentTarget.getAttribute('data-commentid');
    const data = await deleteComments(commentid);
    const update = await getComments(props.postid);
    setComments(update);
  };

  const refreshComment = async (e) => {
    const update = await getComments(props.postid);
    setComments(update);
  };

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  
  const firstRendering = useRef(true);
  useEffect(() => {
    async function updateComments() {
      const data = await getComments(props.postid);
      setComments(data);
    }
    // only load data on the first rendering
    if (firstRendering.current) {
      firstRendering.current = false;
      updateComments();
    }
  });

  return (
    <Modal
      data-testid="post-modal-parent"
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-post-detail"
      aria-describedby="modal-post-detail"
    >
      <Box data-testid="post-modal-child" sx={modalStyle}>
        {/* image */}
        <Box style={{ overflowX: 'auto' }}>
              <img
                src={props.image}
                srcSet={props.image}
                loading="lazy"
                className="UserPost"
              />

        </Box>
        {/* content */}
        <Box className="rightBox">
          {/* header */}
              <Box sx={{
                height: 50, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #efefef',
              }}
              >
                <Avatar src={props.userImage} aria-label="recipe" />
                <Box>
                  <span style={{ display: 'block' }}>{props.name}</span>
                  {/* <span style={{display:'block'}}>{props.name}</span> */}
                </Box>
                {props.userid === props.ownerid
                  ? (
                    <>
                  <IconButton
                    data-testid="follow"
                    aria-label="follows"
                    userid={props.userid}
                    ownerid={props.ownerid}
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
                  )
                  : (
                    <IconButton aria-label="settings" onClick={props.handleFollowClick}>
                      <PersonAddIcon style={{ color: props.isFollow ? red[500] : grey[300] }} />
                    </IconButton>
                  )}
              </Box>
          {/* caption */}
          <Box className="captionBox">
            {
                            captionEdit ? (
                              <TextField
                                data-testid="test-captionTextField"
                                className="captionEdit"
                                onChange={(e) => captionEditFunction(e)}
                                type="textarea"
                                name="caption"
                                value={caption}
                                multiline
                              />
                            ) : (
                              <span>
                                {caption}
                              </span>
                            )
                        }
            {
                            captionEdit ? (
                              <div>
                                <IconButton
                                  data-testid="test-cancelCaptionEditButton"
                                  className="captionEditButton"
                                  aria-label="like"
                                  onClick={() => cancelCaptionEdit()}
                                >
                                  <Clear style={{ color: red[500] }} />
                                </IconButton>
                                <IconButton
                                  data-testid="test-submitCaptionButton"
                                  className="captionEditButton"
                                  aria-label="like"
                                  onClick={() => submitCaption()}
                                >
                                  <Check style={{ color: red[500] }} />
                                </IconButton>
                              </div>
                            ) : (
                                props.ownerid === props.userid ? (
                                    <IconButton
                                        data-testid="test-editCaptionButton"
                                        className="captionEditButton"
                                        aria-label="like"
                                        onClick={() => setCaptionEdit(!captionEdit)}
                                    >
                                      <ModeEdit style={{ color: captionEdit ? red[500] : grey[300] }} />
                                    </IconButton>
                                ) : <></>
                            )
                        }
          </Box>
          {/* comment section */}
          <Box
            sx={{
              '&::-webkit-scrollbar': {
                width: 10,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#01256f',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#95011b',
                borderRadius: 2,
              },
            }}
            style={{ maxHeight: '40%', overflow: 'auto', marginBottom: '5%' }}
          >
            <List data-testid="test-comments">
              {
                  comments.length > 0 && comments.map((value, index) => (
                    <Comment key={index} value={value} data-commentid={value.commentId} handleDelete={handleDeleteComment} refreshComment={refreshComment} />
                  ))
              }
            </List>

          </Box>
          {/* comment input box */}
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <IconButton sx={{ p: '10px' }} aria-label="like" onClick={props.handleLikeClick}>
              <FavoriteIcon style={{ color: props.isLike ? red[500] : grey[300] }} />
            </IconButton>
            <MentionsInput
              data-testid="test-newCommentField"
              style={mentionStyle}
              value={newComment}
              onChange={handleChange}
            >
              <Mention
                trigger="@"
                style={mentionStyle}
                markup="@@@____id__^^^____display__@@@^^^"
                data={users}
              />
            </MentionsInput>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton data-testid="test-submitCommentButton" csx={{ p: '10px' }} aria-label="send comment" onClick={saveComment}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
