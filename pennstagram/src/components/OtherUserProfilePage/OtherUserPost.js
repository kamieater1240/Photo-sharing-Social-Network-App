import * as React from 'react';
import './OtherUserPost.css';
import userImage from '../Post/user.png';
import PostModal from '../Post/PostModal';
import {fetchComments, unauthorizedUser} from '../../api';

async function getComments(pid) {
  return fetch(`${fetchComments()}${pid}`,{credentials : 'include'})
    .then((data) => {
      if(data.status === 401) unauthorizedUser()
      return data.json()
    })
    .catch((error) => {
      console.log(error);
    });
}

export default function OtherUserPost(props) {
  const [userid, setUserid] = React.useState(props.id);
  const [postid, setPostid] = React.useState(props.value.postId);
  const [name, setName] = React.useState(props.value.userName);
  const [caption, setCaption] = React.useState(props.value.caption);
  const [image, setImage] = React.useState(props.value.data);
  const [title, setTitle] = React.useState(props.value.title);
  const [type, setType] = React.useState(props.value.type);
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
    <div className="OtherUserPost">
      <img
        src={`${image}`}
        srcSet={`${image}`}
        width="164"
        height="328"
        alt={title}
        loading="lazy"
        onClick={handleOpen}
        onKeyDown={handleOpen}
        className="OtherUserPost"
      />
      <PostModal image={image} type={type} postid={postid} userid={userid} open={expanded} userImage={userImage} caption={caption} handleClose={handleClose} handleLikeClick={handleLikeClick} handleFollowClick={handleFollowClick} name={name} comments={comments} />
    </div>
  );
}
