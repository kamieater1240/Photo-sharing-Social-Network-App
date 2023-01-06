import React, { useEffect, useState, useRef } from 'react';
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
import photo from '../pictures/Profile Photo.png';
import {
  getAllUserData, getUserFollowingIds, followUser, unfollowUser, getFollow,
} from './UserInfo';

function FollowerSuggestion(props) {
  const {
    uId, userFollowingIds, setUserFollowingIds, userFollowingData,
  } = props;
  const [userId, setUserId] = useState(uId);
  const [suggestedUsers, setSuggestedUsers] = useState({});

  const firstRendering = useRef(true);
  useEffect(() => {
    async function getSuggestFollowers() {
      const allUserData = await getAllUserData(userId);
      const allOtherUserData = allUserData.filter((x) => x.userId != userId);
      const allOtherUserIds = allOtherUserData.map((x) => x.userId);

      // Get the user's following ids
      let data = await getUserFollowingIds(userId);
      const followingIds = data.map((x) => x.followId);
      setUserFollowingIds(followingIds);

      const suggestionIds = [];
      // Get every other users' following ids
      for (const otherUserId of allOtherUserIds) {
        data = await getUserFollowingIds(otherUserId);
        const otherUserFollowingIds = data.map((x) => x.followId);
        let count = 0;
        for (const i in otherUserFollowingIds) {
          if (followingIds.includes(otherUserFollowingIds[i])) {
            count += 1;
            if (count >= 3) { break; }
          }
        }
        // If there are at least 3 common following users, add this other user into suggestion list
        if (count >= 3 && !followingIds.includes(otherUserId)) {
          suggestionIds.push(otherUserId);
        }
      }
      // Use the suggestionIds to filter out the user data from allOtherUserData
      const suggestedUserData = allOtherUserData.filter((x) => suggestionIds.includes(x.userId));
      const slicedArray = suggestedUserData.slice(0, 5);
      setSuggestedUsers(slicedArray);
    }

    // only load data on the first rendering
    if (firstRendering.current) {
      firstRendering.current = false;
      getSuggestFollowers();
    }
  });

  const handleFollowClick = async (e, usId, otherUserId, isFollow) => {
    if (isFollow === false) {
      await followUser(usId, otherUserId);

      const followingData = await getUserFollowingIds(usId);
      const followingIds = followingData.map((x) => x.followId);
      setUserFollowingIds(followingIds);
    } else {
      const data = await getFollow(usId, otherUserId);
      const followId = data.followDataId;
      await unfollowUser(followId);

      const followingData = await getUserFollowingIds(usId);
      const followingIds = followingData.map((x) => x.followId);
      setUserFollowingIds(followingIds);
    }
  };

  return (
    <div className="FollowerSuggestion">
      <Box sx={{
        width: 300, position: 'absolute', top: 90, right: 5,
      }}
      >
        <Typography
          id="ellipsis-list-demo"
          level="body4"
          textTransform="uppercase"
          fontWeight="xl"
          mb={1}
          sx={{ letterSpacing: '0.15rem' }}
        >
          Follower Suggestions
        </Typography>
        <List
          aria-labelledby="ellipsis-list-demo"
          sx={{ '--List-decorator-size': '56px' }}
        >
          {Object.values(suggestedUsers).map((item, index) => (
            <ListItem key={index}>
              <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                <Avatar src={item.profilePicture} />
              </ListItemDecorator>
              <ListItemContent>
                <Typography>{item.userName}</Typography>
              </ListItemContent>
              <IconButton aria-label="settings" data-testid="personAdd" onClick={(event) => handleFollowClick(event, userId, item.userId, userFollowingIds.includes(item.userId))}>
                <PersonAddIcon style={{ color: userFollowingIds.includes(item.userId) ? red[500] : grey[300] }} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
}

export default FollowerSuggestion;
