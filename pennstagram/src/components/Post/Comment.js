import * as React from 'react';
import { useState } from 'react';
import {
  Avatar, Box, Divider, IconButton, InputBase, ListItem, ListItemAvatar, ListItemText,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import parse from 'html-react-parser';
import user from './user.png';
import {unauthorizedUser, updateComment} from '../../api';

export async function editComment(commentId, postId, userId, userName, newComment) {
  return fetch(`${updateComment()}` + `/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include',
    body: JSON.stringify({
      postId: postId,
      userId: userId,
      userName : userName,
      commentText: newComment,
    }),
  })
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => error);
}

export default function Comment(props) {
  const [postid, setPostid] = useState(props.value.postId);
  const [userid, setUserid] = useState(props.value.userId);
  const [username, setUsername] = useState(props.value.userName);
  const [commentid, setCommentid] = useState(props.value.commentId);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState(props.value.commentText);
  const [editPermission, setEditPermission] = useState(props.value.userId === localStorage.getItem('UID')); 
  

  const handleEdit = async (e) => {
    if (isEditing == false) {
      setIsEditing(true);
    } else {
      const data = await editComment(commentid, postid, userid, username, newComment);
      setIsEditing(false);
      // props.refreshComment();
    }
  };

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  return (
    <Box data-testid="parent">
      <ListItem alignItems="flex-start" data-testid="child">
        <ListItemAvatar>
          <Avatar alt="Lucy Song" src={user} />
        </ListItemAvatar>
        { isEditing == false ? (
            <ListItemText
              primary={
                props.value.userName
            }
              secondary={
                parse(newComment)
            }
            />
          )
          : (
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={newComment}
              inputProps={{ 'aria-label': 'Add a comment..' }}
              onChange={handleChange}
            />
          )
        }
        
        { editPermission && isEditing === false ? (
          <div>
          <IconButton sx={{ p: '10px' }} aria-label="edit" onClick={handleEdit}>
            <EditIcon style={{ color: grey[300] }} /> 
          </IconButton>
          <IconButton data-testid={`testDelete-CommentButton${props.value.commentId}`} sx={{ p: '10px' }} aria-label="delete" data-commentid={props.value.commentId} onClick={props.handleDelete}>
            <DeleteIcon style={{ color: grey[300] }} />
          </IconButton>
          </div>
          )
          : editPermission && isEditing === true ? (
          <div>
          <IconButton sx={{ p: '10px' }} aria-label="edit" onClick={handleEdit}>
            <CheckIcon style={{ color: grey[300] }} />
          </IconButton>
          <IconButton data-testid={`testDelete-CommentButton${props.value.commentId}`} sx={{ p: '10px' }} aria-label="delete" data-commentid={props.value.commentId} onClick={props.handleDelete}>
            <DeleteIcon style={{ color: grey[300] }} />
          </IconButton>
          </div>
          )
          : (
            <div></div>
          )
        }  
      </ListItem>
      <Divider />
    </Box>
  );
}
