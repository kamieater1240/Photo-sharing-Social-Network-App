import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppBar, Box, Button, Container, IconButton, Modal,} from '@mui/material';
import {AddAPhoto, Home, Logout, Person,} from '@mui/icons-material';
import LoginModal from '../modals/LoginModal';
import SignupModal from '../modals/SignupModal';
import logo from './logo1.jpg';
import './style.css';
import UploadModal from '../modals/UploadModal';
import {login, logout} from "../../api";

async function logoutUser() {
    return fetch(`${logout()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials : 'include'
    })
        .then(async (data) => {
            if(data.status >= 400)
                throw Error(await data.json())
            return data.json()
        })
        .catch((error) => {
            throw error;
        });
}

function Navbar(props) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [loginAlert, setLoginAlert] = useState(false);
  const [signupAlert, setSignupAlert] = useState(false);
  const [loginResult, setLoginResult] = useState(null);
  const [signupResult, setSignupResult] = useState(null);
  const [user, setUser] = useState(localStorage.getItem('UID') || null);
  const [isImage, setIsImage] = useState(true);
  const [type, setType] = useState('');

  const onClickLogout = async () => {
      // e.preventDefault();
      try {
          await logoutUser();
          localStorage.removeItem('user_data');
          localStorage.removeItem('UID');
          setUser(null);
          navigate('/');
          navigate(0);
      } catch (err) {
          alert('Error Logging Out, please try again');
      }
  };

  const setUploadModal = (e) => {
    setSelectedImage(e.target.files[0]);
    console.log(e.target.files[0]);

    const fileType = e.target.files[0].type.split('/')[0];
    if (fileType === 'video') setIsImage(false);

    setType(e.target.files[0].type);
    setOpenUpload(true);
  };

  return (
    <Box className="boxNavBar">
      <AppBar sx={{
        width: '100vw', backgroundColor: 'white', boxShadow: 'none', position: 'sticky',
      }}
      >
        <Container maxWidth="x1" sx={{ display: { xs: 'contents', sm: 'flex' }, justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex', justifyContent: 'center', p: 1, alignItems: 'center', cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <img id="logo" src={logo} />
          </Box>
          {
                        user === 'null' || user === null
                          ? (
                            <Box sx={{
                              p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                            >

                              <Button
                                variant="text"
                                sx={{
                                  color: '#01256E', mr: 1, fontWeight: 'bold', borderRadius: '25px',
                                }}
                                onClick={() => setOpenLogin(true)}
                              >
                                Login
                              </Button>
                              <Button
                                variant="contained"
                                sx={{ fontWeight: 'bold', borderRadius: '25px', backgroundColor: '#95001A' }}
                                onClick={() => setOpenSignup(true)}
                              >
                                Sign Up
                              </Button>
                            </Box>
                          )
                          : (
                            <Box
                              sx={{
                                p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5%',
                              }}
                            >
                              <Button
                                variant="contained"
                                name="home"
                                color="primary"
                                sx={{ fontWeight: 'bold', borderRadius: '25px' }}
                                onClick={() => navigate('/')}
                              >
                                <Home />
                              </Button>
                              <label htmlFor="upload-photo">
                                <input
                                  style={{ display: 'none' }}
                                  id="upload-photo"
                                  name="upload-photo"
                                  type="file"
                                  accept={"image/jpeg"}
                                  onChange={(e) => setUploadModal(e)}
                                />
                                <IconButton
                                  sx={{ mr: 1 }}
                                  color="secondary"
                                  size="small"
                                  component="span"
                                  aria-label="add"
                                >
                                  <AddAPhoto />
                                </IconButton>
                              </label>
                              ;
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{ fontWeight: 'bold', borderRadius: '25px' }}
                                onClick={() => navigate('/profile')}
                              >
                                <Person />
                              </Button>
                              <Button
                                color="primary"
                                variant="text"
                                sx={{ mr: 1, fontWeight: 'bold' }}
                                onClick={onClickLogout}
                              >
                                <Logout />
                              </Button>
                            </Box>
                          )
                    }
        </Container>
      </AppBar>

      <Modal open={openLogin} onClose={() => setOpenLogin(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoginModal userStateChanger={(title) => props.userStateChanger(title)} setOpen={setOpenLogin} setLoginAlert={setLoginAlert} />
      </Modal>
      <Modal open={openSignup} onClose={() => setOpenSignup(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SignupModal setOpen={setOpenSignup} setSignupAlert={setSignupAlert} setResult={setSignupResult} />
      </Modal>
      <Modal open={openUpload} onClose={() => setOpenUpload(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <UploadModal setOpen={setOpenUpload} setSelectedImage={selectedImage} isImage={isImage} type={type} />
      </Modal>

    </Box>
  );
}

export default Navbar;
