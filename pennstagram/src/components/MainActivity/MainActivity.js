import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Post from '../Post/Post';
import upenn from './upenn.jpg';
import {FRONT_END_ROOT, fetchPosts, unauthorizedUser, fetchUserVisibility} from '../../api';
import './MainActivity.css';
import InfiniteScroll from "react-infinite-scroll-component";
import {useNavigate} from "react-router-dom";

let page = 1;
const getPosts = (setPosts, posts, visibilityData, limit) => {
  return fetch(`${fetchPosts()}`+ `?&_limit=${limit}`,{credentials : 'include'})
        .then((res) => {
          if(res.status === 401) unauthorizedUser();
          return res.json()
        })
        .then((data) => {
          for (let i = 0; i < visibilityData.length; i++) {
            data = data.filter((x) => x.postId != visibilityData[i].postId);
          }
          console.log(data);
          limit=[...data].length + 3;
          localStorage.setItem('postsNumber',[...data].length)
          localStorage.setItem('limit',limit);
          return [...data];
        })
        .catch(console.log);
}

export async function getUserVisibility(uid) {
  return fetch(`${fetchUserVisibility()}${uid}`,{credentials : 'include'})
    .then((data) => {
      if(data.status === 401) unauthorizedUser();
      return data.json()
    })
    .catch((error) => error);
}

const refresh = (setPosts) => {};
function MainActivity(props) {
  const [user, setUser] = useState(localStorage.getItem('UID') || null);
  const [posts, setPosts] = useState([]);

  // async function handleFetchPosts() {
  //   await getPosts(setPosts, posts);
  // }
  const effectRan = useRef(true);
  useEffect(() => {
    async function loadPostData() {
      if(user != null) {
        let visibilityData = await getUserVisibility(user);
        const limit = localStorage.getItem('limit');
        const data = await getPosts(setPosts, posts, visibilityData,limit);
        localStorage.setItem('postsNumber',[...data].length)
        console.log(data);
        setPosts(data);
      }
    }

    // only load data on the first rendering
    if (effectRan.current) {
      effectRan.current = false;
      loadPostData();
    }
    return () => {effectRan.current = true};
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      async function poll() {
        if(user != null) {
          let visibilityData = await getUserVisibility(user);
          const previousNumberOfPosts = localStorage.getItem('postsNumber')
          const limit = localStorage.getItem('limit');
          const data = await getPosts(setPosts, posts, visibilityData,limit);
          if(localStorage.getItem('postsNumber') > previousNumberOfPosts) {
            window.location.reload(true);
          }
        }
      }

      poll(posts);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    
    <Box className="boxMainPage">
      {
                user === 'null' || user === null
                  ? (
                    <Box className="loginPage">
                      <img src={upenn} />
                    </Box>
                  )
                  : (
                    <Box role="root" sx={{ position: 'absolute', top: 130, left: 150 }}>
                    {/*  <InfiniteScroll*/}
                    {/*  dataLength={posts.length}*/}
                    {/*  next={() => {*/}
                    {/*    getPosts(setPosts, posts);*/}
                    {/*  }}*/}
                    {/*  hasMore={true}*/}
                    {/*  loader={<h4>Loading...</h4>}*/}
                    {/*  endMessage={*/}
                    {/*    <p style={{textAlign: "center"}}>*/}
                    {/*      <b>Yay! You have seen it all</b>*/}
                    {/*    </p>*/}
                    {/*  }*/}
                    {/*  refreshFunction={refresh}*/}
                    {/*  pullDownToRefresh*/}
                    {/*  pullDownToRefreshThreshold={3}*/}
                    {/*  pullDownToRefreshContent={*/}
                    {/*    <h3 style={{textAlign: "center"}}>Pull down to refresh</h3>*/}
                    {/*  }*/}
                    {/*  releaseToRefreshContent={*/}
                    {/*    <h3 style={{textAlign: "center"}}>Release to refresh</h3>*/}
                    {/*  }*/}
                    {/*>*/}
                    <Grid data-testid="parent" container spacing={2}>
                        {
                          [...posts].length > 0 ? (
                              [...posts].map((data, index) => (
                              <Grid key={index} data-testid="post" item xs="auto">
                              <Post value={data} fetchPosts={getPosts}>child element</Post>
                              </Grid>
                              ))
                          ) : ( <p>
                                There are no posts to display
                              </p>
                          )}
                      </Grid>
                    {/*</InfiniteScroll>*/}
                      
                    </Box>
                  )
            }
    </Box>
  );
}

export default MainActivity;
