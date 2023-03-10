import React, { forwardRef, useState } from 'react';
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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import './style.css';
import { signUpUser } from '../../api';

export async function registerUser(data) {
  return fetch(`${signUpUser()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => {
      throw error;
    });
}

const SignupModal = forwardRef(({ setOpen, setSignupAlert, setResult }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorHint, setErrorHint] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const {
    handleChange, handleBlur, errors, touched, isValid, values, handleSubmit, resetForm,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
        try {
            const { email, password, firstName, lastName} = values;
            const data = {
                firstName,
                lastName,
                email,
                password,
                biography: '',
            };
            const result = await registerUser(data);
            resetForm();
            if (!result.error) {
                setOpen(false);
                window.location.reload(true);
            } else {
                throw Error ("Error signing up")
            }
        } catch (err) {
            setErrorHint('Error signing up, please try again');
        }
    },
  });

  return (
    <Box component="form" className="signUpBox">
      <Box sx={{ backgroundColor: '#01256E', height: '1rem', mb: 5 }} />
      <Typography variant="h2" sx={{ m: 1, textAlign: 'center' }}>Sign Up</Typography>
      <TextField
        sx={{ mx: { xs: 1, md: 5 }, my: 2 }}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.firstName && errors.firstName}
        helperText={touched.firstName && errors.firstName}
        label="First Name"
        type="text"
        name="firstName"
        value={values.firstName}
      />
      <TextField
        sx={{ mx: { xs: 1, md: 5 }, my: 2 }}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.lastName && errors.lastName}
        helperText={touched.lastName && errors.lastName}
        label="Last Name"
        type="text"
        name="lastName"
        value={values.lastName}
      />
      <TextField
        sx={{ mx: { xs: 1, md: 5 }, my: 2 }}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
        helperText={touched.email && errors.email}
        label="Email"
        type="email"
        name="email"
        value={values.email}
      />
      <FormControl sx={{ mx: { xs: 1, md: 5 }, my: 2 }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && errors.password}
          name="password"
          value={values.password}
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
        {touched.password && <FormHelperText sx={{ color: '#2196f3' }}>{errors.password}</FormHelperText>}
          <FormHelperText id="login-error-text">{errorHint}</FormHelperText>
      </FormControl>
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', mx: { xs: 1, md: 5 }, my: 2,
      }}
      >
        <Button
          sx={{ mt: 1, backgroundColor: '#01256E' }}
          name={"signUpSubmitModalButton"}
          variant="contained"
          color="primary"
          disabled={!isValid}
          type="submit"
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </Box>
      <Box sx={{ backgroundColor: '#01256E', height: '1rem', mt: 5 }} />
    </Box>
  );
});

export default SignupModal;
