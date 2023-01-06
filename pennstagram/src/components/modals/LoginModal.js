import React, {forwardRef, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
} from '@mui/material';
import {PropaneSharp, Visibility, VisibilityOff} from '@mui/icons-material';
import './style.css';
import {login} from '../../api';
import {useNavigate} from "react-router-dom";
var W3CWebSocket = require('websocket').w3cwebsocket;


async function loginUser(data) {
  return fetch(`${login()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include',
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  })
    .then(async (data) => {
        if(data.status >= 400) {
            const error = await data.json()
            console.log(error);
            throw Error(error.message)
        }
        return data.json()
    })
    .catch((error) => {
        console.log("Error",error.message)
        throw Error(error.message);
    });
}
const LoginModal = forwardRef(({ userStateChanger, setOpen, setLoginAlert, setResult }, ref) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorHint, setErrorHint] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    try {
      const user = await loginUser(data);
      if (user.userId !== null) {
        await localStorage.setItem("user_data", JSON.stringify(user));
        await localStorage.setItem("UID", user.userId);
        userStateChanger(JSON.parse(JSON.stringify(user)).userId);
        localStorage.setItem('limit',3);
        window.location.reload(true);
      }
    } catch (err) {
        // console.log(err.message);
        // const error = JSON.parse("\"" + err + "\"")
      setErrorHint(`Error login : ${err.message}`);
    }
  };

  // const { values, handleSubmit, handleChange, resetForm, isValid } = useFormik({
  //     initialValues: {
  //         email: '',
  //         password: '',
  //     },
  //     onSubmit: async values => {
  //         let email = values.email;
  //         let password = values.password;
  //
  //         var data = {
  //             email: email,
  //             password: password,
  //         };
  //         var result = await loginUser(data);
  //         if (result.length === 1)
  //         {
  //             var user = result[0];
  //             resetForm();
  //             if (user.id !== null) {
  //                 localStorage.setItem('UID', user.id);
  //                 setResult(result);
  //                 setOpen(false);
  //                 window.location.reload();
  //             }
  //         } else {
  //             setErrorHint("Error login, please try again");
  //         }
  //     },
  // });

  return (
    <Box component="form" className="loginBox">
      <Box sx={{ backgroundColor: 'primary', height: '1rem', mb: 5 }} />
      <Typography variant="h2" sx={{ m: 1, textAlign: 'center' }}>Login</Typography>
      <TextField
        data-testid="add-email-input"
        sx={{ mx: { xs: 1, md: 5 }, my: 2 }}
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormControl sx={{ mx: { xs: 1, md: 5 }, my: 2 }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          data-testid="add-password-input"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
                      )}
          label="Password"
        />
        <FormHelperText id="login-error-text">{errorHint}</FormHelperText>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{ mt: 1, backgroundColor: '#01256E' }}
          variant="contained"
          data-testid="submitButton"
          type="submit"
          name="login-modal-submit"
          onClick={handleSubmit}
        >
          LOGIN
        </Button>
      </Box>
      <Box sx={{ backgroundColor: 'primary', height: '1rem', mt: 5 }} />
    </Box>

  );
});

export default LoginModal;
