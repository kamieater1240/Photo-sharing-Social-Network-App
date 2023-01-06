import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import OtherUserProfilePage from './components/OtherUserProfilePage/OtherUserProfilePage';
import UserProfilePage from './components/UserProfilePage/UserProfilePage';
import MainActivity from './components/MainActivity/MainActivity';
var W3CWebSocket = require('websocket').w3cwebsocket;
import LogoutComponent from "./components/Logout/Logout";

function App() {
  const [userId, setUserId] = React.useState(localStorage.getItem('UID')||null);
  const client = React.useRef(null);
  const effectRan = React.useRef(false);
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  const userStateChanger = (title) => {
    setUserId(title);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  React.useEffect(() => {
    if (userId === null && effectRan.current === true) {
      effectRan.current = false;
    }
    if (userId !== null && effectRan.current === false) {
      console.log(userId);
      console.log('open connection');
      effectRan.current = true;
      client.current = new W3CWebSocket(`ws://localhost:8080/ws?userId=${userId}`);
      client.onopen = () => {
        console.log('client connected to ws');
      }
      client.onerror = function() {
        console.log('connection Error');
      }
      client.onmessage = (message) => {
        setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
        console.log(message);
      }
    }
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [userId, snackPack, messageInfo, open])

  
  return (
    <div className="App">
      <Router>
        <Navbar userStateChanger={userStateChanger}/>
        <div className="bodyBox">
          <Routes>
            <Route path="/" element={<MainActivity />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/user/:id" element={<OtherUserProfilePage/>} />
            <Route path="/logout" element={<LogoutComponent/>} />
          </Routes>
        </div>

      </Router>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

export default App;
