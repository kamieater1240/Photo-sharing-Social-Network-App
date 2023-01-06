import React, {forwardRef, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  InputLabel,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {useFormik} from 'formik';
import MenuItem from '@mui/material/MenuItem';
import {createPost, fetchAllUser, FRONT_END_ROOT, unauthorizedUser} from '../../api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export async function uploadImage(data) {
  return fetch(`${createPost()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials : 'include',
    body: JSON.stringify(data),
  })
    .then((response) => {
      if(result.status === 401) unauthorizedUser()
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function getStyles(name, personName, theme) {
  return {
    fontWeight:
            personName.indexOf(name) === -1
              ? theme.typography.fontWeightRegular
              : theme.typography.fontWeightMedium,
  };
}

export async function fetchUsers() {
  return await fetch(fetchAllUser(), {credentials : 'include'}).then((result) => {
    if(result.status === 401) unauthorizedUser()
    return result.json();
  }).then((result) => {
    const fetchedUsers = result;
    const userObject = [];
    fetchedUsers.forEach((user) => {
      const temp = {};
      temp.id = user.userId;
      temp.display = user.userName;
      userObject.push(temp);
    });
    console.log('userObject', userObject);
    return userObject;
  }).catch((err) => {
    throw err;
  });
}

const UploadModal = forwardRef(({
  setOpen, setSelectedImage, isImage, type,
}, ref) => {
  const theme = useTheme();
  const [user, setUser] = useState(localStorage.getItem('UID') || null);
  const [allUsers, setAllUsers] = useState([]);
  const [image, setImage] = useState(null);
  const [imageString, setImageString] = useState(null)
  const [previewImage, setPreviewImage] = useState(null);
  const [taggedUsers, setTaggedUsers] = useState([]);

  const {
    values, handleSubmit, handleChange, resetForm, isValid,
  } = useFormik({
    initialValues: {
      caption: '',
      private: false,
    },
    onSubmit: async (values) => {
      const data = {
        userId: user,
        userName : JSON.parse(localStorage.getItem('user_data'))['userName'],
        data: imageString,
        caption: values.caption,
        isImage,
        type: type,
        tagged: taggedUsers,
      };
      console.log("Form Values" , data);
      const response = await uploadImage(data);
      console.log(response);
      resetForm();
      setOpen(false);
      window.location.reload(true);
    },
  });

  useEffect(() => {
    setImage(setSelectedImage);
    setPreviewImage(URL.createObjectURL(setSelectedImage));
    getBase64(setSelectedImage)
  }, [setSelectedImage]);

  const onLoadCallBack = (fileString) => {
    setImageString(fileString)
  }


  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      onLoadCallBack(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  useEffect(() => {
    async function tryFetchUsers() {
      try {
        await fetchUsers().then((r) => setAllUsers(r));
      } catch (err) {
        console.log('Error fetching users for tagging');
      }
    }
    tryFetchUsers();
  }, []);

  const handleTagInputChange = (event) => {
    const {
      target: { value },
    } = event;
    setTaggedUsers(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Box component="form" className="uploadBox">
      <Box sx={{ backgroundColor: 'primary', height: '1rem', mb: 5 }} />
      <Typography variant="h2" sx={{ m: 1, textAlign: 'center' }}>Upload Photo</Typography>
      <Grid container spacing={2}>
        {previewImage
          ? (
            <Grid item xs={6} md={8}>
              {
                            isImage
                              ? <img className="imageUploadBox" src={previewImage} />
                              : (
                                <video className="imageUploadBox" controls>
                                  <source src={previewImage} type={type} />
                                </video>
                              )
                        }
            </Grid>
          ) : <></>}
        <Grid item xs={6} md={4}>
          <TextField
            data-testid="test-caption"
            sx={{
              minWidth: '20vw', display: 'block', width: '-webkit-fill-available', marginRight: '4%',
            }}
            onChange={handleChange}
            label="Caption"
            type="textarea"
            name="caption"
            value={values.caption}
            multiline
            fullWidth
            rows={6}
          />
          <div style={{ display: 'block', marginTop: '8%', marginRight: '4%' }}>
            <InputLabel
              id="simple-select-taggedusers-label"
            >
              Tag Users
            </InputLabel>
            <Select
              style={{ marginTop: '1%', marginRight: '4%!important', minWidth: '100%' }}
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={taggedUsers}
              onChange={(e) => handleTagInputChange(e)}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              { allUsers.length > 0 ? (
                allUsers.map((user, index) => (
                  <MenuItem
                    key={`tagUser-${index}`}
                    value={user.display}
                    style={getStyles(user.display, user.display, theme)}
                    onClick={handleTagInputChange}
                  >
                    {user.display}
                  </MenuItem>
                ))) : <div />}
            </Select>
          </div>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          data-testid="submitButton"
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Submit
        </Button>
      </Box>
      <Box sx={{ backgroundColor: 'primary', height: '1rem', mt: 5 }} />
    </Box>

  );
});

export default UploadModal;
