import * as React from 'react';
import './UserPost.css';
import userImage from '../Post/user.png';
import PostModal from '../Post/PostModal';
import {fetchComments, unauthorizedUser} from '../../api';

export async function getComments(pid) {
  return fetch(`${fetchComments()}${pid}`, {credentials : "include"})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => error);
}

export default function UserPost(props) {
  const { value } = props;
  const [userid, setUserid] = React.useState(JSON.parse(localStorage.getItem('user_data')).userId);
  const [postid, setPostid] = React.useState(value.postId);
  const [ownerid, setOwnerid] = React.useState(value.userId);
  const [name, setName] = React.useState(value.userName);
  const [caption, setCaption] = React.useState(value.caption);
  const [image, setImage] = React.useState(value.data);
  const [title, setTitle] = React.useState(value.title);
  const [type, setType] = React.useState(value.type);
  const [expanded, setExpanded] = React.useState(false);
  const [comments, setComments] = React.useState([]);

  const handleOpen = async () => {
    const data = await getComments(postid);
    setComments(data);
    setExpanded(true);
  };

  const handleClose = () => {
    setExpanded(false);
  };

  const handleFollowClick = async () => {
    if (isFollow === false) {
      setFollow(true);
    } else {
      setFollow(false);
    }
  };

  const handleLikeClick = async () => {
    if (isLike === false) {
      setLike(true);
    } else {
      setLike(false);
    }
  };

  return (
    <div className="UserPost">
      <img
        src={`${image}`}
        srcSet={`${image}`}
        width="164"
        height="328"
        alt={title}
        loading="lazy"
        onClick={handleOpen}
        onKeyDown={handleOpen}
        className="UserPost"
      />
      <PostModal
        image={image}
        type={type}
        postid={postid}
        userid={userid}
        ownerid={ownerid}
        open={expanded}
        userImage={userImage}
        caption={caption}
        handleClose={handleClose}
        handleLikeClick={handleLikeClick}
        handleFollowClick={handleFollowClick}
        name={name}
        comments={comments}
      />
    </div>
  );
}
