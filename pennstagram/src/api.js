const API_ROOT = 'http://localhost:8080/';
// const API_ROOT = 'http://pennstagram-backend.herokuapp.com/';
exports.FRONT_END_ROOT = 'http://localhost:3000';

exports.fetchPosts = function () {
  return `${API_ROOT}` + 'post';
};

exports.fetchUserPost = function () {
  return `${API_ROOT}` + 'post?userId=';
};

exports.createPost = function () {
  return `${API_ROOT}upload/post`;
};

exports.updateCaption = function () {
  return `${API_ROOT}post/updateCaption`;
};

exports.createComment = function () {
  return `${API_ROOT}` + 'comment';
};

exports.deleteComment = function () {
  return `${API_ROOT}` + 'comment';
};

exports.updateComment = function () {
  return `${API_ROOT}` + 'comment';
};

exports.fetchComments = function () {
  return `${API_ROOT}` + 'comment?postId=';
};

exports.createComment = function () {
  return `${API_ROOT}` + 'comment';
};

exports.follow = function () {
  return `${API_ROOT}` + 'follow';
};

exports.fetchUserData = function () {
  return `${API_ROOT}` + 'user?userId=';
};

exports.fetchAllUser = function () {
  return `${API_ROOT}` + 'user';
};

exports.login = function () {
  return `${API_ROOT}auth/signin`;
};

exports.logout = function () {
  return `${API_ROOT}auth/signout`;
};

exports.fetchUserFollowing = function () {
  return `${API_ROOT}` + 'follow?userId=';
};

exports.fetchUserFollower = function () {
  return `${API_ROOT}` + 'follow?followId=';
};

exports.likePost = function () {
  return `${API_ROOT}` + 'like';
};

exports.fetchPostLike = function () {
  return `${API_ROOT}` + 'like?userid=';
};

exports.signUpUser = function () {
  return `${API_ROOT}auth/signup`;
};

exports.uploadProfilePic = function () {
  return `${API_ROOT}upload/profilePicture`;
};

exports.hidePost = function () {
  return `${API_ROOT}` + 'visibility';
};

exports.fetchUserVisibility = function () {
  return `${API_ROOT}` + 'visibility?userId=';
};

exports.unauthorizedUser = function() {
  alert("User Session Invalid")
  window.location.href = 'http://localhost:3000/logout'
}
