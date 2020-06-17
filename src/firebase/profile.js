const updateUserProfile = (userName) => {
  firebase.auth().currentUser.updateProfile({
    displayName: userName,
  });
};
export { updateUserProfile };
